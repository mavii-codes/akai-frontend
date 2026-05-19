"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Calendar } from "lucide-react";
import { plannerBlocks } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { PlannerView } from "@/types";

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const monthDays = Array.from({ length: 28 }, (_, i) => i + 1);

const typeStyles = {
  class: "bg-emerald-600 text-white",
  study: "bg-emerald-100 text-emerald-800 border border-emerald-200",
  break: "bg-emerald-50 text-emerald-600 border border-emerald-100",
};

export function PlannerViews() {
  const [view, setView] = useState<PlannerView>("daily");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-emerald-900 flex items-center gap-2">
            Planner <span>📅</span>
          </h1>
          <p className="text-sm text-emerald-600/70 mt-1">
            Organize your academic schedule efficiently.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button className="rounded-xl gradient-green border-0 gap-2">
            <Plus className="size-4" />
            Add Schedule
          </Button>
          <Button
            variant={view === "weekly" ? "default" : "outline"}
            onClick={() => setView("weekly")}
            className={cn(
              "rounded-xl",
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
              "rounded-xl",
              view === "monthly"
                ? "gradient-green border-0"
                : "border-emerald-200 text-emerald-700"
            )}
          >
            Monthly View
          </Button>
        </div>
      </div>

      <Tabs value={view} onValueChange={(v) => setView(v as PlannerView)}>
        <TabsList className="bg-emerald-50/80 rounded-xl p-1">
          <TabsTrigger value="daily" className="rounded-lg data-[state=active]:bg-white">
            Daily
          </TabsTrigger>
          <TabsTrigger value="weekly" className="rounded-lg data-[state=active]:bg-white">
            Weekly
          </TabsTrigger>
          <TabsTrigger value="monthly" className="rounded-lg data-[state=active]:bg-white">
            Monthly
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          <TabsContent value="daily" className="mt-4">
            <motion.div
              key="daily"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="glass rounded-2xl p-5 border border-emerald-100/60 space-y-3"
            >
              {plannerBlocks.map((block, i) => (
                <motion.div
                  key={block.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4 rounded-xl border border-emerald-50 bg-white/70 p-4 hover:shadow-sm transition-all"
                >
                  <span className="w-20 text-sm font-semibold text-emerald-600 shrink-0">
                    {block.time}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-emerald-900">{block.title}</p>
                  </div>
                  <span
                    className={cn(
                      "text-xs px-3 py-1 rounded-full font-medium capitalize",
                      typeStyles[block.type]
                    )}
                  >
                    {block.type}
                  </span>
                  {block.type !== "break" && (
                    <span className="size-2 rounded-full bg-emerald-400 animate-pulse" title="Reminder" />
                  )}
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="weekly" className="mt-4">
            <motion.div
              key="weekly"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-4 border border-emerald-100/60 overflow-x-auto"
            >
              <div className="grid grid-cols-7 gap-2 min-w-[600px]">
                {weekDays.map((day) => (
                  <div key={day} className="text-center">
                    <p className="text-xs font-semibold text-emerald-600 mb-2">{day}</p>
                    <div className="space-y-2">
                      {day === "Mon" || day === "Wed" ? (
                        <div className="rounded-lg bg-emerald-100 p-2 text-[10px] text-emerald-800">
                          Math Review
                        </div>
                      ) : null}
                      {day === "Tue" || day === "Thu" ? (
                        <div className="rounded-lg bg-emerald-600 p-2 text-[10px] text-white">
                          Physics
                        </div>
                      ) : null}
                      {day === "Fri" ? (
                        <div className="rounded-lg bg-emerald-50 p-2 text-[10px] text-emerald-600 border border-emerald-100">
                          Lunch
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="monthly" className="mt-4">
            <motion.div
              key="monthly"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-5 border border-emerald-100/60"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-emerald-900 flex items-center gap-2">
                  <Calendar className="size-5 text-emerald-600" />
                  May 2026
                </h3>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs text-emerald-600 mb-2">
                {weekDays.map((d) => (
                  <span key={d} className="font-medium py-1">
                    {d}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {monthDays.map((day) => (
                  <button
                    key={day}
                    type="button"
                    className={cn(
                      "aspect-square rounded-lg text-sm flex flex-col items-center justify-center transition-all hover:bg-emerald-50",
                      day === 20 && "bg-emerald-600 text-white font-bold shadow-md",
                      [21, 22, 24, 29].includes(day) &&
                        day !== 20 &&
                        "ring-1 ring-emerald-300 bg-emerald-50"
                    )}
                  >
                    {day}
                    {[21, 22].includes(day) && (
                      <span className="size-1 rounded-full bg-emerald-500 mt-0.5" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </TabsContent>
        </AnimatePresence>
      </Tabs>
    </div>
  );
}
