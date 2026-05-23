"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TaskCard } from "@/components/tasks/task-card";
import { TaskFormDialog } from "@/components/tasks/task-form-dialog";
import { useTasks } from "@/store/tasks-store";
import type { Priority, Task } from "@/types";
import { cn } from "@/lib/utils";

type FilterOption = "all" | "active" | "completed" | Priority;

export default function TasksPage() {
  const { tasks, addTask, updateTask, deleteTask, toggleComplete } = useTasks();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterOption>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      const matchesSearch =
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase());
      const matchesFilter =
        filter === "all" ||
        (filter === "active" && !t.completed) ||
        (filter === "completed" && t.completed) ||
        t.priority === filter;
      return matchesSearch && matchesFilter;
    });
  }, [tasks, search, filter]);

  const activeCount = tasks.filter((t) => !t.completed).length;
  const filters: { value: FilterOption; label: string }[] = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "completed", label: "Done" },
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" },
  ];

  return (
    <div className="w-full min-w-0 p-4 sm:p-6 md:p-8 max-w-4xl mx-auto space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-emerald-900">Tasks</h1>
          <p className="text-xs sm:text-sm text-emerald-600/70 mt-1">
            {activeCount} active · Manage your academic tasks
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingTask(null);
            setDialogOpen(true);
          }}
          className="w-full sm:w-auto rounded-xl gradient-green border-0 gap-2 shadow-md shrink-0"
        >
          <Plus className="size-4" />
          Add Task
        </Button>
      </div>

      <div className="space-y-3">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-emerald-500/60 pointer-events-none" />
          <Input
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11 w-full rounded-xl border-emerald-100 bg-white/80"
          />
        </div>
        <div className="flex items-center gap-2 min-w-0">
          <Filter className="size-4 text-emerald-600 shrink-0" />
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-thin flex-1 [scrollbar-width:thin]">
            {filters.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setFilter(f.value)}
                className={cn(
                  "shrink-0 px-3 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap touch-manipulation",
                  filter === f.value
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-100"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2 sm:space-y-3 pb-2">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-emerald-600/60 py-12 px-4 text-sm"
            >
              No tasks found. Create one to get started!
            </motion.p>
          ) : (
            filtered.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={() => toggleComplete(task.id)}
                onEdit={() => {
                  setEditingTask(task);
                  setDialogOpen(true);
                }}
                onDelete={() => deleteTask(task.id)}
              />
            ))
          )}
        </AnimatePresence>
      </div>

      <TaskFormDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingTask(null);
        }}
        task={editingTask}
        onSave={(data) => {
          if (editingTask) {
            updateTask(editingTask.id, data);
            setEditingTask(null);
          } else {
            addTask(data);
            setFilter("all");
          }
        }}
      />
    </div>
  );
}
