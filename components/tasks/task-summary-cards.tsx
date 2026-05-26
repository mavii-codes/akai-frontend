"use client";

import { motion } from "framer-motion";
import {
  LayoutList,
  Circle,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

type TabId = "all" | "todo" | "in-progress" | "completed";

type TaskSummaryCardsProps = {
  counts: { all: number; todo: number; inProgress: number; completed: number };
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
};

const cards: {
  id: TabId;
  label: string;
  countKey: keyof TaskSummaryCardsProps["counts"];
  icon: typeof LayoutList;
  iconWrap: string;
}[] = [
  {
    id: "all",
    label: "All Tasks",
    countKey: "all",
    icon: LayoutList,
    iconWrap: "bg-emerald-100 text-emerald-600",
  },
  {
    id: "todo",
    label: "To Do",
    countKey: "todo",
    icon: Circle,
    iconWrap: "bg-sky-100 text-sky-600",
  },
  {
    id: "in-progress",
    label: "In Progress",
    countKey: "inProgress",
    icon: Loader2,
    iconWrap: "bg-amber-100 text-amber-600",
  },
  {
    id: "completed",
    label: "Completed",
    countKey: "completed",
    icon: CheckCircle2,
    iconWrap: "bg-teal-100 text-teal-600",
  },
];

export function TaskSummaryCards({
  counts,
  activeTab,
  onTabChange,
}: TaskSummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((card, i) => {
        const Icon = card.icon;
        const active = activeTab === card.id;
        return (
          <motion.button
            key={card.id}
            type="button"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            onClick={() => onTabChange(card.id)}
            className={cn(
              "flex items-center gap-3 rounded-xl border p-3 sm:p-4 text-left transition-all",
              active
                ? "border-emerald-300 bg-emerald-50/80 shadow-sm ring-1 ring-emerald-200/60"
                : "border-emerald-50 bg-white/70 hover:border-emerald-100 hover:shadow-sm"
            )}
          >
            <span
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                card.iconWrap
              )}
            >
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs text-emerald-600/70 font-medium">
                {card.label}
              </p>
              <p className="text-xl font-bold text-emerald-900">
                {counts[card.countKey]}
              </p>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
