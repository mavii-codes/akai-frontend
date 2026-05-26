"use client";

import { motion } from "framer-motion";
import {
  Lightbulb,
  Calculator,
  FileText,
  StickyNote,
  Zap,
} from "lucide-react";
import { QUICK_ACTION_PROMPTS } from "@/lib/ai-demo";

const actions = [
  {
    key: "Explain Topic",
    icon: Lightbulb,
    desc: "Break down any concept",
    color: "bg-sky-50 text-sky-600 border-sky-100",
  },
  {
    key: "Solve Problem",
    icon: Calculator,
    desc: "Step-by-step solutions",
    color: "bg-amber-50 text-amber-600 border-amber-100",
  },
  {
    key: "Summarize",
    icon: FileText,
    desc: "Condense your notes",
    color: "bg-teal-50 text-teal-600 border-teal-100",
  },
  {
    key: "Generate Notes",
    icon: StickyNote,
    desc: "Structured study notes",
    color: "bg-violet-50 text-violet-600 border-violet-100",
  },
] as const;

type ChatQuickActionsProps = {
  onSelect: (prompt: string) => void;
};

export function ChatQuickActions({ onSelect }: ChatQuickActionsProps) {
  return (
    <motion.section
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass rounded-2xl border border-emerald-100/60 p-4 sm:p-5"
    >
      <h3 className="font-semibold text-emerald-900 flex items-center gap-2 mb-4">
        <Zap className="h-4 w-4 text-emerald-600" />
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.key}
              type="button"
              onClick={() => onSelect(QUICK_ACTION_PROMPTS[action.key])}
              className={`flex flex-col items-start gap-2 rounded-xl border p-3 text-left transition-all hover:shadow-md hover:scale-[1.02] active:scale-[0.98] ${action.color}`}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/80 shadow-sm">
                <Icon className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xs font-semibold text-emerald-900 leading-tight">
                  {action.key}
                </p>
                <p className="text-[10px] opacity-80 mt-0.5 leading-snug">
                  {action.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </motion.section>
  );
}
