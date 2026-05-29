"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatTimeInput, getTodayDayOfWeek } from "@/lib/time-utils";
import type { DayOfWeek, PlannerBlock } from "@/types";
import { cn } from "@/lib/utils";

export type ScheduleInput = {
  title: string;
  time: string;
  type: PlannerBlock["type"];
  dayOfWeek: DayOfWeek;
  date?: string;
};

const DAYS: DayOfWeek[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TYPES = ["class", "study", "break"] as const;

type ScheduleFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schedule?: PlannerBlock | null;
  onSave: (data: ScheduleInput) => void;
};

function getInitialFormState(schedule?: PlannerBlock | null) {
  const match = schedule?.time.match(/(\d{1,2}):(\d{2})/);
  let timeValue = "09:00";

  if (match) {
    let h = Number(match[1]);
    const m = match[2];
    if (schedule.time.toUpperCase().includes("PM") && h !== 12) h += 12;
    if (schedule.time.toUpperCase().includes("AM") && h === 12) h = 0;
    timeValue = `${String(h).padStart(2, "0")}:${m}`;
  }

  return {
    title: schedule?.title ?? "",
    timeValue,
    type: schedule?.type ?? "study",
    dayOfWeek: schedule?.dayOfWeek ?? (getTodayDayOfWeek() as DayOfWeek),
    date: schedule?.date ?? new Date().toISOString().split("T")[0],
  };
}

export function ScheduleFormDialog({
  open,
  onOpenChange,
  schedule,
  onSave,
}: ScheduleFormDialogProps) {
  const initialState = getInitialFormState(schedule);
  const [title, setTitle] = useState(initialState.title);
  const [timeValue, setTimeValue] = useState(initialState.timeValue);
  const [type, setType] = useState<PlannerBlock["type"]>(initialState.type);
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek>(initialState.dayOfWeek);
  const [date, setDate] = useState(initialState.date);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      time: formatTimeInput(timeValue),
      type,
      dayOfWeek,
      date: date || undefined,
    });
    onOpenChange(false);
  };

  return (
    <Dialog
      key={`${schedule?.id ?? "new"}-${open}`}
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="rounded-2xl border-emerald-100 w-[calc(100vw-2rem)] max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-emerald-900">
            {schedule ? "Edit Schedule" : "Add Schedule"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="schedule-title">Title</Label>
            <Input
              id="schedule-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Study session"
              className="rounded-xl border-emerald-100"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="schedule-time">Time</Label>
              <Input
                id="schedule-time"
                type="time"
                value={timeValue}
                onChange={(e) => setTimeValue(e.target.value)}
                className="rounded-xl border-emerald-100"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="schedule-date">Date (optional)</Label>
              <Input
                id="schedule-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="rounded-xl border-emerald-100"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Day</Label>
            <div className="flex flex-wrap gap-2">
              {DAYS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDayOfWeek(d)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                    dayOfWeek === d
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "border-emerald-100 text-emerald-700 hover:bg-emerald-50"
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <div className="flex gap-2">
              {TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={cn(
                    "flex-1 rounded-xl py-2 text-sm font-medium capitalize border transition-all",
                    type === t
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "border-emerald-100 text-emerald-700 hover:bg-emerald-50"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <Button
            type="submit"
            className="w-full rounded-xl gradient-green border-0"
          >
            {schedule ? "Save Changes" : "Add Schedule"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
