"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { aiSuggestedPrompts } from "@/lib/data";
import type { ChatMessage } from "@/types";
import { cn } from "@/lib/utils";

const demoResponse = `**Photosynthesis** is how plants make food using sunlight.

The basic formula is:
\`6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂\`

In simple terms:
1. Plants absorb **sunlight** through their leaves
2. They take in **carbon dioxide** from the air
3. They use **water** from the soil
4. They produce **glucose** (sugar) for energy
5. They release **oxygen** as a byproduct

This is why plants are essential for life on Earth! 🌱`;

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "0",
      role: "assistant",
      content:
        "Hello! I'm AkAI, your study companion. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: demoResponse,
          timestamp: new Date(),
        },
      ]);
    }, 1500);
  };

  const actionButtons = [
    "Make it simpler",
    "Give examples",
    "Create quiz",
    "Summarize",
  ];

  return (
    <div className="flex flex-col h-full glass rounded-2xl border border-emerald-100/60 overflow-hidden">
      <ScrollArea className="flex-1 p-4 max-h-[calc(100vh-320px)] md:max-h-[500px]">
        <div className="space-y-4">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex gap-3",
                  msg.role === "user" ? "flex-row-reverse" : ""
                )}
              >
                <div
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full",
                    msg.role === "user"
                      ? "bg-emerald-600 text-white"
                      : "bg-emerald-100 text-emerald-700"
                  )}
                >
                  {msg.role === "user" ? (
                    <User className="size-4" />
                  ) : (
                    <Bot className="size-4" />
                  )}
                </div>
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                    msg.role === "user"
                      ? "bg-emerald-600 text-white rounded-tr-sm"
                      : "bg-white border border-emerald-100 text-emerald-900 rounded-tl-sm"
                  )}
                >
                  <div className="whitespace-pre-wrap prose prose-sm prose-emerald max-w-none">
                    {msg.content.split("\n").map((line, i) => {
                      if (line.startsWith("**") && line.endsWith("**")) {
                        return (
                          <p key={i} className="font-bold text-emerald-800">
                            {line.replace(/\*\*/g, "")}
                          </p>
                        );
                      }
                      if (line.startsWith("`") && line.endsWith("`")) {
                        return (
                          <code
                            key={i}
                            className="block bg-emerald-50 rounded-lg px-3 py-2 my-2 text-emerald-800 font-mono text-xs"
                          >
                            {line.replace(/`/g, "")}
                          </code>
                        );
                      }
                      if (/^\d\./.test(line)) {
                        return (
                          <p key={i} className="ml-2">
                            {line}
                          </p>
                        );
                      }
                      return line ? <p key={i}>{line}</p> : <br key={i} />;
                    })}
                  </div>
                  {msg.role === "assistant" && msg.id !== "0" && (
                    <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-emerald-100">
                      {actionButtons.map((btn) => (
                        <button
                          key={btn}
                          type="button"
                          className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                        >
                          {btn}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="flex size-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <Bot className="size-4" />
              </div>
              <div className="bg-white border border-emerald-100 rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      animate={{ y: [0, -4, 0] }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.15,
                      }}
                      className="size-2 rounded-full bg-emerald-400"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <div className="p-3 border-t border-emerald-100 bg-white/50">
        <div className="flex flex-wrap gap-2 mb-3">
          {aiSuggestedPrompts.slice(0, 2).map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => sendMessage(prompt)}
              className="text-xs px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-100 transition-colors text-left"
            >
              {prompt}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
          className="flex gap-2"
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AkAI anything..."
            className="min-h-[44px] max-h-24 rounded-xl border-emerald-100 resize-none"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage(input);
              }
            }}
          />
          <Button
            type="submit"
            size="icon"
            className="rounded-xl gradient-green border-0 shrink-0 size-11"
            disabled={!input.trim() || isTyping}
          >
            <Send className="size-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
