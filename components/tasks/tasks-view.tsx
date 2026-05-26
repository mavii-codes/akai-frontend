"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, List, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationsMenu } from "@/components/layout/notifications-menu";
import { PageHeaderActions } from "@/components/layout/page-header-actions";
import { Input } from "@/components/ui/input";
import { TaskFormDialog } from "@/components/tasks/task-form-dialog";
import { TaskSummaryCards } from "@/components/tasks/task-summary-cards";
import { TaskListGrouped } from "@/components/tasks/task-list-grouped";
import { TasksAiBanner } from "@/components/tasks/tasks-ai-banner";
import { TasksOverviewChart } from "@/components/tasks/tasks-overview-chart";
import { TasksCalendarWidget } from "@/components/tasks/tasks-calendar-widget";
import {
  TasksFiltersPanel,
  type TasksFilters,
} from "@/components/tasks/tasks-filters-panel";
import { TasksFocusTimer } from "@/components/tasks/tasks-focus-timer";
import { useTasks } from "@/store/tasks-store";
import { useSubjects } from "@/store/subjects-store";
import {
  filterByTab,
  getTaskCounts,
  sortTasksByPriority,
} from "@/lib/task-utils";
import type { Task, TaskStatus } from "@/types";
import { cn } from "@/lib/utils";

type TabId = "all" | TaskStatus;
type SortOption = "priority" | "due";

const defaultFilters: TasksFilters = {
  priority: "all",
  subject: "",
  status: "all",
  dueBefore: "",
};

export function TasksView() {
  const { tasks, addTask, updateTask, deleteTask, toggleComplete } = useTasks();
  const { subjects: subjectRecords } = useSubjects();
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<TabId>("all");
  const [sort, setSort] = useState<SortOption>("priority");
  const [listView, setListView] = useState(true);
  const [filters, setFilters] = useState<TasksFilters>(defaultFilters);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const counts = useMemo(() => getTaskCounts(tasks), [tasks]);

  const subjectOptions = useMemo(() => {
    const fromTasks = tasks.map((t) => t.subject).filter(Boolean);
    const fromStore = subjectRecords.map((s) => s.name);
    return [...new Set([...fromStore, ...fromTasks])].sort();
  }, [tasks, subjectRecords]);

  const filtered = useMemo(() => {
    let list = filterByTab(tasks, tab);
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.subject.toLowerCase().includes(q)
      );
    }
    if (filters.priority !== "all") {
      list = list.filter((t) => t.priority === filters.priority);
    }
    if (filters.subject) {
      list = list.filter((t) => t.subject === filters.subject);
    }
    if (filters.status !== "all") {
      list = list.filter((t) => t.status === filters.status);
    }
    if (filters.dueBefore) {
      list = list.filter((t) => t.dueDate <= filters.dueBefore);
    }
    if (sort === "priority") return sortTasksByPriority(list);
    return [...list].sort(
      (a, b) =>
        new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    );
  }, [tasks, tab, search, filters, sort]);

  const openNew = () => {
    setEditingTask(null);
    setDialogOpen(true);
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Delete this task?")) deleteTask(id);
  };

  return (
    <div className="space-y-6 w-full min-w-0">
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between min-w-0"
      >
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-emerald-900 truncate">
            Tasks
          </h1>
          <p className="text-emerald-700/70 mt-1 text-sm sm:text-base">
            Manage your tasks and stay productive.
          </p>
        </div>
        <PageHeaderActions>
          <Button
            onClick={openNew}
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-md shadow-emerald-600/20"
          >
            <Plus className="h-4 w-4 shrink-0" />
            <span className="truncate">New Task</span>
          </Button>
          <div className="flex items-center justify-end gap-2 w-full sm:w-auto">
            <NotificationsMenu align="end" />
          </div>
        </PageHeaderActions>
      </motion.header>

      <div className="relative max-w-xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500/60 pointer-events-none" />
        <Input
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-11 rounded-xl border-emerald-100 bg-white/80 shadow-sm"
        />
        <kbd className="hidden sm:inline absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-emerald-500/50 border border-emerald-100 rounded px-1.5 py-0.5 bg-emerald-50/50">
          /
        </kbd>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-5 min-w-0">
          <TaskSummaryCards
            counts={counts}
            activeTab={tab}
            onTabChange={setTab}
          />

          <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-emerald-600/70">Sort by:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="h-8 rounded-lg border border-emerald-100 bg-white/80 px-2 text-emerald-900 text-sm"
              >
                <option value="priority">Priority</option>
                <option value="due">Due Date</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-600/70">View:</span>
              <div className="flex rounded-lg border border-emerald-100 bg-white/70 p-0.5">
                <button
                  type="button"
                  onClick={() => setListView(true)}
                  className={cn(
                    "flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium",
                    listView
                      ? "bg-emerald-600 text-white"
                      : "text-emerald-700 hover:bg-emerald-50"
                  )}
                >
                  <List className="h-3.5 w-3.5" />
                  List
                </button>
                <button
                  type="button"
                  onClick={() => setListView(false)}
                  className={cn(
                    "flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium",
                    !listView
                      ? "bg-emerald-600 text-white"
                      : "text-emerald-700 hover:bg-emerald-50"
                  )}
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                  Board
                </button>
              </div>
            </div>
          </div>

          {listView ? (
            <TaskListGrouped
              tasks={filtered}
              onToggle={toggleComplete}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(["todo", "in-progress", "completed"] as TaskStatus[]).map(
                (status) => {
                  const col = filtered.filter((t) => t.status === status);
                  const titles = {
                    todo: "To Do",
                    "in-progress": "In Progress",
                    completed: "Done",
                  };
                  return (
                    <div
                      key={status}
                      className="rounded-xl border border-emerald-50 bg-emerald-50/30 p-3 min-h-[200px]"
                    >
                      <h4 className="text-xs font-semibold text-emerald-800 mb-3 uppercase tracking-wide">
                        {titles[status]} ({col.length})
                      </h4>
                      <div className="space-y-2">
                        {col.length === 0 ? (
                          <p className="text-xs text-emerald-600/50 py-4 text-center">
                            Empty
                          </p>
                        ) : (
                          col.map((task) => (
                            <button
                              key={task.id}
                              type="button"
                              onClick={() => openEdit(task)}
                              className="w-full text-left rounded-lg border border-emerald-100 bg-white p-3 text-sm hover:shadow-sm transition-shadow"
                            >
                              <p className="font-medium text-emerald-900 line-clamp-1">
                                {task.title}
                              </p>
                              {task.subject && (
                                <span className="text-[10px] text-emerald-600">
                                  {task.subject}
                                </span>
                              )}
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}

          <TasksAiBanner />
        </div>

        <aside className="space-y-5 min-w-0">
          <TasksOverviewChart
            todo={counts.todo}
            inProgress={counts.inProgress}
            completed={counts.completed}
          />
          <TasksCalendarWidget tasks={tasks} />
          <TasksFiltersPanel
            filters={filters}
            onChange={setFilters}
            subjects={subjectOptions}
          />
          <TasksFocusTimer />
        </aside>
      </div>

      <TaskFormDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingTask(null);
        }}
        task={editingTask}
        subjectSuggestions={subjectOptions}
        onSave={(data) => {
          if (editingTask) {
            updateTask(editingTask.id, data);
          } else {
            addTask(data);
          }
          setEditingTask(null);
        }}
      />
    </div>
  );
}
