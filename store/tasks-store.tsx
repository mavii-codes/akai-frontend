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
<<<<<<< HEAD
import { apiFetch } from "@/lib/api";
import { initialTasks } from "@/lib/data";
import { generateId } from "@/lib/id";
import { isApiSyncEnabled } from "@/lib/use-api-sync";
import type { Priority, Task } from "@/types";
=======
import { generateId } from "@/lib/id";
import {
  getCurrentUserEmail,
  getUserStorageKey,
  TASKS_KEY_PREFIX,
} from "@/lib/user-data-storage";
import { normalizeTask } from "@/lib/task-utils";
import type { Priority, Task, TaskStatus } from "@/types";
>>>>>>> 7df49d51b88c1ce928757f2d94ca5b3506f8db59

function loadTasksForUser(email: string | null): Task[] {
  if (typeof window === "undefined" || !email) return [];
  try {
    const raw = localStorage.getItem(getUserStorageKey(TASKS_KEY_PREFIX, email));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Task[];
    return Array.isArray(parsed) ? parsed.map(normalizeTask) : [];
  } catch {
    return [];
  }
}

export type TaskInput = {
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  status?: TaskStatus;
  subject?: string;
  progress?: number;
};

type TasksContextValue = {
  tasks: Task[];
  addTask: (task: TaskInput) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleComplete: (id: string) => void;
  setTaskStatus: (id: string, status: TaskStatus) => void;
};

const TasksContext = createContext<TasksContextValue | null>(null);

export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
<<<<<<< HEAD
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
=======
    const refresh = () => {
      const email = getCurrentUserEmail();
      setUserEmail(email);
      setTasks(loadTasksForUser(email));
      setHydrated(true);
    };
    refresh();
    window.addEventListener("akai-auth-updated", refresh);
    window.addEventListener("akai-account-updated", refresh);
    window.addEventListener("akai-user-data-updated", refresh);
    return () => {
      window.removeEventListener("akai-auth-updated", refresh);
      window.removeEventListener("akai-account-updated", refresh);
      window.removeEventListener("akai-user-data-updated", refresh);
>>>>>>> 7df49d51b88c1ce928757f2d94ca5b3506f8db59
    };
  }, []);

  useEffect(() => {
<<<<<<< HEAD
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
=======
    if (!hydrated || !userEmail) return;
    localStorage.setItem(
      getUserStorageKey(TASKS_KEY_PREFIX, userEmail),
      JSON.stringify(tasks)
    );
  }, [tasks, hydrated, userEmail]);

  const addTask = useCallback((task: TaskInput) => {
    const status = task.status ?? "todo";
    const progress =
      task.progress ?? (status === "completed" ? 100 : status === "in-progress" ? 30 : 0);
    setTasks((prev) => [
      normalizeTask({
        ...task,
        id: generateId(),
        status,
        subject: task.subject ?? "",
        progress,
        completed: status === "completed",
        createdAt: new Date().toISOString().split("T")[0],
      }),
      ...prev,
    ]);
  }, []);
>>>>>>> 7df49d51b88c1ce928757f2d94ca5b3506f8db59

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? normalizeTask({ ...t, ...updates }) : t
      )
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
<<<<<<< HEAD
        const completed = !t.completed;
        if (isApiSyncEnabled()) {
          void apiFetch(`/api/tasks/${id}`, {
            method: "PATCH",
            body: JSON.stringify({ completed }),
          });
        }
        return { ...t, completed };
=======
        const done = t.status !== "completed";
        return normalizeTask({
          ...t,
          completed: done,
          status: done ? "completed" : "todo",
          progress: done ? 100 : 0,
        });
      })
    );
  }, []);

  const setTaskStatus = useCallback((id: string, status: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        return normalizeTask({
          ...t,
          status,
          completed: status === "completed",
          progress:
            status === "completed"
              ? 100
              : status === "in-progress"
                ? Math.max(t.progress, 10)
                : 0,
        });
>>>>>>> 7df49d51b88c1ce928757f2d94ca5b3506f8db59
      })
    );
  }, []);

  const value = useMemo(
    () => ({
      tasks,
      addTask,
      updateTask,
      deleteTask,
      toggleComplete,
      setTaskStatus,
    }),
    [tasks, addTask, updateTask, deleteTask, toggleComplete, setTaskStatus]
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
