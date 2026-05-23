"use client";

import { useEffect, useState } from "react";
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
import type { ScheduleInput } from "@/store/planner-store";
import { cn } from "@/lib/utils";

const DAYS: DayOfWeek[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TYPES = ["class", "study", "break"] as const;

type ScheduleFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schedule?: PlannerBlock | null;
  onSave: (data: ScheduleInput) => void;
};

export function ScheduleFormDialog({
  open,
  onOpenChange,
  schedule,
  onSave,
}: ScheduleFormDialogProps) {
  const [title, setTitle] = useState("");
  const [timeValue, setTimeValue] = useState("09:00");
  const [type, setType] = useState<PlannerBlock["type"]>("study");
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek>("Mon");
  const [date, setDate] = useState("");

  useEffect(() => {
    if (schedule) {
      setTitle(schedule.title);
      setType(schedule.type);
      setDayOfWeek(schedule.dayOfWeek);
      setDate(schedule.date ?? "");
      const match = schedule.time.match(/(\d{1,2}):(\d{2})/);
      if (match) {
        let h = parseInt(match[1], 10);
        const m = match[2];
        if (schedule.time.toUpperCase().includes("PM") && h !== 12) h += 12;
        if (schedule.time.toUpperCase().includes("AM") && h === 12) h = 0;
        setTimeValue(`${String(h).padStart(2, "0")}:${m}`);
      }
    } else {
      setTitle("");
      setTimeValue("09:00");
      setType("study");
      setDayOfWeek(getTodayDayOfWeek() as DayOfWeek);
      setDate(new Date().toISOString().split("T")[0]);
    }
  }, [schedule, open]);

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
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              placeholder="e.g. Math Review"
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
