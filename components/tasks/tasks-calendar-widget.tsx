"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Task } from "@/types";

type TasksCalendarWidgetProps = {
  tasks: Task[];
};

export function TasksCalendarWidget({ tasks }: TasksCalendarWidgetProps) {
  const [viewDate, setViewDate] = useState(() => new Date());

  const { year, month, daysInMonth, firstDay, monthLabel } = useMemo(() => {
    const y = viewDate.getFullYear();
    const m = viewDate.getMonth();
    const first = new Date(y, m, 1);
    const last = new Date(y, m + 1, 0);
    return {
      year: y,
      month: m,
      daysInMonth: last.getDate(),
      firstDay: first.getDay(),
      monthLabel: first.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
    };
  }, [viewDate]);

  const tasksByDay = useMemo(() => {
    const map = new Map<number, number>();
    tasks.forEach((t) => {
      const d = new Date(t.dueDate + "T12:00:00");
      if (d.getMonth() === month && d.getFullYear() === year) {
        const day = d.getDate();
        map.set(day, (map.get(day) ?? 0) + 1);
      }
    });
    return map;
  }, [tasks, month, year]);

  const today = new Date();
  const isCurrentMonth =
    today.getMonth() === month && today.getFullYear() === year;

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const prevMonth = () =>
    setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () =>
    setViewDate(new Date(year, month + 1, 1));

  return (
    <section className="glass rounded-2xl border border-emerald-100/60 p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-emerald-600" />
          <h3 className="font-semibold text-emerald-900 text-sm">
            Upcoming Tasks
          </h3>
        </div>
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={prevMonth}
            className="p-1 rounded-md text-emerald-600 hover:bg-emerald-50"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={nextMonth}
            className="p-1 rounded-md text-emerald-600 hover:bg-emerald-50"
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <p className="text-xs font-medium text-emerald-700 mb-3">{monthLabel}</p>
      <div className="grid grid-cols-7 gap-0.5 text-center text-[10px] text-emerald-600/70 mb-1">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, i) => {
          if (day === null) {
            return <div key={`e-${i}`} className="h-8" />;
          }
          const hasTasks = tasksByDay.has(day);
          const isToday = isCurrentMonth && day === today.getDate();
          return (
            <div
              key={day}
              className={cn(
                "relative flex h-8 flex-col items-center justify-center rounded-lg text-xs font-medium",
                isToday && "ring-2 ring-rose-400/80 text-emerald-900",
                hasTasks && !isToday && "bg-emerald-50 text-emerald-800"
              )}
            >
              {day}
              {hasTasks && (
                <span className="absolute bottom-0.5 flex gap-px">
                  {Array.from({ length: Math.min(3, tasksByDay.get(day)!) }).map(
                    (_, j) => (
                      <span
                        key={j}
                        className="h-1 w-1 rounded-full bg-emerald-500"
                      />
                    )
                  )}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
