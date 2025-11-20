"use client";

import { useRef, useState } from "react";
import { ImageIcon, SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type MessageComposerProps = {
  placeholder?: string;
  disabled?: boolean;
  typingLabel?: string | null;
  onSend: (payload: { text?: string; imageUrl?: string }) => Promise<void>;
  onUploadImage?: (file: File) => Promise<string>;
  onTypingStart?: () => void;
  onTypingStop?: () => void;
};

export const MessageComposer = ({
  placeholder = "Write a message...",
  disabled,
  typingLabel,
  onSend,
  onUploadImage,
  onTypingStart,
  onTypingStop,
}: MessageComposerProps) => {
  const [value, setValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTypingTimeout = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      onTypingStop?.();
    }, 2000);
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
    onTypingStart?.();
    resetTypingTimeout();
  };

  const handleSubmit = async () => {
    if (!value.trim() || disabled) {
      return;
    }

    setIsSending(true);
    try {
      await onSend({ text: value.trim() });
      setValue("");
      onTypingStop?.();
    } catch (error) {
      console.error("Failed to send message", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !onUploadImage) {
      return;
    }

    setIsUploading(true);
    try {
      const url = await onUploadImage(file);
      if (url) {
        await onSend({ imageUrl: url });
      }
    } catch (error) {
      console.error("Image upload failed", error);
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="border-t bg-background p-4">
      {typingLabel && (
        <p className="mb-2 text-xs text-muted-foreground">{typingLabel}</p>
      )}
      <div className="flex items-end gap-3">
        <div className="flex-1 space-y-2">
          <Textarea
            value={value}
            placeholder={placeholder}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={disabled || isSending}
            className="min-h-[80px] resize-none"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label
            className={cn(
              "flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border text-muted-foreground transition hover:text-primary",
              (disabled || isUploading) && "cursor-not-allowed opacity-50"
            )}
          >
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
              disabled={disabled || isUploading}
            />
            <ImageIcon className="h-4 w-4" />
          </label>
          <Button
            size="icon"
            className="h-11 w-11 rounded-full"
            onClick={handleSubmit}
            disabled={disabled || isSending}
          >
            <SendHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessageComposer;

