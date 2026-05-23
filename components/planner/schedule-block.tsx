"use client";

import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PlannerBlock } from "@/types";
import { cn } from "@/lib/utils";

const typeStyles = {
  class: "bg-emerald-600 text-white",
  study: "bg-emerald-100 text-emerald-800 border border-emerald-200",
  break: "bg-emerald-50 text-emerald-600 border border-emerald-100",
};

type ScheduleBlockProps = {
  block: PlannerBlock;
  index?: number;
  onDelete?: () => void;
  compact?: boolean;
};

export function ScheduleBlock({
  block,
  index = 0,
  onDelete,
  compact = false,
}: ScheduleBlockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      className={cn(
        "group flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 rounded-xl border border-emerald-50 bg-white/70 hover:shadow-sm transition-all",
        compact ? "p-2.5" : "p-3 sm:p-4"
      )}
    >
      <span className="text-sm font-semibold text-emerald-600 sm:w-20 shrink-0">
        {block.time}
      </span>
      <div className="flex flex-1 items-center justify-between gap-2 min-w-0">
        <p className="font-medium text-emerald-900 text-sm sm:text-base truncate">
          {block.title}
        </p>
        <div className="flex items-center gap-2 shrink-0">
          <span
            className={cn(
              "text-[10px] sm:text-xs px-2.5 sm:px-3 py-1 rounded-full font-medium capitalize whitespace-nowrap",
              typeStyles[block.type]
            )}
          >
            {block.type}
          </span>
          {block.type !== "break" && (
            <span
              className="size-2 rounded-full bg-emerald-400 animate-pulse"
              title="Reminder"
            />
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={onDelete}
              className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 text-red-500 hover:bg-red-50"
              aria-label="Delete schedule"
            >
              <Trash2 className="size-3.5" />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
