"use client";

import { motion } from "framer-motion";
import {
  Zap,
  Layers,
  FileQuestion,
  PenLine,
  StickyNote,
  MessageSquare,
} from "lucide-react";
import { recentConversations } from "@/lib/data";

const studyTools = [
  { label: "Flashcards Generator", icon: Layers },
  { label: "Quiz Generator", icon: FileQuestion },
  { label: "Essay Helper", icon: PenLine },
  { label: "Notes Generator", icon: StickyNote },
];

const quickActions = [
  "Summarize my notes",
  "Create a study schedule",
  "Explain a concept",
];

export function ChatSidebar() {
  return (
    <div className="space-y-4">
      <motion.section
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass rounded-2xl p-4 border border-emerald-100/60"
      >
        <h3 className="font-semibold text-emerald-900 flex items-center gap-2 mb-3">
          <Zap className="size-4 text-emerald-600" />
          Quick Actions
        </h3>
        <div className="space-y-2">
          {quickActions.map((action) => (
            <button
              key={action}
              type="button"
              className="w-full text-left text-sm px-3 py-2 rounded-xl bg-emerald-50/80 text-emerald-700 hover:bg-emerald-100 transition-colors"
            >
              {action}
            </button>
          ))}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-4 border border-emerald-100/60"
      >
        <h3 className="font-semibold text-emerald-900 mb-3">Study Tools</h3>
        <div className="space-y-2">
          {studyTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.label}
                type="button"
                className="w-full flex items-center gap-3 text-sm px-3 py-2.5 rounded-xl hover:bg-emerald-50 text-emerald-800 transition-colors group"
              >
                <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 group-hover:bg-emerald-200 transition-colors">
                  <Icon className="size-4" />
                </span>
                {tool.label}
              </button>
            );
          })}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-4 border border-emerald-100/60"
      >
        <h3 className="font-semibold text-emerald-900 flex items-center gap-2 mb-3">
          <MessageSquare className="size-4 text-emerald-600" />
          Recent Conversations
        </h3>
        <div className="space-y-2">
          {recentConversations.map((conv) => (
            <button
              key={conv}
              type="button"
              className="w-full text-left text-sm px-3 py-2 rounded-xl text-emerald-700/80 hover:bg-emerald-50 truncate transition-colors"
            >
              {conv}
            </button>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
