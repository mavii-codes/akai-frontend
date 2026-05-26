"use client";

import { Plus, Globe, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type ChatInputAreaProps = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
};

export function ChatInputArea({
  value,
  onChange,
  onSend,
  disabled,
}: ChatInputAreaProps) {
  return (
    <div className="border-t border-emerald-100 bg-white/80 backdrop-blur-sm p-4">
      <div className="rounded-2xl border border-emerald-100 bg-white shadow-sm focus-within:ring-2 focus-within:ring-emerald-400/30 transition-shadow">
        <Textarea
          id="ai-chat-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Ask anything about your studies..."
          className="min-h-[52px] max-h-32 border-0 bg-transparent resize-none rounded-2xl px-4 pt-3 pb-2 focus-visible:ring-0 shadow-none"
          rows={2}
          disabled={disabled}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
        />
        <div className="flex items-center justify-between px-3 pb-3">
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-emerald-600/70 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
              aria-label="Add attachment"
            >
              <Plus className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-emerald-600/70 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
              aria-label="Search the web"
            >
              <Globe className="h-5 w-5" />
            </button>
          </div>
          <Button
            type="button"
            size="icon"
            onClick={onSend}
            disabled={!value.trim() || disabled}
            className="h-10 w-10 rounded-full bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/25 shrink-0"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <p className="text-[10px] sm:text-xs text-emerald-600/50 text-center mt-3">
        AkAI can make mistakes. Consider checking important information.
      </p>
    </div>
  );
}
