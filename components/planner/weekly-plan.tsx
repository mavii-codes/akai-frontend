"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, ChevronDown, List } from "lucide-react";
import { sortByTime } from "@/lib/time-utils";
import {
  DAY_BORDER_COLORS,
  formatDuration,
  getWeekDates,
} from "@/lib/planner-utils";
import { cn } from "@/lib/utils";
import type { DayOfWeek, PlannerBlock } from "@/types";
import axiosInstance from "@/lib/axios";
import { useEffect } from "react";

type WeeklyPlanProps = {
  dailyStudyHours?: number;
  schedules?: PlannerBlock[];
};

export function WeeklyPlan({ dailyStudyHours = 6, schedules = [] }: WeeklyPlanProps) {

  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [expanded, setExpanded] = useState<Record<DayOfWeek, boolean>>({
    Mon: true,
    Tue: false,
    Wed: false,
    Thu: false,
    Fri: false,
    Sat: false,
    Sun: false,
  });

  useEffect(() => {
      const getInitialState = async () => {
        try {
          const response = await axiosInstance.get("/api/deadlines/v1/get");

        } catch (error) {
          console.error("Error loading deadlines:", error);
        }
      };
  
      getInitialState();
    }, []);

  const weekDates = useMemo(() => getWeekDates(), []);

  const schedulesByDay = useMemo(() => {
    const map: Record<DayOfWeek, PlannerBlock[]> = {
      Mon: [],
      Tue: [],
      Wed: [],
      Thu: [],
      Fri: [],
      Sat: [],
      Sun: [],
    };
    schedules.forEach((s) => {
      map[s.dayOfWeek]?.push(s);
    });
    (Object.keys(map) as DayOfWeek[]).forEach((d) => {
      map[d] = sortByTime(map[d]);
    });
    return map;
  }, [schedules]);

  const toggleDay = (day: DayOfWeek) => {
    setExpanded((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 }}
      className="glass rounded-2xl border border-emerald-100/60 shadow-sm flex flex-col min-h-[420px]"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5 border-b border-emerald-50">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-emerald-600" />
          <h2 className="font-semibold text-emerald-900 text-base sm:text-lg">
            Your Weekly Plan
          </h2>
        </div>
        <div className="flex items-center gap-2 text-sm text-emerald-700/80">
          <span className="hidden sm:inline">View as</span>
          <div className="flex rounded-lg border border-emerald-100 bg-white/70 p-0.5">
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                viewMode === "list"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-emerald-700 hover:bg-emerald-50"
              )}
            >
              <List className="h-3.5 w-3.5" />
              List
            </button>
            <button
              type="button"
              onClick={() => setViewMode("calendar")}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                viewMode === "calendar"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-emerald-700 hover:bg-emerald-50"
              )}
            >
              <CalendarDays className="h-3.5 w-3.5" />
              Calendar
            </button>
          </div>
        </div>
      </div>

      {viewMode === "list" ? (
        <div className="flex-1 divide-y divide-emerald-50/80 overflow-y-auto">
          {weekDates.map(({ weekday, label }) => {
            const items = schedulesByDay[weekday];
            const isOpen = expanded[weekday];
            const duration =
              items.length > 0
                ? formatDuration(
                    Math.min(dailyStudyHours, items.length * 1.5)
                  )
                : formatDuration(0);

            return (
              <div
                key={weekday}
                className={cn(
                  "border-l-4 bg-white/40",
                  DAY_BORDER_COLORS[weekday]
                )}
              >
                <button
                  type="button"
                  onClick={() => toggleDay(weekday)}
                  className="w-full flex items-start justify-between gap-3 p-4 sm:p-5 text-left hover:bg-emerald-50/30 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-emerald-900 text-sm sm:text-base">
                      {label}
                    </p>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.ul
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-2 space-y-1 overflow-hidden"
                        >
                          {items.length === 0 ? (
                            <li className="text-sm text-emerald-600/50 italic">
                              No sessions yet. Generate a plan or add blocks from your data.
                            </li>
                          ) : (
                            items.map((item) => (
                              <li
                                key={item.id}
                                className="text-sm text-emerald-800/90 flex gap-2"
                              >
                                <span className="text-emerald-500">•</span>
                                <span>
                                  {item.title}
                                  <span className="text-emerald-500/60 ml-1.5 text-xs">
                                    {item.time}
                                    <span className="text-emerald-500/60 ml-1.5 text-xs">
                                    {item.type}
                                  </span>
                                  </span>
                                </span>
                              </li>
                            ))
                          )}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                    {!isOpen && items.length > 0 && (
                      <p className="text-xs text-emerald-600/60 mt-1">
                        {items.length} session{items.length !== 1 ? "s" : ""}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0 text-sm font-medium text-emerald-700">
                    {duration}
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        isOpen && "rotate-180"
                      )}
                    />
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex-1 p-4 sm:p-5">
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {weekDates.map(({ weekday, date }) => {
              const items = schedulesByDay[weekday];
              const dayNum = date.getDate();
              return (
                <div
                  key={weekday}
                  className={cn(
                    "rounded-xl border border-emerald-50 bg-white/60 p-2 min-h-[88px] flex flex-col",
                    items.length > 0 && "ring-1 ring-emerald-200/60"
                  )}
                >
                  <p className="text-[10px] sm:text-xs font-medium text-emerald-600">
                    {weekday}
                  </p>
                  <p className="text-sm font-semibold text-emerald-900">
                    {dayNum}
                  </p>
                  <div className="mt-auto flex flex-wrap gap-0.5">
                    {items.slice(0, 4).map((item) => (
                      <span
                        key={item.id}
                        className="h-1.5 w-1.5 rounded-full bg-emerald-500"
                        title={item.title}
                      />
                    ))}
                    {items.length > 4 && (
                      <span className="text-[9px] text-emerald-600">
                        +{items.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-emerald-600/60 mt-3 text-center sr-only sm:not-sr-only">
            Week of {weekDates[0]?.label.split(", ").slice(1).join(", ")}
          </p>
        </div>
      )}

      <div className="m-4 sm:m-5 mt-0 rounded-xl bg-emerald-50/80 border border-emerald-100/60 px-4 py-3 text-sm text-emerald-800/90">
        Tip: Take regular breaks and stay consistent. Small steps lead to big
        results! 🚀
      </div>
    </motion.section>
  );
}
