"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScheduleBlock } from "@/components/planner/schedule-block";
import { ScheduleFormDialog } from "@/components/planner/schedule-form-dialog";
import { usePlanner } from "@/store/planner-store";
import { sortByTime } from "@/lib/time-utils";
import { cn } from "@/lib/utils";
import type { DayOfWeek, PlannerBlock, PlannerView } from "@/types";

const weekDays: DayOfWeek[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const monthDays = Array.from({ length: 28 }, (_, i) => i + 1);

const typeStyles = {
  class: "bg-emerald-600 text-white",
  study: "bg-emerald-100 text-emerald-800",
  break: "bg-emerald-50 text-emerald-600 border border-emerald-100",
};

export function PlannerViews() {
  const { schedules, addSchedule, updateSchedule, deleteSchedule } = usePlanner();
  const [view, setView] = useState<PlannerView>("daily");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<PlannerBlock | null>(null);

  const dailySchedules = useMemo(() => sortByTime(schedules), [schedules]);

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
      map[s.dayOfWeek].push(s);
    });
    weekDays.forEach((d) => {
      map[d] = sortByTime(map[d]);
    });
    return map;
  }, [schedules]);

  const datesWithEvents = useMemo(() => {
    const set = new Set<number>();
    schedules.forEach((s) => {
      if (s.date) {
        const day = parseInt(s.date.split("-")[2], 10);
        if (!Number.isNaN(day)) set.add(day);
      }
    });
    return set;
  }, [schedules]);

  const openAddDialog = () => {
    setEditingSchedule(null);
    setDialogOpen(true);
  };

  return (
    <div className="w-full min-w-0 space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-4">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-emerald-900 flex items-center gap-2">
            Planner <span aria-hidden>📅</span>
          </h1>
          <p className="text-xs sm:text-sm text-emerald-600/70 mt-1">
            {schedules.length} schedule{schedules.length !== 1 ? "s" : ""} · Organize your academic week
          </p>
        </div>
        <div className="flex flex-col sm:flex-row flex-wrap gap-2 w-full">
          <Button
            onClick={openAddDialog}
            className="w-full sm:flex-1 md:w-auto rounded-xl gradient-green border-0 gap-2 min-h-10"
          >
            <Plus className="size-4 shrink-0" />
            <span className="truncate">Add Schedule</span>
          </Button>
          <Button
            variant={view === "weekly" ? "default" : "outline"}
            onClick={() => setView("weekly")}
            className={cn(
              "w-full sm:flex-1 md:w-auto rounded-xl min-h-10",
              view === "weekly"
                ? "gradient-green border-0"
                : "border-emerald-200 text-emerald-700"
            )}
          >
            Weekly View
          </Button>
          <Button
            variant={view === "monthly" ? "default" : "outline"}
            onClick={() => setView("monthly")}
            className={cn(
              "w-full sm:flex-1 md:w-auto rounded-xl min-h-10",
              view === "monthly"
                ? "gradient-green border-0"
                : "border-emerald-200 text-emerald-700"
            )}
          >
            Monthly View
          </Button>
        </div>
      </div>

      <Tabs value={view} onValueChange={(v) => setView(v as PlannerView)} className="w-full">
        <TabsList className="w-full grid grid-cols-3 bg-emerald-50/80 rounded-xl p-1 h-auto">
          <TabsTrigger value="daily" className="rounded-lg text-xs sm:text-sm py-2.5 data-[state=active]:bg-white">
            Daily
          </TabsTrigger>
          <TabsTrigger value="weekly" className="rounded-lg text-xs sm:text-sm py-2.5 data-[state=active]:bg-white">
            Weekly
          </TabsTrigger>
          <TabsTrigger value="monthly" className="rounded-lg text-xs sm:text-sm py-2.5 data-[state=active]:bg-white">
            Monthly
          </TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="mt-3 sm:mt-4 focus-visible:outline-none">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-3 sm:p-5 border border-emerald-100/60 space-y-2 sm:space-y-3"
          >
            {dailySchedules.length === 0 ? (
              <p className="text-center text-sm text-emerald-600/60 py-10">
                No schedules yet. Tap &quot;Add Schedule&quot; to create one.
              </p>
            ) : (
              <AnimatePresence mode="popLayout">
                {dailySchedules.map((block, i) => (
                  <ScheduleBlock
                    key={block.id}
                    block={block}
                    index={i}
                    onDelete={() => deleteSchedule(block.id)}
                  />
                ))}
              </AnimatePresence>
            )}
          </motion.div>
        </TabsContent>

        <TabsContent value="weekly" className="mt-3 sm:mt-4 focus-visible:outline-none">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-3 sm:p-4 border border-emerald-100/60"
          >
            <div className="flex flex-col gap-3 md:hidden">
              {weekDays.map((day) => {
                const dayItems = schedulesByDay[day];
                return (
                  <div
                    key={day}
                    className="rounded-xl border border-emerald-100 bg-white/80 p-3"
                  >
                    <p className="text-sm font-semibold text-emerald-700 mb-2">{day}</p>
                    <div className="flex flex-wrap gap-2">
                      {dayItems.length === 0 ? (
                        <span className="text-xs text-emerald-500/60">No events</span>
                      ) : (
                        dayItems.map((item) => (
                          <span
                            key={item.id}
                            className={cn(
                              "rounded-lg px-2.5 py-1.5 text-xs",
                              typeStyles[item.type]
                            )}
                          >
                            {item.time} — {item.title}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="hidden md:grid md:grid-cols-7 gap-2">
              {weekDays.map((day) => {
                const dayItems = schedulesByDay[day];
                return (
                  <div key={day} className="text-center min-w-0">
                    <p className="text-xs font-semibold text-emerald-600 mb-2">{day}</p>
                    <div className="space-y-2">
                      {dayItems.length === 0 ? (
                        <p className="text-[10px] text-emerald-400/60 py-2">—</p>
                      ) : (
                        dayItems.map((item) => (
                          <div
                            key={item.id}
                            className={cn(
                              "rounded-lg p-2 text-[10px] text-left",
                              typeStyles[item.type]
                            )}
                          >
                            <span className="block font-medium opacity-80">{item.time}</span>
                            {item.title}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="monthly" className="mt-3 sm:mt-4 focus-visible:outline-none">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-3 sm:p-5 border border-emerald-100/60 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="font-semibold text-emerald-900 flex items-center gap-2 text-sm sm:text-base">
                <Calendar className="size-4 sm:size-5 text-emerald-600 shrink-0" />
                May 2026
              </h3>
            </div>
            <div className="grid grid-cols-7 gap-0.5 sm:gap-1 text-center text-[10px] sm:text-xs text-emerald-600 mb-1 sm:mb-2">
              {weekDays.map((d) => (
                <span key={d} className="font-medium py-1 truncate">
                  <span className="hidden sm:inline">{d}</span>
                  <span className="sm:hidden">{d.charAt(0)}</span>
                </span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
              {monthDays.map((day) => (
                <button
                  key={day}
                  type="button"
                  className={cn(
                    "aspect-square min-h-[36px] sm:min-h-0 rounded-md sm:rounded-lg text-[11px] sm:text-sm flex flex-col items-center justify-center transition-all hover:bg-emerald-50 touch-manipulation",
                    day === 20 && "bg-emerald-600 text-white font-bold shadow-md",
                    datesWithEvents.has(day) &&
                      day !== 20 &&
                      "ring-1 ring-emerald-300 bg-emerald-50"
                  )}
                >
                  {day}
                  {datesWithEvents.has(day) && (
                    <span className="size-1 rounded-full bg-emerald-500 mt-0.5" />
                  )}
                </button>
              ))}
            </div>
            {datesWithEvents.size > 0 && (
              <p className="text-xs text-emerald-600/70 mt-4 text-center">
                Dots mark days with scheduled events (set a date when adding).
              </p>
            )}
          </motion.div>
        </TabsContent>
      </Tabs>

      <ScheduleFormDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingSchedule(null);
        }}
        schedule={editingSchedule}
        onSave={(data) => {
          if (editingSchedule) {
            updateSchedule(editingSchedule.id, data);
          } else {
            addSchedule(data);
          }
        }}
      />
    </div>
  );
}
