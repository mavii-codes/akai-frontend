"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Lightbulb, Bot, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { NotificationsMenu } from "@/components/layout/notifications-menu";
import { PageUserChip } from "@/components/layout/page-user-chip";
import { PageHeaderActions } from "@/components/layout/page-header-actions";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AiWelcomeCard } from "@/components/ai/ai-welcome-card";
import { ChatUserMessage } from "@/components/ai/chat-user-message";
import { ChatAssistantMessage } from "@/components/ai/chat-assistant-message";
import { ChatInputArea } from "@/components/ai/chat-input-area";
import { ChatQuickActions } from "@/components/ai/chat-quick-actions";
import { ChatStudyTools } from "@/components/ai/chat-study-tools";
import {
  ChatRecentConversations,
  type ConversationPreview,
} from "@/components/ai/chat-recent-conversations";

import { aiSuggestedPrompts } from "@/lib/data";
import type { ChatMessage } from "@/types";
import axiosInstance from "@/lib/axios";

const DEFAULT_FOLLOW_UPS = [
  "Explain this more simply",
  "Give me an example",
  "Create a short quiz",
];

export function AiAssistantView() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const [conversations, setConversations] = useState<ConversationPreview[]>([]);
  const [showTips, setShowTips] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const addToRecent = useCallback((title: string) => {
    const short = title.length > 42 ? `${title.slice(0, 42)}…` : title;

    setConversations((prev) => {
      const next = [
        { id: crypto.randomUUID(), title: short, ago: "Just now" },
        ...prev.filter((c) => c.title !== short),
      ].slice(0, 5);

      return next;
    });
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();

      if ((!trimmed && !selectedFile) || isTyping) return;

      const userText = trimmed || selectedFile?.name || "";
      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: userText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      addToRecent(userText);
      setIsTyping(true);

      try {
        const formData = new FormData();
        formData.append("question", trimmed || "Please analyze the attached file.");

        if (selectedFile) {
          formData.append("file", selectedFile, selectedFile.name);
        }

        const response = await axiosInstance.post("/api/ai/v1/ask", formData);

        const aiReply =
          response.data.data.answer || "No response received.";

        const assistantMsg: ChatMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: aiReply,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMsg]);
        setSelectedFile(null);
      } catch (error) {
        console.error(error);

        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: "Sorry, something went wrong while contacting AkAi.",
            timestamp: new Date(),
          },
        ]);
      } finally {
        setIsTyping(false);
      }
    },
    [isTyping, addToRecent, selectedFile]
  );

  const handleQuickPrompt = (prefix: string) => {
    setInput(prefix + " ");
    document.getElementById("ai-chat-input")?.focus();
  };

  const lastAssistantId = [...messages].reverse().find((m) => m.role === "assistant")?.id;

  const studyTips = [
    "Break study sessions into 25-minute focus blocks",
    "Review notes within 24 hours of learning",
    "Teach a concept aloud to test understanding",
    "Use active recall instead of only re-reading",
  ];

  return (
    <div className="space-y-6 w-full min-w-0">
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-emerald-900 flex items-center gap-2">
            <Sparkles className="h-7 w-7 text-emerald-600" />
            AI Assistant
          </h1>
          <p className="text-emerald-700/70 mt-1 text-sm sm:text-base">
            Your intelligent study companion. Ask anything!
          </p>
        </div>

        <PageHeaderActions>
          <div className="relative w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => setShowTips((s) => !s)}
              className="w-full sm:w-auto border-emerald-100 text-emerald-800 hover:bg-emerald-50 gap-2 rounded-xl"
            >
              <Lightbulb className="h-4 w-4 shrink-0" />
              Study Tips
            </Button>

            {showTips && (
              <div className="absolute left-0 right-0 sm:left-auto sm:right-0 top-full mt-2 z-20 w-full sm:w-64 rounded-xl border border-emerald-100 bg-white shadow-lg p-3 text-sm text-emerald-800 space-y-2">
                {studyTips.map((tip) => (
                  <p key={tip} className="flex gap-2">
                    <span className="text-emerald-500 shrink-0">•</span>
                    <span>{tip}</span>
                  </p>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 w-full sm:w-auto min-w-0">
            <NotificationsMenu align="end" />
            <PageUserChip className="min-w-0 flex-1 sm:flex-initial max-w-full" />
          </div>
        </PageHeaderActions>
      </motion.header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 flex flex-col glass rounded-2xl border border-emerald-100/60 shadow-sm overflow-hidden min-h-[720px]">
          <ScrollArea className="flex-1 px-4 sm:px-5 pt-5">
            <AiWelcomeCard />

            <div className="space-y-6 pb-4">
              {messages.map((msg) =>
                msg.role === "user" ? (
                  <ChatUserMessage key={msg.id} content={msg.content} />
                ) : (
                  <ChatAssistantMessage
                    key={msg.id}
                    content={msg.content}
                    followUps={msg.id === lastAssistantId ? DEFAULT_FOLLOW_UPS : []}
                    onFollowUp={(chip) => sendMessage(`${chip} — regarding my last question`)}
                    showActions
                  />
                )
              )}

              {isTyping && (
                <div className="flex gap-3 pb-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <Bot className="h-4 w-4" />
                  </div>

                  <div className="rounded-2xl border border-emerald-100 bg-white px-4 py-3">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                          className="h-2 w-2 rounded-full bg-emerald-400"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          {!messages.some((m) => m.role === "user") && (
            <div className="px-4 pb-2 flex flex-wrap gap-2">
              {aiSuggestedPrompts.slice(0, 3).map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendMessage(prompt)}
                  className="text-xs px-3 py-1.5 rounded-full border border-emerald-100 bg-emerald-50/80 text-emerald-700 hover:bg-emerald-100"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          <div className="border-t border-emerald-100 p-3">
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <ChatInputArea
                  value={input}
                  onChange={setInput}
                  onSend={() => sendMessage(input)}
                  disabled={isTyping}
                  selectedFile={selectedFile}
                  onFileSelect={setSelectedFile}
                  onRemoveFile={() => setSelectedFile(null)}
                />
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-5">
          <ChatQuickActions onSelect={handleQuickPrompt} />
          <ChatStudyTools onSelect={handleQuickPrompt} />
          <ChatRecentConversations
            conversations={conversations}
            onSelect={() => {}}
            onClear={() => setConversations([])}
          />
        </aside>
      </div>
    </div>
  );
}