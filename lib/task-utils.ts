import type { Priority, Task, TaskStatus } from "@/types";

export function normalizeTask(raw: Task): Task {
  const status: TaskStatus =
    raw.status ??
    (raw.completed ? "completed" : raw.progress > 0 ? "in-progress" : "todo");
  const progress =
    raw.progress ??
    (status === "completed" ? 100 : status === "in-progress" ? 50 : 0);
  return {
    ...raw,
    status,
    progress,
    subject: raw.subject ?? "",
    completed: status === "completed" || raw.completed,
  };
}

export function getDaysUntilDue(dueDate: string): number {
  const due = new Date(dueDate + "T12:00:00");
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  return Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function formatDueLabel(days: number): string {
  if (days < 0) return "Overdue";
  if (days === 0) return "Due today";
  if (days === 1) return "Due in 1 day";
  return `Due in ${days} days`;
}

export function dueBadgeClass(days: number): string {
  if (days <= 2) return "bg-rose-100 text-rose-700 border-rose-200";
  if (days <= 7) return "bg-amber-100 text-amber-800 border-amber-200";
  return "bg-emerald-100 text-emerald-700 border-emerald-200";
}

const PRIORITY_ORDER: Record<Priority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export function sortTasksByPriority(tasks: Task[]): Task[] {
  return [...tasks].sort(
    (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
  );
}

export function groupTasksByPriority(tasks: Task[]): Record<Priority, Task[]> {
  const groups: Record<Priority, Task[]> = {
    high: [],
    medium: [],
    low: [],
  };
  sortTasksByPriority(tasks).forEach((t) => groups[t.priority].push(t));
  return groups;
}

export function getTaskCounts(tasks: Task[]) {
  const todo = tasks.filter((t) => t.status === "todo").length;
  const inProgress = tasks.filter((t) => t.status === "in-progress").length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  return {
    all: tasks.length,
    todo,
    inProgress,
    completed,
  };
}

export function filterByTab(tasks: Task[], tab: "all" | TaskStatus): Task[] {
  if (tab === "all") return tasks;
  return tasks.filter((t) => t.status === tab);
}

export const PRIORITY_SECTION_META: Record<
  Priority,
  { label: string; flagClass: string; dotClass: string }
> = {
  high: {
    label: "High Priority",
    flagClass: "text-rose-500",
    dotClass: "bg-rose-500",
  },
  medium: {
    label: "Medium Priority",
    flagClass: "text-amber-500",
    dotClass: "bg-amber-500",
  },
  low: {
    label: "Low Priority",
    flagClass: "text-emerald-500",
    dotClass: "bg-emerald-500",
  },
};

export const SUBJECT_TAG_COLORS = [
  "bg-emerald-100 text-emerald-800",
  "bg-teal-100 text-teal-800",
  "bg-cyan-100 text-cyan-800",
  "bg-violet-100 text-violet-800",
  "bg-amber-100 text-amber-800",
  "bg-rose-100 text-rose-800",
];

export function subjectTagClass(subject: string): string {
  if (!subject) return "bg-emerald-50 text-emerald-600";
  let hash = 0;
  for (let i = 0; i < subject.length; i++) hash += subject.charCodeAt(i);
  return SUBJECT_TAG_COLORS[hash % SUBJECT_TAG_COLORS.length];
}
