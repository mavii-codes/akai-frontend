"use client";

import { motion } from "framer-motion";
import { Calendar, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { getPriorityColor } from "@/store/tasks-store";
import type { Task } from "@/types";
import { cn } from "@/lib/utils";

type TaskCardProps = {
  task: Task;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function TaskCard({ task, onToggle, onEdit, onDelete }: TaskCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        "group glass rounded-xl p-3 sm:p-4 border border-emerald-100/60 hover:shadow-md transition-all",
        task.completed && "opacity-60"
      )}
    >
      <div className="flex items-start gap-2 sm:gap-3">
        <Checkbox
          checked={task.completed}
          onCheckedChange={onToggle}
          className="mt-1 shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p
              className={cn(
                "font-medium text-emerald-900 text-sm sm:text-base break-words",
                task.completed && "line-through text-emerald-600/60"
              )}
            >
              {task.title}
            </p>
            <div className="flex gap-0.5 shrink-0 md:opacity-0 md:group-hover:opacity-100">
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={onEdit}
                className="text-emerald-600 hover:bg-emerald-50 size-8 sm:size-7"
                aria-label="Edit task"
              >
                <Pencil className="size-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={onDelete}
                className="text-red-500 hover:bg-red-50 size-8 sm:size-7"
                aria-label="Delete task"
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          </div>
          {task.description && (
            <p className="text-xs sm:text-sm text-emerald-600/70 mt-1 line-clamp-2 break-words">
              {task.description}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="flex items-center gap-1 text-xs text-emerald-600/70">
              <Calendar className="size-3 shrink-0" />
              {new Date(task.dueDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
            <Badge
              variant="outline"
              className={cn(
                "text-[10px] capitalize",
                getPriorityColor(task.priority)
              )}
            >
              {task.priority}
            </Badge>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
