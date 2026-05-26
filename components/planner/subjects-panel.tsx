"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSubjects } from "@/store/subjects-store";
import { getSubjectColor } from "@/lib/subject-colors";
import { SubjectFormDialog } from "@/components/planner/subject-form-dialog";
import type { Subject } from "@/types";

export function SubjectsPanel() {
  const { subjects, addSubject, updateSubject, deleteSubject, totalDailyHours } =
    useSubjects();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Subject | null>(null);

  const openAdd = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (subject: Subject) => {
    setEditing(subject);
    setDialogOpen(true);
  };

  const handleDelete = (subject: Subject) => {
    if (window.confirm(`Remove "${subject.name}"?`)) {
      deleteSubject(subject.id);
    }
  };

  const handleSave = (data: {
    name: string;
    color: string;
    dailyHours: number;
  }) => {
    if (editing) {
      updateSubject(editing.id, data);
    } else {
      addSubject(data);
    }
    setEditing(null);
  };

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
                <div className="flex items-center gap-0.5 opacity-70 group-hover:opacity-100">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-emerald-600"
                    onClick={() => openEdit(subject)}
                    aria-label={`Edit ${subject.name}`}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-rose-500 hover:text-rose-600"
                    onClick={() => handleDelete(subject)}
                    aria-label={`Delete ${subject.name}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
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
