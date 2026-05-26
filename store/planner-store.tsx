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
import { generateId } from "@/lib/id";
import {
  getCurrentUserEmail,
  getUserStorageKey,
  SCHEDULES_KEY_PREFIX,
} from "@/lib/user-data-storage";
import type { PlannerBlock } from "@/types";

function loadSchedulesForUser(email: string | null): PlannerBlock[] {
  if (typeof window === "undefined" || !email) return [];
  try {
    const raw = localStorage.getItem(
      getUserStorageKey(SCHEDULES_KEY_PREFIX, email)
    );
    if (!raw) return [];
    const parsed = JSON.parse(raw) as PlannerBlock[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export type ScheduleInput = Omit<PlannerBlock, "id">;

type PlannerContextValue = {
  schedules: PlannerBlock[];
  addSchedule: (schedule: ScheduleInput) => void;
  updateSchedule: (id: string, updates: Partial<PlannerBlock>) => void;
  deleteSchedule: (id: string) => void;
  replaceSchedules: (schedules: PlannerBlock[]) => void;
};

const PlannerContext = createContext<PlannerContextValue | null>(null);

export function PlannerProvider({ children }: { children: ReactNode }) {
  const [schedules, setSchedules] = useState<PlannerBlock[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const refresh = () => {
      const email = getCurrentUserEmail();
      setUserEmail(email);
      setSchedules(loadSchedulesForUser(email));
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
    };
  }, []);

  useEffect(() => {
    if (!hydrated || !userEmail) return;
    localStorage.setItem(
      getUserStorageKey(SCHEDULES_KEY_PREFIX, userEmail),
      JSON.stringify(schedules)
    );
  }, [schedules, hydrated, userEmail]);

  const addSchedule = useCallback((schedule: ScheduleInput) => {
    setSchedules((prev) => [...prev, { ...schedule, id: generateId() }]);
  }, []);

  const updateSchedule = useCallback((id: string, updates: Partial<PlannerBlock>) => {
    setSchedules((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  }, []);

  const deleteSchedule = useCallback((id: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const replaceSchedules = useCallback((next: PlannerBlock[]) => {
    setSchedules(next);
  }, []);

  const value = useMemo(
    () => ({
      schedules,
      addSchedule,
      updateSchedule,
      deleteSchedule,
      replaceSchedules,
    }),
    [schedules, addSchedule, updateSchedule, deleteSchedule, replaceSchedules]
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
