"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { initialTasks } from "@/lib/data";
import { generateId } from "@/lib/id";
import type { Priority, Task } from "@/types";

const TASKS_STORAGE_KEY = "akai-tasks";

function loadTasksFromStorage(): Task[] {
  if (typeof window === "undefined") return initialTasks;
  try {
    const raw = localStorage.getItem(TASKS_STORAGE_KEY);
    if (!raw) return initialTasks;
    const parsed = JSON.parse(raw) as Task[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialTasks;
  } catch {
    return initialTasks;
  }
}

type TasksContextValue = {
  tasks: Task[];
  addTask: (task: Omit<Task, "id" | "createdAt" | "completed">) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleComplete: (id: string) => void;
};

const TasksContext = createContext<TasksContextValue | null>(null);

export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setTasks(loadTasksFromStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks, hydrated]);

  const addTask = useCallback(
    (task: Omit<Task, "id" | "createdAt" | "completed">) => {
      setTasks((prev) => [
        {
          ...task,
          id: generateId(),
          completed: false,
          createdAt: new Date().toISOString().split("T")[0],
        },
        ...prev,
      ]);
    },
    []
  );

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleComplete = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }, []);

  const value = useMemo(
    () => ({ tasks, addTask, updateTask, deleteTask, toggleComplete }),
    [tasks, addTask, updateTask, deleteTask, toggleComplete]
  );

  return (
    <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
  );
}

export function useTasks() {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error("useTasks must be used within TasksProvider");
  return ctx;
}

export function getPriorityColor(priority: Priority) {
  switch (priority) {
    case "high":
      return "bg-emerald-600/15 text-emerald-800 border-emerald-200";
    case "medium":
      return "bg-emerald-500/10 text-emerald-700 border-emerald-200";
    case "low":
      return "bg-emerald-400/10 text-emerald-600 border-emerald-100";
  }
}
