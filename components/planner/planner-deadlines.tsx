"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Target, Plus, ChevronRight } from "lucide-react";
import {
  useDeadlines,
  getDaysLeft,
  formatDeadlineDate,
} from "@/store/deadlines-store";
import { Badge } from "@/components/ui/badge";
import { DeadlineFormDialog } from "@/components/dashboard/deadline-form-dialog";
import { DeadlinesViewAll } from "@/components/dashboard/deadlines-view-all";
import { cn } from "@/lib/utils";
import type { Deadline } from "@/types";

const PREVIEW_COUNT = 3;

function daysLeftBadgeClass(days: number) {
  if (days <= 2) return "bg-rose-100 text-rose-700 border-rose-200";
  if (days <= 7) return "bg-amber-100 text-amber-800 border-amber-200";
  return "bg-emerald-100 text-emerald-700 border-emerald-200";
}

export function PlannerDeadlines() {
  const { deadlines, addDeadline, updateDeadline } = useDeadlines();
  const [addOpen, setAddOpen] = useState(false);
  const [viewAllOpen, setViewAllOpen] = useState(false);
  const [editing, setEditing] = useState<Deadline | null>(null);

  const preview = deadlines.slice(0, PREVIEW_COUNT);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="glass rounded-2xl border border-emerald-100/60 shadow-sm p-4 sm:p-5"
    >
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-emerald-600" />
          <h3 className="font-semibold text-emerald-900">Upcoming Deadlines</h3>
        </div>
        <button
          type="button"
          onClick={() => setViewAllOpen(true)}
          className="text-sm font-medium text-emerald-600 hover:text-emerald-800 flex items-center gap-0.5"
        >
          View all
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <ul className="space-y-2.5">
        {preview.length === 0 ? (
          <li className="text-sm text-emerald-600/60 text-center py-4">
            No deadlines yet.
          </li>
        ) : (
          preview.map((item) => {
            const days = getDaysLeft(item.dueDateIso);
            const dateLabel = formatDeadlineDate(item.dueDateIso);
            const monthDay = new Date(
              item.dueDateIso + "T12:00:00"
            ).toLocaleDateString("en-US", { month: "short", day: "numeric" });

            return (
              <li
                key={item.id}
                className="flex items-center gap-3 rounded-xl border border-emerald-50 bg-white/60 p-2.5"
              >
                <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-emerald-600 text-white text-center leading-tight">
                  <span className="text-[9px] font-semibold uppercase tracking-wide opacity-90">
                    {monthDay.split(" ")[0]}
                  </span>
                  <span className="text-sm font-bold">
                    {monthDay.split(" ")[1]}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-emerald-900 text-sm truncate">
                    {item.title}
                  </p>
                  <p className="text-xs text-emerald-600/70">{dateLabel}</p>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "shrink-0 text-xs font-medium",
                    daysLeftBadgeClass(days)
                  )}
                >
                  {days === 0
                    ? "Today"
                    : days === 1
                      ? "1 day left"
                      : `${days} days left`}
                </Badge>
              </li>
            );
          })
        )}
      </ul>

      <button
        type="button"
        onClick={() => {
          setEditing(null);
          setAddOpen(true);
        }}
        className="mt-4 w-full text-sm font-medium text-emerald-600 hover:text-emerald-800 flex items-center justify-center gap-1 py-2"
      >
        <Plus className="h-4 w-4" />
        Add Deadline
      </button>

      <DeadlineFormDialog
        open={addOpen}
        onOpenChange={(open) => {
          setAddOpen(open);
          if (!open) setEditing(null);
        }}
        deadline={editing}
        onSave={(data) => {
          if (editing) {
            updateDeadline(editing.id, data);
          } else {
            addDeadline(data);
          }
        }}
      />

      <DeadlinesViewAll open={viewAllOpen} onOpenChange={setViewAllOpen} />
    </motion.section>
  );
}
