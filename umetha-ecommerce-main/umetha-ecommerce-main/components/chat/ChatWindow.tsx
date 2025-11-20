"use client";

import { useEffect, useMemo, useRef } from "react";
import { format, formatDistanceToNow } from "date-fns";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { MessageComposer } from "@/components/chat/MessageComposer";
import { cn } from "@/lib/utils";
import type { ConversationWithProfile, MessageRow } from "@/types/chat";

type OnlineState = Record<
  string,
  {
    online: boolean;
    lastSeen?: string | null;
  }
>;

type ChatWindowProps = {
  conversation?: ConversationWithProfile | null;
  messages: MessageRow[];
  currentUserId?: string | null;
  typingUserIds?: string[];
  onlineUsers?: OnlineState;
  onSendMessage: (payload: { text?: string; imageUrl?: string }) => Promise<
    void
  >;
  onUploadImage?: (file: File) => Promise<string>;
  onTypingStart?: () => void;
  onTypingStop?: () => void;
  isSending?: boolean;
};

const getDisplayName = (conversation?: ConversationWithProfile | null) => {
  const profile = conversation?.counterpart_profile;
  return (
    profile?.full_name ||
    profile?.username ||
    profile?.email ||
    "Unknown user"
  );
};

export const ChatWindow = ({
  conversation,
  messages,
  currentUserId,
  typingUserIds = [],
  onlineUsers = {},
  onSendMessage,
  onUploadImage,
  onTypingStart,
  onTypingStop,
  isSending,
}: ChatWindowProps) => {
  const viewportRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!viewportRef.current) return;
    viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
  }, [messages, conversation?.id]);

  const counterpartId = conversation?.counterpart_profile?.id;
  const isOnline = counterpartId ? onlineUsers[counterpartId]?.online : false;
  const lastSeen = counterpartId
    ? onlineUsers[counterpartId]?.lastSeen ||
      conversation?.counterpart_profile?.last_seen_at
    : null;

  const typingLabel = useMemo(() => {
    if (!typingUserIds.length || !counterpartId) return null;
    if (typingUserIds.includes(counterpartId)) {
      return `${getDisplayName(conversation)} is typing…`;
    }
    return "Someone is typing…";
  }, [conversation, counterpartId, typingUserIds]);

  if (!conversation) {
    return (
      <div className="flex h-full flex-1 flex-col items-center justify-center border-l bg-muted/40">
        <div className="text-center">
          <p className="text-lg font-semibold">Select a conversation</p>
          <p className="text-sm text-muted-foreground">
            Choose a chat from the sidebar to start messaging.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-1 flex-col bg-background">
      <div className="flex items-center gap-3 border-b px-6 py-4">
        <Avatar className="h-12 w-12">
          <AvatarImage
            src={conversation.counterpart_profile?.avatar_url ?? undefined}
            alt={getDisplayName(conversation)}
          />
          <AvatarFallback>
            {getDisplayName(conversation)
              .split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-semibold">{getDisplayName(conversation)}</div>
          <div className="text-sm text-muted-foreground">
            {isOnline
              ? "Online"
              : lastSeen
              ? `Last seen ${formatDistanceToNow(new Date(lastSeen), {
                  addSuffix: true,
                })}`
              : "Offline"}
          </div>
        </div>
      </div>

      <div ref={viewportRef} className="flex-1 overflow-y-auto px-6 py-4">
        <div className="space-y-4">
          {messages.map((message) => {
            const isOwnMessage = message.sender_id === currentUserId;
            const isImage = Boolean(message.image_url);
            return (
              <div
                key={message.id}
                className={cn("flex flex-col gap-1", {
                  "items-end": isOwnMessage,
                  "items-start": !isOwnMessage,
                })}
              >
                <div
                  className={cn(
                    "max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-sm",
                    isOwnMessage
                      ? "rounded-br-sm bg-primary text-primary-foreground"
                      : "rounded-bl-sm bg-muted"
                  )}
                >
                  {isImage && (
                    <div className="mb-2 overflow-hidden rounded-lg border bg-background">
                      <img
                        src={message.image_url || ""}
                        alt="Shared"
                        className="h-auto max-h-80 w-full object-cover"
                      />
                    </div>
                  )}
                  {message.text && (
                    <p className="whitespace-pre-line">{message.text}</p>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {message.created_at
                    ? format(new Date(message.created_at), "MMM d, h:mm a")
                    : ""}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <MessageComposer
        disabled={!conversation || isSending}
        typingLabel={typingLabel}
        onSend={onSendMessage}
        onUploadImage={onUploadImage}
        onTypingStart={onTypingStart}
        onTypingStop={onTypingStop}
      />
    </div>
  );
};

export default ChatWindow;

