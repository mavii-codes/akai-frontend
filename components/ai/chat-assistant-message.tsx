"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, ThumbsUp, ThumbsDown, Copy, Check } from "lucide-react";
import { ChatMessageContent } from "@/components/ai/chat-message-content";
import { cn } from "@/lib/utils";

type ChatAssistantMessageProps = {
  content: string;
  followUps?: string[];
  onFollowUp?: (text: string) => void;
  showActions?: boolean;
};

export function ChatAssistantMessage({
  content,
  followUps = [],
  onFollowUp,
  showActions = true,
}: ChatAssistantMessageProps) {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3 max-w-full"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200/60">
        <Bot className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1 max-w-[92%]">
        <div className="rounded-2xl rounded-tl-md border border-emerald-100 bg-white shadow-sm p-4 sm:p-5">
          <ChatMessageContent content={content} />
          {showActions && (
            <div className="flex items-center gap-1 mt-4 pt-3 border-t border-emerald-50">
              <button
                type="button"
                onClick={() => setFeedback("up")}
                className={cn(
                  "p-2 rounded-lg text-emerald-600/70 hover:bg-emerald-50 transition-colors",
                  feedback === "up" && "bg-emerald-100 text-emerald-700"
                )}
                aria-label="Helpful"
              >
                <ThumbsUp className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setFeedback("down")}
                className={cn(
                  "p-2 rounded-lg text-emerald-600/70 hover:bg-emerald-50 transition-colors",
                  feedback === "down" && "bg-emerald-100 text-emerald-700"
                )}
                aria-label="Not helpful"
              >
                <ThumbsDown className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleCopy}
                className="p-2 rounded-lg text-emerald-600/70 hover:bg-emerald-50 transition-colors flex items-center gap-1 text-xs font-medium"
                aria-label="Copy response"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-emerald-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
          )}
        </div>
        {followUps.length > 0 && onFollowUp && (
          <div className="flex flex-wrap gap-2 mt-3">
            {followUps.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => onFollowUp(chip)}
                className="text-xs px-3 py-1.5 rounded-full border border-emerald-100 bg-white text-emerald-700 hover:bg-emerald-50 hover:border-emerald-200 transition-colors shadow-sm"
              >
                {chip}
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
