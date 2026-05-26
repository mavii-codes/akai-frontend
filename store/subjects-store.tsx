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
  SUBJECTS_KEY_PREFIX,
} from "@/lib/user-data-storage";
import type { Subject } from "@/types";

function loadSubjectsForUser(email: string | null): Subject[] {
  if (typeof window === "undefined" || !email) return [];
  try {
    const raw = localStorage.getItem(
      getUserStorageKey(SUBJECTS_KEY_PREFIX, email)
    );
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Subject[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export type SubjectInput = Omit<Subject, "id">;

type SubjectsContextValue = {
  subjects: Subject[];
  addSubject: (subject: SubjectInput) => void;
  updateSubject: (id: string, updates: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;
  totalDailyHours: number;
};

const SubjectsContext = createContext<SubjectsContextValue | null>(null);

export function SubjectsProvider({ children }: { children: ReactNode }) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const refresh = () => {
      const email = getCurrentUserEmail();
      setUserEmail(email);
      setSubjects(loadSubjectsForUser(email));
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
      getUserStorageKey(SUBJECTS_KEY_PREFIX, userEmail),
      JSON.stringify(subjects)
    );
  }, [subjects, hydrated, userEmail]);

  const addSubject = useCallback((subject: SubjectInput) => {
    setSubjects((prev) => [...prev, { ...subject, id: generateId() }]);
  }, []);

  const updateSubject = useCallback((id: string, updates: Partial<Subject>) => {
    setSubjects((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  }, []);

  const deleteSubject = useCallback((id: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const totalDailyHours = useMemo(
    () => subjects.reduce((sum, s) => sum + s.dailyHours, 0),
    [subjects]
  );

  const value = useMemo(
    () => ({
      subjects,
      addSubject,
      updateSubject,
      deleteSubject,
      totalDailyHours,
    }),
    [subjects, addSubject, updateSubject, deleteSubject, totalDailyHours]
  );

  return (
    <SubjectsContext.Provider value={value}>
      {children}
    </SubjectsContext.Provider>
  );
}

export function useSubjects() {
  const ctx = useContext(SubjectsContext);
  if (!ctx) throw new Error("useSubjects must be used within SubjectsProvider");
  return ctx;
}
