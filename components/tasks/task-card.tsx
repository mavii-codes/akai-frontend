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
        "glass rounded-xl p-4 border border-emerald-100/60 hover:shadow-md transition-all group",
        task.completed && "opacity-60"
      )}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          checked={task.completed}
          onCheckedChange={onToggle}
          className="mt-1"
        />
        <div className="flex-1 min-w-0">
          <p
            className={cn(
              "font-medium text-emerald-900",
              task.completed && "line-through text-emerald-600/60"
            )}
          >
            {task.title}
          </p>
          {task.description && (
            <p className="text-sm text-emerald-600/70 mt-1 line-clamp-2">
              {task.description}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="flex items-center gap-1 text-xs text-emerald-600/70">
              <Calendar className="size-3" />
              {new Date(task.dueDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
            <Badge
              variant="outline"
              className={cn("text-[10px] capitalize", getPriorityColor(task.priority))}
            >
              {task.priority}
            </Badge>
          </div>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onEdit}
            className="text-emerald-600 hover:bg-emerald-50"
            aria-label="Edit task"
          >
            <Pencil className="size-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onDelete}
            className="text-red-500 hover:bg-red-50"
            aria-label="Delete task"
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
