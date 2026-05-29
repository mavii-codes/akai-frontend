"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getTodayDayOfWeek,
  parseTimeToMinutes,
  sortByTime,
} from "@/lib/time-utils";
import { cn } from "@/lib/utils";
import type { DayOfWeek, PlannerBlock, ScheduleStatus } from "@/types";

const statusConfig: Record<
  ScheduleStatus,
  { label: string; className: string }
> = {
  "in-progress": {
    label: "In Progress",
    className: "bg-emerald-600 text-white border-0",
  },
  upcoming: {
    label: "Upcoming",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  break: {
    label: "Break",
    className: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
};

function getScheduleStatus(
  block: PlannerBlock,
  index: number,
  sorted: PlannerBlock[],
  nowMinutes: number
): ScheduleStatus {
  if (block.type === "break") return "break";
  const start = parseTimeToMinutes(block.time);
  const next = sorted[index + 1];
  const end = next ? parseTimeToMinutes(next.time) : start + 60;
  if (nowMinutes >= start && nowMinutes < end) return "in-progress";
  return "upcoming";
}

function typeDescription(type: PlannerBlock["type"]) {
  switch (type) {
    case "class":
      return "Class session";
    case "study":
      return "Study block";
    case "break":
      return "Take a break and relax";
  }
}

export function TodaysPlan() {
  const schedules: PlannerBlock[] = [];

  const todayItems = useMemo(() => {
    const todayDay = getTodayDayOfWeek() as DayOfWeek;
    const todayIso = new Date().toISOString().split("T")[0];
    const filtered = schedules.filter(
      (s) => s.dayOfWeek === todayDay || s.date === todayIso
    );
    return sortByTime(filtered);
  }, [schedules]);

  const nowMinutes = useMemo(() => {
    const n = new Date();
    return n.getHours() * 60 + n.getMinutes();
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="glass rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm border border-emerald-100/60"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 sm:mb-5">
        <div className="flex items-center gap-2">
          <Clock className="size-5 text-emerald-600 shrink-0" />
          <h3 className="font-semibold text-emerald-900">Today&apos;s Plan</h3>
        </div>
        <Link href="/planner" className="shrink-0 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            className="w-full sm:w-auto rounded-xl border-emerald-200 text-emerald-700 h-9 text-xs sm:text-sm"
          >
            <Plus className="size-3.5 sm:size-4 mr-1" />
            Add to Planner
          </Button>
        </Link>
      </div>

      {todayItems.length === 0 ? (
        <div className="text-center py-8 px-2">
          <p className="text-sm text-emerald-600/70">
            No plans for today yet. Add a schedule in the Planner.
          </p>
          <Link href="/planner">
            <Button className="mt-4 rounded-xl gradient-green border-0">
              Go to Planner
            </Button>
          </Link>
        </div>
      ) : (
        <div className="relative space-y-0">
          <div className="absolute left-[3.5rem] sm:left-[4.25rem] top-2 bottom-2 w-px bg-emerald-200" />
          {todayItems.map((item, i) => {
            const status = getScheduleStatus(item, i, todayItems, nowMinutes);
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 + i * 0.04 }}
                className="relative flex gap-2 sm:gap-4 py-2.5 sm:py-3 group"
              >
                <span className="w-14 sm:w-16 shrink-0 text-[10px] sm:text-xs font-medium text-emerald-600 pt-1">
                  {item.time}
                </span>
                <div
                  className={cn(
                    "relative z-10 size-2.5 sm:size-3 rounded-full mt-1.5 shrink-0 ring-4 ring-white",
                    status === "in-progress"
                      ? "bg-emerald-500"
                      : status === "break"
                        ? "bg-emerald-300"
                        : "bg-emerald-200"
                  )}
                />
                <div className="flex-1 min-w-0 rounded-xl bg-white/60 border border-emerald-50 p-2.5 sm:p-3 group-hover:shadow-md group-hover:border-emerald-100 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-medium text-emerald-900 text-sm sm:text-base truncate">
                        {item.title}
                      </p>
                      <p className="text-xs text-emerald-600/70 mt-0.5 capitalize">
                        {typeDescription(item.type)}
                      </p>
                    </div>
                    <Badge
                      className={cn(
                        "shrink-0 text-[10px] w-fit",
                        statusConfig[status].className
                      )}
                    >
                      {statusConfig[status].label}
                    </Badge>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.section>
  );
}
