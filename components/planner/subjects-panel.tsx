"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Plus } from "lucide-react";
import { getSubjectColor } from "@/lib/subject-colors";
import { SubjectFormDialog } from "@/components/planner/subject-form-dialog";
import type { Subject } from "@/types";
import axiosInstance from "@/lib/axios";

export function SubjectsPanel() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Subject | null>(null);

  const openAdd = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const totalDailyHours = subjects.reduce((sum, subject) => sum + subject.dailyHours, 0);

  const handleSave = async (data: {
    id: string;
    name: string;
    color: string;
    dailyHours: number;
  }) => {
    try {
      if (editing) {
        await axiosInstance.put(`/api/subjects/v1/${data.id}`, {
          name: data.name.trim(),
          color: data.color,
          dailyHours: data.dailyHours,
        });
      } else {
        await axiosInstance.post("/api/subjects/v1/create", {
          name: data.name.trim(),
          color: data.color,
          dailyHours: data.dailyHours,
        });
      }

      const response = await axiosInstance.get("/api/subjects/v1/get");
      const payload = Array.isArray(response.data?.data)
        ? response.data.data
        : Array.isArray(response.data)
          ? response.data
          : [];

      setSubjects(
        payload.map((item: Partial<Subject> & { dailyHours?: number }) => ({
          id: String(item.id ?? ""),
          name: item.name ?? "Untitled subject",
          color: item.color ?? "#10b981",
          dailyHours: Number(item.dailyHours ?? 0),
        }))
      );
    } catch (error) {
      console.error("Error saving subject:", error);
    }

    setEditing(null);
    setDialogOpen(false);
  };

  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const response = await axiosInstance.get("/api/subjects/v1/get");
        const payload = Array.isArray(response.data?.data)
          ? response.data.data
          : Array.isArray(response.data)
            ? response.data
            : [];

        setSubjects(
          payload.map((item: Partial<Subject> & { dailyHours?: number }) => ({
            id: String(item.id ?? ""),
            name: item.name ?? "Untitled subject",
            color: item.color ?? "#10b981",
            dailyHours: Number(item.dailyHours ?? 0),
          }))
        );
      } catch (error) {
        console.error("Error loading subjects:", error);
      }
    };

    loadSubjects();
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass rounded-2xl border border-emerald-100/60 shadow-sm p-4 sm:p-5"
    >
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-emerald-600" />
          <h3 className="font-semibold text-emerald-900">Subjects</h3>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="text-sm font-medium text-emerald-600 hover:text-emerald-800 flex items-center gap-1"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Subject
        </button>
      </div>

      <ul className="space-y-2 max-h-[280px] overflow-y-auto">
        {subjects.length === 0 ? (
          <li className="text-sm text-emerald-600/60 text-center py-6">
            No subjects yet. Add your courses to build a plan.
          </li>
        ) : (
          subjects.map((subject) => {
            const colors = getSubjectColor(subject.color);
            return (
              <li
                key={subject.id}
                className="flex items-center gap-3 rounded-xl border border-emerald-50 bg-white/60 px-3 py-2.5 group"
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${colors.soft}`}
                >
                  {subject.name.slice(0, 2).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-emerald-900 text-sm truncate">
                    {subject.name}
                  </p>
                  <p className="text-xs text-emerald-600/70">
                    Daily: {subject.dailyHours}h
                  </p>
                </div>
              </li>
            );
          })
        )}
      </ul>

      <p className="mt-4 pt-3 border-t border-emerald-50 text-sm font-medium text-emerald-800">
        Total Study Hours:{" "}
        <span className="text-emerald-600">
          {totalDailyHours % 1 === 0
            ? `${totalDailyHours}h`
            : `${totalDailyHours.toFixed(1)}h`}{" "}
          / day
        </span>
      </p>

      <SubjectFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        subject={editing}
        onSave={handleSave}
      />
    </motion.section>
  );
}
