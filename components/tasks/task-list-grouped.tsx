"use client";

import { AnimatePresence } from "framer-motion";
import { Flag } from "lucide-react";
import { TaskRow } from "@/components/tasks/task-row";
import {
  groupTasksByPriority,
  PRIORITY_SECTION_META,
} from "@/lib/task-utils";
import type { Priority, Task } from "@/types";

type TaskListGroupedProps = {
  tasks: Task[];
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
};

const PRIORITIES: Priority[] = ["high", "medium", "low"];

export function TaskListGrouped({
  tasks,
  onToggle,
  onEdit,
  onDelete,
}: TaskListGroupedProps) {
  const grouped = groupTasksByPriority(tasks);

  if (tasks.length === 0) {
    return (
      <p className="text-center text-emerald-600/60 py-16 text-sm rounded-xl border border-dashed border-emerald-100 bg-white/40">
        No tasks match your filters. Create one to get started!
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {PRIORITIES.map((priority) => {
        const sectionTasks = grouped[priority];
        if (sectionTasks.length === 0) return null;
        const meta = PRIORITY_SECTION_META[priority];

        return (
          <section key={priority}>
            <div className="flex items-center gap-2 mb-3">
              <Flag className={`h-4 w-4 ${meta.flagClass}`} fill="currentColor" />
              <h3 className="text-sm font-semibold text-emerald-900">
                {meta.label}
              </h3>
              <span className="text-xs text-emerald-500/70">
                ({sectionTasks.length})
              </span>
            </div>
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {sectionTasks.map((task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    onToggle={() => onToggle(task.id)}
                    onEdit={() => onEdit(task)}
                    onDelete={() => onDelete(task.id)}
                  />
                ))}
              </AnimatePresence>
            </div>
          </section>
        );
      })}
    </div>
  );
}
