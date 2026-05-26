"use client";

import { motion } from "framer-motion";
import {
  Layers,
  FileQuestion,
  Network,
  PenLine,
  ChevronRight,
  Wrench,
} from "lucide-react";
import { STUDY_TOOL_PROMPTS } from "@/lib/ai-demo";

const tools = [
  {
    key: "Flashcards Generator",
    subtitle: "Turn notes into study cards",
    icon: Layers,
  },
  {
    key: "Quiz Generator",
    subtitle: "Practice questions with answers",
    icon: FileQuestion,
  },
  {
    key: "Mind Map Creator",
    subtitle: "Visual topic connections",
    icon: Network,
  },
  {
    key: "Essay Helper",
    subtitle: "Outlines and writing tips",
    icon: PenLine,
  },
] as const;

type ChatStudyToolsProps = {
  onSelect: (prompt: string) => void;
};

export function ChatStudyTools({ onSelect }: ChatStudyToolsProps) {
  return (
    <motion.section
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.05 }}
      className="glass rounded-2xl border border-emerald-100/60 p-4 sm:p-5 w-full min-w-0 overflow-hidden"
    >
      <h3 className="font-semibold text-emerald-900 flex items-center gap-2 mb-3 min-w-0">
        <Wrench className="h-4 w-4 shrink-0 text-emerald-600" />
        <span className="truncate">Study Tools</span>
      </h3>
      <ul className="space-y-1 min-w-0">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <li key={tool.key} className="min-w-0">
              <button
                type="button"
                onClick={() => onSelect(STUDY_TOOL_PROMPTS[tool.key])}
                title={tool.key}
                className="w-full min-w-0 flex items-center gap-2 sm:gap-3 rounded-xl px-2 py-2.5 hover:bg-emerald-50/80 transition-colors group text-left overflow-hidden touch-manipulation"
              >
                <span className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 group-hover:bg-emerald-200/80 transition-colors">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1 overflow-hidden pr-0.5">
                  <p className="text-sm font-medium text-emerald-900 break-words xl:truncate">
                    {tool.key}
                  </p>
                  <p
                    className="text-xs text-emerald-600/65 break-words xl:truncate mt-0.5"
                    title={tool.subtitle}
                  >
                    {tool.subtitle}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-emerald-400 group-hover:text-emerald-600" />
              </button>
            </li>
          );
        })}
      </ul>
    </motion.section>
  );
}
