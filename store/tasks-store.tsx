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
import { apiFetch } from "@/lib/api";
import { initialTasks } from "@/lib/data";
import { generateId } from "@/lib/id";
import { isApiSyncEnabled } from "@/lib/use-api-sync";
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
    let cancelled = false;

    async function load() {
      if (isApiSyncEnabled()) {
        try {
          const { tasks: remote } = await apiFetch<{ tasks: Task[] }>(
            "/api/tasks"
          );
          if (!cancelled) setTasks(remote);
        } catch {
          if (!cancelled) setTasks(loadTasksFromStorage());
        }
      } else {
        setTasks(loadTasksFromStorage());
      }
      if (!cancelled) setHydrated(true);
    }

    load();
    const onAuth = () => load();
    window.addEventListener("akai-auth-updated", onAuth);
    return () => {
      cancelled = true;
      window.removeEventListener("akai-auth-updated", onAuth);
    };
  }, []);

  useEffect(() => {
    if (!hydrated || isApiSyncEnabled()) return;
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks, hydrated]);

  const addTask = useCallback(
    (task: Omit<Task, "id" | "createdAt" | "completed">) => {
      if (isApiSyncEnabled()) {
        void apiFetch<{ task: Task }>("/api/tasks", {
          method: "POST",
          body: JSON.stringify(task),
        }).then(({ task: created }) => {
          setTasks((prev) => [created, ...prev]);
        });
        return;
      }

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
    if (isApiSyncEnabled()) {
      void apiFetch(`/api/tasks/${id}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
      });
    }
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (isApiSyncEnabled()) {
      void apiFetch(`/api/tasks/${id}`, { method: "DELETE" });
    }
  }, []);

  const toggleComplete = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const completed = !t.completed;
        if (isApiSyncEnabled()) {
          void apiFetch(`/api/tasks/${id}`, {
            method: "PATCH",
            body: JSON.stringify({ completed }),
          });
        }
        return { ...t, completed };
      })
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
