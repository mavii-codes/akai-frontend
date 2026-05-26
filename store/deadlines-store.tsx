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
import { upcomingDeadlines as initialDeadlines } from "@/lib/data";
import { generateId } from "@/lib/id";
import type { Deadline } from "@/types";

const DEADLINES_STORAGE_KEY = "akai-deadlines";

function loadDeadlinesFromStorage(): Deadline[] {
  if (typeof window === "undefined") return initialDeadlines;
  try {
    const raw = localStorage.getItem(DEADLINES_STORAGE_KEY);
    if (!raw) return initialDeadlines;
    const parsed = JSON.parse(raw) as Deadline[];
    if (!Array.isArray(parsed)) return initialDeadlines;
    return parsed.map(normalizeDeadline);
  } catch {
    return initialDeadlines;
  }
}

function normalizeDeadline(d: Deadline & { dueDate?: string; daysLeft?: number }): Deadline {
  if (d.dueDateIso) return { id: d.id, title: d.title, dueDateIso: d.dueDateIso, icon: d.icon };
  return {
    id: d.id,
    title: d.title,
    dueDateIso: new Date().toISOString().split("T")[0],
    icon: d.icon ?? "file-text",
  };
}

export function getDaysLeft(isoDate: string): number {
  const due = new Date(isoDate + "T23:59:59");
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diff = due.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function formatDeadlineDate(isoDate: string): string {
  return new Date(isoDate + "T12:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export type DeadlineInput = {
  title: string;
  dueDate: string;
  icon?: string;
};

type DeadlinesContextValue = {
  deadlines: Deadline[];
  addDeadline: (input: DeadlineInput) => void;
  updateDeadline: (id: string, input: DeadlineInput) => void;
  deleteDeadline: (id: string) => void;
};

const DeadlinesContext = createContext<DeadlinesContextValue | null>(null);

export function DeadlinesProvider({ children }: { children: ReactNode }) {
  const [deadlines, setDeadlines] = useState<Deadline[]>(initialDeadlines);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setDeadlines(loadDeadlinesFromStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(DEADLINES_STORAGE_KEY, JSON.stringify(deadlines));
  }, [deadlines, hydrated]);

  const addDeadline = useCallback((input: DeadlineInput) => {
    setDeadlines((prev) => [
      {
        id: generateId(),
        title: input.title.trim(),
        dueDateIso: input.dueDate,
        icon: input.icon ?? "file-text",
      },
      ...prev,
    ]);
  }, []);

  const updateDeadline = useCallback((id: string, input: DeadlineInput) => {
    setDeadlines((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              title: input.title.trim(),
              dueDateIso: input.dueDate,
              icon: input.icon ?? d.icon,
            }
          : d
      )
    );
  }, []);

  const deleteDeadline = useCallback((id: string) => {
    setDeadlines((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const sorted = useMemo(() => {
    return [...deadlines].sort(
      (a, b) => getDaysLeft(a.dueDateIso) - getDaysLeft(b.dueDateIso)
    );
  }, [deadlines]);

  const value = useMemo(
    () => ({
      deadlines: sorted,
      addDeadline,
      updateDeadline,
      deleteDeadline,
    }),
    [sorted, addDeadline, updateDeadline, deleteDeadline]
  );

  return (
    <DeadlinesContext.Provider value={value}>{children}</DeadlinesContext.Provider>
  );
}

export function useDeadlines() {
  const ctx = useContext(DeadlinesContext);
  if (!ctx) throw new Error("useDeadlines must be used within DeadlinesProvider");
  return ctx;
}
