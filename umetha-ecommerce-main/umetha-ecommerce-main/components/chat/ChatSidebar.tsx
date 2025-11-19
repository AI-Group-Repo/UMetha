"use client";

import { useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { ConversationWithProfile } from "@/types/chat";

type OnlineState = Record<
  string,
  {
    online: boolean;
    lastSeen?: string | null;
  }
>;

type ChatSidebarProps = {
  conversations: ConversationWithProfile[];
  selectedConversationId?: string | null;
  onSelectConversation: (conversationId: string) => void;
  currentUserId?: string | null;
  onlineUsers?: OnlineState;
};

const getDisplayName = (conversation: ConversationWithProfile) => {
  const profile = conversation.counterpart_profile;
  return (
    profile?.full_name ||
    profile?.username ||
    profile?.email ||
    "Unknown user"
  );
};

export const ChatSidebar = ({
  conversations,
  selectedConversationId,
  onSelectConversation,
  onlineUsers = {},
}: ChatSidebarProps) => {
  const [search, setSearch] = useState("");

  const filteredConversations = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) {
      return conversations;
    }
    return conversations.filter((conversation) => {
      const name = getDisplayName(conversation).toLowerCase();
      const lastMessage = conversation.last_message?.toLowerCase() || "";
      return name.includes(term) || lastMessage.includes(term);
    });
  }, [conversations, search]);

  return (
    <div className="flex h-full w-full flex-col border-r bg-background">
      <div className="border-b p-4">
        <Input
          placeholder="Search conversations"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <ScrollArea className="flex-1">
        {filteredConversations.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center text-sm text-muted-foreground">
            <p>No conversations yet</p>
            <p className="text-xs">
              Start chatting with influencers to see them here.
            </p>
          </div>
        )}

        <div className="space-y-1 p-2">
          {filteredConversations.map((conversation) => {
            const profile = conversation.counterpart_profile;
            const isSelected = conversation.id === selectedConversationId;
            const lastMessage = conversation.last_message || "Start chatting";
            const lastMessageTime = conversation.last_message_time
              ? formatDistanceToNow(new Date(conversation.last_message_time), {
                  addSuffix: true,
                })
              : "";
            const unread = conversation.unread_count || 0;
            const isOnline = profile?.id
              ? onlineUsers[profile.id]?.online
              : false;

            return (
              <button
                key={conversation.id}
                type="button"
                onClick={() => onSelectConversation(conversation.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition",
                  isSelected
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted/60"
                )}
              >
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={profile?.avatar_url ?? undefined}
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
                  <span
                    className={cn(
                      "absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-background",
                      isOnline ? "bg-emerald-500" : "bg-muted"
                    )}
                  />
                </div>

                <div className="flex flex-1 flex-col overflow-hidden">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium truncate">
                      {getDisplayName(conversation)}
                    </span>
                    {lastMessageTime && (
                      <span className="text-xs text-muted-foreground">
                        {lastMessageTime}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="truncate">{lastMessage}</span>
                    {unread > 0 && (
                      <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                        {unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatSidebar;

