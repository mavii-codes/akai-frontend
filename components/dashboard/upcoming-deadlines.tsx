"use client";

import { motion } from "framer-motion";
import {
  Calculator,
  Microscope,
  FileText,
  Plus,
  ChevronRight,
} from "lucide-react";
import { upcomingDeadlines } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const iconMap = {
  calculator: Calculator,
  microscope: Microscope,
  "file-text": FileText,
};

export function UpcomingDeadlines() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass rounded-2xl p-5 md:p-6 shadow-sm border border-emerald-100/60"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-emerald-900">Upcoming Deadlines</h3>
        <Button
          variant="ghost"
          size="sm"
          className="text-emerald-600 hover:text-emerald-700 gap-1"
        >
          View All <ChevronRight className="size-4" />
        </Button>
      </div>
      <div className="space-y-3">
        {upcomingDeadlines.map((item, i) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap] ?? FileText;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              whileHover={{ x: 4 }}
              className="flex items-center gap-3 rounded-xl border border-emerald-50 bg-white/60 p-3 hover:shadow-sm transition-all"
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                <Icon className="size-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-emerald-900 truncate">
                  {item.title}
                </p>
                <p className="text-xs text-emerald-600/70">{item.dueDate}</p>
              </div>
              <Badge
                variant="outline"
                className="shrink-0 border-emerald-200 text-emerald-700 bg-emerald-50"
              >
                {item.daysLeft}d left
              </Badge>
            </motion.div>
          );
        })}
      </div>
      <Button
        variant="outline"
        className="w-full mt-4 rounded-xl border-emerald-200 text-emerald-700 hover:bg-emerald-50 gap-2"
      >
        <Plus className="size-4" />
        Add Deadline
      </Button>
    </motion.section>
  );
}
