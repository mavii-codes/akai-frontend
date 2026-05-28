"use client";

import { Plus, Globe, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRef } from "react";

type ChatInputAreaProps = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  selectedFile?: File | null;
  onFileSelect?: (file: File) => void;
  onRemoveFile?: () => void;
};

export function ChatInputArea({
  value,
  onChange,
  onSend,
  disabled,
  selectedFile,
  onFileSelect,
  onRemoveFile,
}: ChatInputAreaProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canSend = !disabled && (!!value.trim() || !!selectedFile);

  return (
    <div className="border-t border-emerald-100 bg-white/80 backdrop-blur-sm p-4">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.ppt,.pptx,.docx"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          onFileSelect?.(file);
          e.target.value = "";
        }}
      />

      <div className="rounded-2xl border border-emerald-100 bg-white shadow-sm focus-within:ring-2 focus-within:ring-emerald-400/30 transition-shadow">
        {selectedFile && (
          <div className="flex items-center justify-between gap-3 rounded-t-2xl border-b border-emerald-100 bg-emerald-50/80 px-3 py-2 text-xs text-emerald-800">
            <span className="truncate">Attached: {selectedFile.name}</span>
            <button
              type="button"
              onClick={onRemoveFile}
              className="inline-flex h-7 w-7 items-center justify-center rounded-full text-emerald-700 hover:bg-emerald-100"
              aria-label="Remove attached file"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

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
              onClick={() => fileInputRef.current?.click()}
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
            disabled={!canSend}
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