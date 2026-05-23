"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calculator,
  Microscope,
  FileText,
  BookOpen,
  Plus,
  ChevronRight,
} from "lucide-react";
import {
  useDeadlines,
  getDaysLeft,
  formatDeadlineDate,
} from "@/store/deadlines-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeadlineFormDialog } from "@/components/dashboard/deadline-form-dialog";

const iconMap = {
  calculator: Calculator,
  microscope: Microscope,
  "file-text": FileText,
  book: BookOpen,
};

export function UpcomingDeadlines() {
  const { deadlines, addDeadline } = useDeadlines();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm border border-emerald-100/60"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
        <h3 className="font-semibold text-emerald-900 text-base sm:text-lg">
          Upcoming Deadlines
        </h3>
        <Button
          variant="ghost"
          size="sm"
          className="w-full sm:w-auto justify-center sm:justify-start text-emerald-600 hover:text-emerald-700 gap-1 h-9 rounded-xl"
        >
          View All <ChevronRight className="size-4 shrink-0" />
        </Button>
      </div>

      <div className="space-y-2 sm:space-y-3">
        {deadlines.length === 0 ? (
          <p className="text-sm text-emerald-600/60 text-center py-6">
            No deadlines yet. Add one below.
          </p>
        ) : (
          deadlines.map((item, i) => {
            const Icon =
              iconMap[item.icon as keyof typeof iconMap] ?? FileText;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 + i * 0.04 }}
                className="flex items-center gap-2 sm:gap-3 rounded-xl border border-emerald-50 bg-white/60 p-2.5 sm:p-3 hover:shadow-sm transition-all min-w-0"
              >
                <div className="flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                  <Icon className="size-4 sm:size-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-emerald-900 text-sm sm:text-base truncate">
                    {item.title}
                  </p>
                  <p className="text-[10px] sm:text-xs text-emerald-600/70 truncate">
                    {formatDeadlineDate(item.dueDateIso)}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="shrink-0 border-emerald-200 text-emerald-700 bg-emerald-50 text-[10px] sm:text-xs px-2"
                >
                  {getDaysLeft(item.dueDateIso)}d left
                </Badge>
              </motion.div>
            );
          })
        )}
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={() => setDialogOpen(true)}
        className="w-full mt-3 sm:mt-4 rounded-xl border-emerald-200 text-emerald-700 hover:bg-emerald-50 gap-2 min-h-[44px] h-11 sm:h-10 text-sm sm:text-base touch-manipulation"
      >
        <Plus className="size-4 shrink-0" />
        <span>Add Deadline</span>
      </Button>

      <DeadlineFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={addDeadline}
      />
    </motion.section>
  );
}
