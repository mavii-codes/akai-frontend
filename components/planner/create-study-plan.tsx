"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Calendar, Clock, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDateRange } from "@/lib/planner-utils";
import { buildWeeklyPlanFromSubjects } from "@/lib/generate-plan";
import { usePlanner } from "@/store/planner-store";
import { useSubjects } from "@/store/subjects-store";
import { cn } from "@/lib/utils";

const HOUR_OPTIONS = [2, 3, 4, 5, 6, 7, 8];
const MODE_OPTIONS = [
  { value: "balanced", label: "Balanced (Recommended)" },
  { value: "intensive", label: "Intensive" },
  { value: "light", label: "Light" },
];

type CreateStudyPlanProps = {
  onGenerated?: () => void;
  className?: string;
};

export function CreateStudyPlan({ onGenerated, className }: CreateStudyPlanProps) {
  const { replaceSchedules } = usePlanner();
  const { subjects } = useSubjects();
  const [dailyHours, setDailyHours] = useState(6);
  const [studyMode, setStudyMode] = useState("balanced");
  const [periodStart, setPeriodStart] = useState(() => {
    const d = new Date();
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    return d.toISOString().slice(0, 10);
  });
  const [periodEnd, setPeriodEnd] = useState(() => {
    const d = new Date();
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff + 6);
    return d.toISOString().slice(0, 10);
  });

  const periodLabel = useMemo(() => {
    const start = new Date(periodStart + "T12:00:00");
    const end = new Date(periodEnd + "T12:00:00");
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return "Select study period";
    }
    return formatDateRange(start, end);
  }, [periodStart, periodEnd]);

  const handleGenerate = () => {
    if (subjects.length === 0) {
      window.alert("Add at least one subject before generating your plan.");
      return;
    }
    const hours =
      studyMode === "intensive"
        ? Math.min(8, dailyHours + 1)
        : studyMode === "light"
          ? Math.max(2, dailyHours - 1)
          : dailyHours;
    replaceSchedules(buildWeeklyPlanFromSubjects(subjects, hours));
    onGenerated?.();
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-emerald-100/80 bg-gradient-to-br from-emerald-50/90 via-white to-emerald-50/50 p-5 sm:p-6 md:p-8 shadow-sm",
        className
      )}
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1 min-w-0 space-y-5">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-emerald-900">
              Create Your Study Plan
            </h2>
            <p className="text-sm text-emerald-700/70 mt-1">
              Set your week, hours, and mode — then generate a schedule.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
              <Label className="text-emerald-800 text-xs font-medium">
                Study Period
              </Label>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  type="date"
                  value={periodStart}
                  onChange={(e) => setPeriodStart(e.target.value)}
                  className="bg-white/80 border-emerald-100"
                />
                <Input
                  type="date"
                  value={periodEnd}
                  onChange={(e) => setPeriodEnd(e.target.value)}
                  className="bg-white/80 border-emerald-100"
                />
              </div>
              <p className="text-xs text-emerald-600/70 truncate">{periodLabel}</p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-emerald-800 text-xs font-medium">
                Daily Study Hours
              </Label>
              <select
                value={dailyHours}
                onChange={(e) => setDailyHours(Number(e.target.value))}
                className="h-8 w-full rounded-lg border border-emerald-100 bg-white/80 px-2.5 text-sm text-emerald-900 outline-none focus-visible:border-emerald-400 focus-visible:ring-3 focus-visible:ring-emerald-400/30"
              >
                {HOUR_OPTIONS.map((h) => (
                  <option key={h} value={h}>
                    {h} hours
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-emerald-800 text-xs font-medium">
                Study Mode
              </Label>
              <select
                value={studyMode}
                onChange={(e) => setStudyMode(e.target.value)}
                className="h-8 w-full rounded-lg border border-emerald-100 bg-white/80 px-2.5 text-sm text-emerald-900 outline-none focus-visible:border-emerald-400 focus-visible:ring-3 focus-visible:ring-emerald-400/30"
              >
                {MODE_OPTIONS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-md shadow-emerald-600/20"
          >
            <Sparkles className="h-4 w-4" />
            Generate Plan
          </Button>
        </div>

        <div
          className="hidden md:flex items-center justify-center gap-3 shrink-0 pr-4"
          aria-hidden
        >
          <div className="relative flex h-28 w-28 items-center justify-center rounded-2xl bg-emerald-100/80 shadow-inner">
            <Calendar className="h-12 w-12 text-emerald-600/80" />
            <Clock className="absolute -bottom-1 -right-2 h-8 w-8 text-emerald-500/90" />
            <BookOpen className="absolute -top-1 -left-2 h-7 w-7 text-emerald-700/70" />
          </div>
        </div>
      </div>
    </motion.section>
  );
}
