"use client";

import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { todaysSchedule } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ScheduleStatus } from "@/types";

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

export function TodaysPlan() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="glass rounded-2xl p-5 md:p-6 shadow-sm border border-emerald-100/60"
    >
      <div className="flex items-center gap-2 mb-5">
        <Clock className="size-5 text-emerald-600" />
        <h3 className="font-semibold text-emerald-900">Today&apos;s Plan</h3>
      </div>
      <div className="relative space-y-0">
        <div className="absolute left-[4.25rem] top-2 bottom-2 w-px bg-emerald-200" />
        {todaysSchedule.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="relative flex gap-4 py-3 group"
          >
            <span className="w-16 shrink-0 text-xs font-medium text-emerald-600 pt-1">
              {item.time}
            </span>
            <div
              className={cn(
                "relative z-10 size-3 rounded-full mt-1.5 shrink-0 ring-4 ring-white",
                item.status === "in-progress"
                  ? "bg-emerald-500"
                  : item.status === "break"
                    ? "bg-emerald-300"
                    : "bg-emerald-200"
              )}
            />
            <div className="flex-1 rounded-xl bg-white/60 border border-emerald-50 p-3 group-hover:shadow-md group-hover:border-emerald-100 transition-all">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-emerald-900">{item.title}</p>
                  <p className="text-xs text-emerald-600/70 mt-0.5">
                    {item.description}
                  </p>
                </div>
                <Badge
                  className={cn(
                    "shrink-0 text-[10px]",
                    statusConfig[item.status].className
                  )}
                >
                  {statusConfig[item.status].label}
                </Badge>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
