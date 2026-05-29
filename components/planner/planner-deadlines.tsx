"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Target, Plus, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DeadlineFormDialog } from "@/components/dashboard/deadline-form-dialog";
import { DeadlinesViewAll } from "@/components/dashboard/deadlines-view-all";
import { cn } from "@/lib/utils";
import type { Planner, Subject } from "@/types";
import axiosInstance from "@/lib/axios";

const PREVIEW_COUNT = 3;

function daysLeftBadgeClass(days: number) {
  if (days <= 2) return "bg-rose-100 text-rose-700 border-rose-200";
  if (days <= 7) return "bg-amber-100 text-amber-800 border-amber-200";
  return "bg-emerald-100 text-emerald-700 border-emerald-200";
}

export function PlannerDeadlines() {
  const [deadlines, setDeadlines] = useState<Planner[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [viewAllOpen, setViewAllOpen] = useState(false);
  const [editing, setEditing] = useState<Planner | null>(null);

  const preview = deadlines.slice(0, PREVIEW_COUNT);

  useEffect(() => {
    let isMounted = true;

    const getInitialState = async () => {
      try {
        const response = await axiosInstance.get("/api/deadlines/v1/get");
        const subjectsResponse = await axiosInstance.get("/api/subjects/v1/get");
        const nextDeadlines = Array.isArray(response.data.data)
          ? response.data.data
          : Array.isArray(response.data?.data)
            ? response.data.data
            : [];

        const nextSubjects = Array.isArray(subjectsResponse.data.data)
          ? subjectsResponse.data.data
          : Array.isArray(subjectsResponse.data?.data)
            ? subjectsResponse.data.data
            : [];

        if (isMounted) {
          setDeadlines(nextDeadlines as Planner[]);
          setSubjects(nextSubjects as Subject[]);
        }
      } catch (error) {
        console.error("Error loading deadlines:", error);
      }
    };

    getInitialState();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="glass rounded-2xl border border-emerald-100/60 shadow-sm p-4 sm:p-5"
    >
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-emerald-600" />
          <h3 className="font-semibold text-emerald-900">Upcoming Deadlines</h3>
        </div>
        <button
          type="button"
          onClick={() => setViewAllOpen(true)}
          className="text-sm font-medium text-emerald-600 hover:text-emerald-800 flex items-center gap-0.5"
        >
          View all
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <ul className="space-y-2.5">
        {preview.length === 0 ? (
          <li className="text-sm text-emerald-600/60 text-center py-4">
            No deadlines yet. Add one to populate your study timeline.
          </li>
        ) : (
          preview.map((item) => {
            const dueDate: any = new Date(item.dueDate);
            const today: any = new Date();

            const daysRemaining = Math.ceil(
              (dueDate - today) / (1000 * 60 * 60 * 24)
            );
          
            const firstLetter = item.title[0];
            const dateLabel = new Date(item.dueDate).toLocaleDateString(
              "en-US",
              {
                month: "long",
                day: "numeric",
                year: "numeric",
              }
            );

            return (
              <li
                key={item.id}
                className="flex items-center gap-3 rounded-xl border border-emerald-50 bg-white/60 p-2.5"
              >
                <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-emerald-600 text-white text-center leading-tight">
                  <span className="text-[9px] font-semibold uppercase tracking-wide opacity-90">
                    {firstLetter}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-emerald-900 text-sm truncate">
                    {item.title}
                  </p>
                  <p className="text-xs text-emerald-600/70">{dateLabel}</p>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "shrink-0 text-xs font-medium",
                    daysLeftBadgeClass(daysRemaining)
                  )}
                >
                  {daysRemaining < 0
                    ? "Past due"
                    : daysRemaining === 0
                      ? "Today"
                      : daysRemaining === 1
                        ? "1 day left"
                        : `${daysRemaining} days left`}
                </Badge>
              </li>
            );
          })
        )}
      </ul>

      <button
        type="button"
        onClick={() => {
          setEditing(null);
          setAddOpen(true);
        }}
        className="mt-4 w-full text-sm font-medium text-emerald-600 hover:text-emerald-800 flex items-center justify-center gap-1 py-2"
      >
        <Plus className="h-4 w-4" />
        Add Deadline
      </button>

      <DeadlineFormDialog
        open={addOpen}
        onOpenChange={(open) => {
          setAddOpen(open);
          if (!open) setEditing(null);
        }}
        deadline={editing}
        onSave={(data) => {

        }}
      />

      <DeadlinesViewAll open={viewAllOpen} onOpenChange={setViewAllOpen} data={deadlines} />
    </motion.section>
  );
}
