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
import { plannerBlocks as initialSchedules } from "@/lib/data";
import { generateId } from "@/lib/id";
import { isApiSyncEnabled } from "@/lib/use-api-sync";
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
    let cancelled = false;

    async function load() {
      if (isApiSyncEnabled()) {
        try {
          const { blocks } = await apiFetch<{ blocks: PlannerBlock[] }>(
            "/api/planner"
          );
          if (!cancelled) setSchedules(blocks);
        } catch {
          if (!cancelled) setSchedules(loadSchedulesFromStorage());
        }
      } else {
        setSchedules(loadSchedulesFromStorage());
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
    localStorage.setItem(SCHEDULES_STORAGE_KEY, JSON.stringify(schedules));
  }, [schedules, hydrated]);

  const addSchedule = useCallback((schedule: ScheduleInput) => {
    if (isApiSyncEnabled()) {
      void apiFetch<{ block: PlannerBlock }>("/api/planner", {
        method: "POST",
        body: JSON.stringify(schedule),
      }).then(({ block }) => {
        setSchedules((prev) => [...prev, block]);
      });
      return;
    }

    setSchedules((prev) => [...prev, { ...schedule, id: generateId() }]);
  }, []);

  const updateSchedule = useCallback((id: string, updates: Partial<PlannerBlock>) => {
    setSchedules((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
    if (isApiSyncEnabled()) {
      void apiFetch(`/api/planner/${id}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
      });
    }
  }, []);

  const deleteSchedule = useCallback((id: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
    if (isApiSyncEnabled()) {
      void apiFetch(`/api/planner/${id}`, { method: "DELETE" });
    }
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
