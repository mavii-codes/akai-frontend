"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import type { Planner } from "@/types";

type DeadlinesViewAllProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: Planner[];
};

export function DeadlinesViewAll({
  open,
  onOpenChange,
  data,
}: DeadlinesViewAllProps) {
  const deadlines = data;

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-md border-emerald-100 p-0 flex flex-col"
        >
          <SheetHeader className="px-4 sm:px-6 pt-6 pb-4 border-b border-emerald-100">
            <SheetTitle className="text-emerald-900 text-left">
              All Deadlines
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-3">
            {deadlines.length === 0 ? (
              <p className="text-sm text-emerald-600/60 text-center py-12">
                No deadlines yet. Add your first one below.
              </p>
            ) : (
              deadlines.map((item, index) => {
                const dueDate: any = new Date(item.dueDate);
                const today: any = new Date();

                const daysRemaining = Math.ceil(
                  (dueDate - today) / (1000 * 60 * 60 * 24)
                );
     
                const firstLetter = item.title[0];
                const dateLabel = new Date(item.dueDate).toLocaleDateString(
                  "en-US",
                  {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  }
                );
                return (
                  <div
                    key={index}
                    className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-white p-3 sm:p-4 min-w-0"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                     {firstLetter}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-emerald-900 truncate">
                        {item.title}
                      </p>
                      <p className="text-xs text-emerald-600/70 mt-0.5">
                        {dateLabel}
                      </p>
                      <Badge
                        variant="outline"
                        className="mt-2 border-emerald-200 text-emerald-700 bg-emerald-50 text-[10px]"
                      >
                        {item.dueDate} days left
                      </Badge>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
