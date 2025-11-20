import { useEffect, useMemo, useRef, useState } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import type { Database } from "@/types/supabase";

type MessageRow = Database["public"]["Tables"]["messages"]["Row"];
type ConversationRow = Database["public"]["Tables"]["conversations"]["Row"];

type PresenceState = {
  userId: string;
  online: boolean;
  lastSeen?: string | null;
};

type TypingState = Record<string, number>;

type UseChatRealtimeProps = {
  conversationId?: string | null;
  currentUserId?: string | null;
  onMessage?: (message: MessageRow) => void;
  onConversationUpdate?: (conversation: ConversationRow) => void;
};

export const useChatRealtime = ({
  conversationId,
  currentUserId,
  onMessage,
  onConversationUpdate,
}: UseChatRealtimeProps) => {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [typingUsers, setTypingUsers] = useState<TypingState>({});
  const [onlineUsers, setOnlineUsers] = useState<
    Record<string, PresenceState>
  >({});

  const typingChannelRef = useRef<RealtimeChannel | null>(null);
  const presenceChannelRef = useRef<RealtimeChannel | null>(null);
  const messagesChannelRef = useRef<RealtimeChannel | null>(null);

  // Messages + conversation updates
  useEffect(() => {
    if (!conversationId) {
      return;
    }

    const channel = supabase.channel(`conversation-${conversationId}`);

    channel.on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => {
        if (payload.new) {
          onMessage?.(payload.new as MessageRow);
        }
      }
    );

    channel.on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "conversations",
        filter: `id=eq.${conversationId}`,
      },
      (payload) => {
        if (payload.new) {
          onConversationUpdate?.(payload.new as ConversationRow);
        }
      }
    );

    channel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        messagesChannelRef.current = channel;
      }
    });

    return () => {
      supabase.removeChannel(channel);
      messagesChannelRef.current = null;
    };
  }, [conversationId, onConversationUpdate, onMessage, supabase]);

  // Typing indicator
  useEffect(() => {
    if (!conversationId || !currentUserId) {
      return;
    }

    const channel = supabase.channel(`typing-${conversationId}`);

    channel.on(
      "broadcast",
      { event: "typing:start" },
      ({ payload }: { payload: { userId: string } }) => {
        if (!payload?.userId || payload.userId === currentUserId) {
          return;
        }

        setTypingUsers((prev) => ({
          ...prev,
          [payload.userId]: Date.now(),
        }));
      }
    );

    channel.on(
      "broadcast",
      { event: "typing:stop" },
      ({ payload }: { payload: { userId: string } }) => {
        if (!payload?.userId || payload.userId === currentUserId) {
          return;
        }
        setTypingUsers((prev) => {
          const next = { ...prev };
          delete next[payload.userId];
          return next;
        });
      }
    );

    channel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        typingChannelRef.current = channel;
      }
    });

    const interval = setInterval(() => {
      setTypingUsers((prev) => {
        const next = { ...prev };
        const now = Date.now();
        Object.entries(next).forEach(([key, timestamp]) => {
          if (now - timestamp > 5000) {
            delete next[key];
          }
        });
        return next;
      });
    }, 2000);

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
      typingChannelRef.current = null;
    };
  }, [conversationId, currentUserId, supabase]);

  // Presence channel for online status
  useEffect(() => {
    if (!currentUserId) {
      return;
    }

    const channel = supabase.channel("online-users", {
      config: {
        presence: {
          key: currentUserId,
        },
      },
    });

    const syncPresence = () => {
      const state = channel.presenceState<PresenceState>();
      const flattened = Object.entries(state).reduce<
        Record<string, PresenceState>
      >((acc, [key, values]) => {
        if (values.length > 0) {
          acc[key] = values[values.length - 1];
        }
        return acc;
      }, {});
      setOnlineUsers(flattened);
    };

    channel
      .on("presence", { event: "sync" }, syncPresence)
      .on("presence", { event: "join" }, syncPresence)
      .on("presence", { event: "leave" }, syncPresence);

    channel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        presenceChannelRef.current = channel;
        channel.track({
          userId: currentUserId,
          online: true,
          lastSeen: new Date().toISOString(),
        });
      }
    });

    const handleBeforeUnload = () => {
      channel.track({
        userId: currentUserId,
        online: false,
        lastSeen: new Date().toISOString(),
      });
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      channel.track({
        userId: currentUserId,
        online: false,
        lastSeen: new Date().toISOString(),
      });
      supabase.removeChannel(channel);
      presenceChannelRef.current = null;
    };
  }, [currentUserId, supabase]);

  const emitTypingEvent = (event: "typing:start" | "typing:stop") => {
    if (!currentUserId || !conversationId || !typingChannelRef.current) {
      return;
    }

    typingChannelRef.current.send({
      type: "broadcast",
      event,
      payload: {
        userId: currentUserId,
        conversationId,
      },
    });
  };

  return {
    onlineUsers,
    typingUsers: Object.keys(typingUsers),
    emitTypingStart: () => emitTypingEvent("typing:start"),
    emitTypingStop: () => emitTypingEvent("typing:stop"),
  };
};


