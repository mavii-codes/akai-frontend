"use client";

import { motion } from "framer-motion";
import { Calendar, Pencil, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  dueBadgeClass,
  formatDueLabel,
  getDaysUntilDue,
  subjectTagClass,
} from "@/lib/task-utils";
import type { Task } from "@/types";
import { cn } from "@/lib/utils";

type TaskRowProps = {
  task: Task;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function TaskRow({ task, onToggle, onEdit, onDelete }: TaskRowProps) {
  const days = getDaysUntilDue(task.dueDate);
  const dueLabel = formatDueLabel(days);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "group rounded-xl border border-emerald-50 bg-white/70 p-4 hover:shadow-md hover:border-emerald-100/80 transition-all",
        task.status === "completed" && "opacity-75"
      )}
    >
      <div className="flex gap-3">
        <Checkbox
          checked={task.status === "completed"}
          onCheckedChange={onToggle}
          className="mt-1 shrink-0 border-emerald-300 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
        />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h4
                  className={cn(
                    "font-semibold text-emerald-900 text-sm sm:text-base",
                    task.status === "completed" &&
                      "line-through text-emerald-600/60"
                  )}
                >
                  {task.title}
                </h4>
                {task.subject ? (
                  <span
                    className={cn(
                      "rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                      subjectTagClass(task.subject)
                    )}
                  >
                    {task.subject}
                  </span>
                ) : null}
              </div>
              {task.description ? (
                <p className="text-xs sm:text-sm text-emerald-600/70 mt-1 line-clamp-2">
                  {task.description}
                </p>
              ) : null}
            </div>
            <div className="flex gap-0.5 shrink-0 opacity-60 group-hover:opacity-100">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-emerald-600"
                onClick={onEdit}
                aria-label="Edit task"
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-rose-500"
                onClick={onDelete}
                aria-label="Delete task"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs text-emerald-600/80">
              <Calendar className="h-3 w-3" />
              {new Date(task.dueDate + "T12:00:00").toLocaleDateString(
                "en-US",
                { weekday: "short", month: "short", day: "numeric" }
              )}
            </span>
            {task.status !== "completed" && (
              <Badge
                variant="outline"
                className={cn("text-[10px] font-medium", dueBadgeClass(days))}
              >
                {dueLabel}
              </Badge>
            )}
            {task.status === "in-progress" && (
              <Badge
                variant="outline"
                className="text-[10px] bg-amber-50 text-amber-800 border-amber-200"
              >
                In Progress
              </Badge>
            )}
          </div>

          {task.status === "in-progress" && (
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-medium text-emerald-600/80">
                <span>Progress</span>
                <span>{task.progress}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-emerald-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all"
                  style={{ width: `${Math.min(100, task.progress)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
