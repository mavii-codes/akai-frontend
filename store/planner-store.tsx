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
import { plannerBlocks as initialSchedules } from "@/lib/data";
import { generateId } from "@/lib/id";
import type { PlannerBlock } from "@/types";

const SCHEDULES_STORAGE_KEY = "akai-schedules";

function loadSchedulesFromStorage(): PlannerBlock[] {
  if (typeof window === "undefined") return initialSchedules;
  try {
    const raw = localStorage.getItem(SCHEDULES_STORAGE_KEY);
    if (!raw) return initialSchedules;
    const parsed = JSON.parse(raw) as PlannerBlock[];
    return Array.isArray(parsed) ? parsed : initialSchedules;
  } catch {
    return initialSchedules;
  }
}

export type ScheduleInput = Omit<PlannerBlock, "id">;

type PlannerContextValue = {
  schedules: PlannerBlock[];
  addSchedule: (schedule: ScheduleInput) => void;
  updateSchedule: (id: string, updates: Partial<PlannerBlock>) => void;
  deleteSchedule: (id: string) => void;
};

const PlannerContext = createContext<PlannerContextValue | null>(null);

export function PlannerProvider({ children }: { children: ReactNode }) {
  const [schedules, setSchedules] = useState<PlannerBlock[]>(initialSchedules);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSchedules(loadSchedulesFromStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(SCHEDULES_STORAGE_KEY, JSON.stringify(schedules));
  }, [schedules, hydrated]);

  const addSchedule = useCallback((schedule: ScheduleInput) => {
    setSchedules((prev) => [
      ...prev,
      { ...schedule, id: generateId() },
    ]);
  }, []);

  const updateSchedule = useCallback((id: string, updates: Partial<PlannerBlock>) => {
    setSchedules((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  }, []);

  const deleteSchedule = useCallback((id: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const value = useMemo(
    () => ({ schedules, addSchedule, updateSchedule, deleteSchedule }),
    [schedules, addSchedule, updateSchedule, deleteSchedule]
  );

  return (
    <PlannerContext.Provider value={value}>{children}</PlannerContext.Provider>
  );
}

export function usePlanner() {
  const ctx = useContext(PlannerContext);
  if (!ctx) throw new Error("usePlanner must be used within PlannerProvider");
  return ctx;
}
