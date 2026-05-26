"use client";

import { SlidersHorizontal } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { Priority, TaskStatus } from "@/types";

export type TasksFilters = {
  priority: Priority | "all";
  subject: string;
  status: TaskStatus | "all";
  dueBefore: string;
};

type TasksFiltersPanelProps = {
  filters: TasksFilters;
  onChange: (filters: TasksFilters) => void;
  subjects: string[];
};

export function TasksFiltersPanel({
  filters,
  onChange,
  subjects,
}: TasksFiltersPanelProps) {
  const set = (patch: Partial<TasksFilters>) =>
    onChange({ ...filters, ...patch });

  return (
    <section className="glass rounded-2xl border border-emerald-100/60 p-4 sm:p-5 space-y-4">
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="h-5 w-5 text-emerald-600" />
        <h3 className="font-semibold text-emerald-900">Filters</h3>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs text-emerald-700">Priority</Label>
        <select
          value={filters.priority}
          onChange={(e) =>
            set({ priority: e.target.value as TasksFilters["priority"] })
          }
          className="h-8 w-full rounded-lg border border-emerald-100 bg-white/80 px-2 text-sm text-emerald-900"
        >
          <option value="all">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs text-emerald-700">Subject</Label>
        <select
          value={filters.subject}
          onChange={(e) => set({ subject: e.target.value })}
          className="h-8 w-full rounded-lg border border-emerald-100 bg-white/80 px-2 text-sm text-emerald-900"
        >
          <option value="">All Subjects</option>
          {subjects.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs text-emerald-700">Status</Label>
        <select
          value={filters.status}
          onChange={(e) =>
            set({ status: e.target.value as TasksFilters["status"] })
          }
          className="h-8 w-full rounded-lg border border-emerald-100 bg-white/80 px-2 text-sm text-emerald-900"
        >
          <option value="all">All Status</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs text-emerald-700">Due before</Label>
        <Input
          type="date"
          value={filters.dueBefore}
          onChange={(e) => set({ dueBefore: e.target.value })}
          className="bg-white/80 border-emerald-100 h-8 text-sm"
        />
      </div>
    </section>
  );
}
