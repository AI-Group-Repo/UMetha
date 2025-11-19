"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { useChatRealtime } from "@/hooks/useChatRealtime";
import type {
  ConversationWithProfile,
  MessageRow,
} from "@/types/chat";

type ChatWorkspaceProps = {
  initialConversationId?: string | null;
  emptyStateHeading?: string;
  emptyStateDescription?: string;
};

const CHAT_BUCKET = "chat-media";

const sortMessages = (items: MessageRow[]) => {
  const getTime = (value?: string | null) =>
    value ? new Date(value).getTime() : 0;
  return [...items].sort(
    (a, b) => getTime(a.created_at) - getTime(b.created_at)
  );
};

export const ChatWorkspace = ({
  initialConversationId = null,
  emptyStateHeading,
  emptyStateDescription,
}: ChatWorkspaceProps) => {
  const { user, isLoading } = useAuth();
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);

  const [conversations, setConversations] = useState<
    ConversationWithProfile[]
  >([]);
  const [messagesByConversation, setMessagesByConversation] = useState<
    Record<string, MessageRow[]>
  >({});
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(initialConversationId);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const selectedConversation = useMemo(
    () =>
      conversations.find(
        (conversation) => conversation.id === selectedConversationId
      ) || null,
    [conversations, selectedConversationId]
  );

  const activeMessages =
    (selectedConversationId &&
      messagesByConversation[selectedConversationId]) ||
    [];

  const resolveAuthHeaders = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    return token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {};
  }, [supabase]);

  const fetchConversations = useCallback(async () => {
    setIsLoadingConversations(true);
    try {
      const headers = await resolveAuthHeaders();
      const response = await fetch("/api/chat/get-conversations", {
        headers,
      });
      if (!response.ok) {
        throw new Error("Failed to load conversations");
      }
      const payload = await response.json();
      const nextConversations = payload.conversations || [];
      setConversations(nextConversations);

      if (!selectedConversationId && nextConversations.length) {
        setSelectedConversationId(nextConversations[0].id);
      } else if (
        selectedConversationId &&
        nextConversations.length &&
        !nextConversations.find((conversation: ConversationWithProfile) => conversation.id === selectedConversationId)
      ) {
        setSelectedConversationId(nextConversations[0].id);
      }
    } catch (error) {
      console.error(error);
      toast.error("Unable to load conversations");
    } finally {
      setIsLoadingConversations(false);
    }
  }, [resolveAuthHeaders, selectedConversationId]);

  const fetchMessages = useCallback(
    async (conversationId: string) => {
      if (!conversationId) return;
      setIsLoadingMessages(true);
      try {
        const headers = await resolveAuthHeaders();
        const response = await fetch(
          `/api/chat/get-messages?conversationId=${conversationId}`,
          { headers }
        );
        if (!response.ok) {
          throw new Error("Failed to load messages");
        }
        const payload = await response.json();
        setMessagesByConversation((prev) => ({
          ...prev,
          [conversationId]: sortMessages(payload.messages || []),
        }));

        setConversations((prev) =>
          prev.map((conversation) =>
            conversation.id === conversationId
              ? {
                  ...conversation,
                  unread_count: 0,
                  unread_buyer:
                    conversation.buyer_id === user?.id
                      ? 0
                      : conversation.unread_buyer,
                  unread_influencer:
                    conversation.influencer_id === user?.id
                      ? 0
                      : conversation.unread_influencer,
                }
              : conversation
          )
        );
      } catch (error) {
        console.error(error);
        toast.error("Unable to load messages");
      } finally {
        setIsLoadingMessages(false);
      }
    },
    [resolveAuthHeaders, user?.id]
  );

  useEffect(() => {
    if (!user) return;
    fetchConversations();
  }, [fetchConversations, user]);

  useEffect(() => {
    if (selectedConversationId) {
      fetchMessages(selectedConversationId);
    }
  }, [fetchMessages, selectedConversationId]);

  useEffect(() => {
    if (initialConversationId) {
      setSelectedConversationId(initialConversationId);
    }
  }, [initialConversationId]);

  const { onlineUsers, typingUsers, emitTypingStart, emitTypingStop } =
    useChatRealtime({
    conversationId: selectedConversationId,
    currentUserId: user?.id ?? null,
    onMessage: (message) => {
      setMessagesByConversation((prev) => {
        const existing = prev[message.conversation_id] || [];
        const next = existing.some((item) => item.id === message.id)
          ? existing
          : sortMessages([...existing, message]);
        return {
          ...prev,
          [message.conversation_id]: next,
        };
      });
    },
      onConversationUpdate: (conversation) => {
        setConversations((prev) =>
          prev.map((item) =>
            item.id === conversation.id
              ? {
                  ...item,
                  ...conversation,
                  unread_count:
                    conversation.buyer_id === user?.id
                      ? conversation.unread_buyer
                      : conversation.unread_influencer,
                }
              : item
          )
        );
      },
    });

  const handleSendMessage = useCallback(
    async (payload: { text?: string; imageUrl?: string }) => {
      if (!selectedConversationId) return;
      setIsSending(true);
      try {
        const headers = await resolveAuthHeaders();
        const response = await fetch("/api/chat/send-message", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...headers,
          },
          body: JSON.stringify({
            conversationId: selectedConversationId,
            ...payload,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to send message");
        }

        const data = await response.json();
        if (data.message) {
          setMessagesByConversation((prev) => {
            const existing = prev[selectedConversationId] || [];
            return {
              ...prev,
              [selectedConversationId]: sortMessages([
                ...existing,
                data.message,
              ]),
            };
          });
        }
      } catch (error) {
        console.error(error);
        toast.error("Unable to send message");
      } finally {
        setIsSending(false);
      }
    },
    [resolveAuthHeaders, selectedConversationId]
  );

  const handleUploadImage = useCallback(
    async (file: File) => {
      const path = `${user?.id || "anonymous"}/${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from(CHAT_BUCKET)
        .upload(path, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) {
        console.error(error);
        toast.error("Image upload failed");
        throw error;
      }

      const { data: publicUrlData } = supabase.storage
        .from(CHAT_BUCKET)
        .getPublicUrl(data.path);

      if (!publicUrlData?.publicUrl) {
        throw new Error("Unable to generate image URL");
      }

      return publicUrlData.publicUrl;
    },
    [supabase, user?.id]
  );

  const typingIdsForConversation = useMemo(() => typingUsers, [typingUsers]);

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center rounded-xl border bg-card">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center gap-2 rounded-xl border bg-card text-center">
        <p className="text-lg font-semibold">Sign in required</p>
        <p className="text-sm text-muted-foreground">
          Please sign in to start chatting.
        </p>
      </div>
    );
  }

  if (isLoadingConversations && conversations.length === 0) {
    return (
      <div className="flex h-[70vh] items-center justify-center rounded-xl border bg-card">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!conversations.length && emptyStateHeading) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center gap-2 rounded-xl border bg-card text-center">
        <p className="text-lg font-semibold">{emptyStateHeading}</p>
        {emptyStateDescription && (
          <p className="text-sm text-muted-foreground">
            {emptyStateDescription}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex h-[80vh] flex-col rounded-xl border bg-card lg:h-[calc(100vh-200px)]">
      <div className="flex h-full flex-1 flex-col lg:flex-row">
        <div className="h-64 border-b lg:h-full lg:w-1/3 lg:border-b-0 lg:border-r">
          <ChatSidebar
            conversations={conversations}
            selectedConversationId={selectedConversationId}
            onSelectConversation={(id) => setSelectedConversationId(id)}
            onlineUsers={onlineUsers}
            currentUserId={user.id}
          />
        </div>
        <div className="flex flex-1">
          <ChatWindow
            conversation={selectedConversation}
            messages={activeMessages}
            currentUserId={user.id}
            typingUserIds={typingIdsForConversation}
            onlineUsers={onlineUsers}
            onSendMessage={handleSendMessage}
            onUploadImage={handleUploadImage}
            onTypingStart={emitTypingStart}
            onTypingStop={emitTypingStop}
            isSending={isSending || isLoadingMessages}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatWorkspace;

