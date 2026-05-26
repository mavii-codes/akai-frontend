"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationsMenu } from "@/components/layout/notifications-menu";
import { PageHeaderActions } from "@/components/layout/page-header-actions";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { CreateStudyPlan } from "@/components/planner/create-study-plan";
import { WeeklyPlan } from "@/components/planner/weekly-plan";
import { SubjectsPanel } from "@/components/planner/subjects-panel";
import { PlannerDeadlines } from "@/components/planner/planner-deadlines";
import { useSubjects } from "@/store/subjects-store";

export function PlannerViews() {
  const { totalDailyHours } = useSubjects();
  const [dailyHours, setDailyHours] = useState(6);

  return (
    <div className="space-y-6 w-full min-w-0">
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-emerald-900">
            Planner
          </h1>
          <p className="text-emerald-700/70 mt-1 text-sm sm:text-base">
            Plan your study schedule and stay on track.
          </p>
        </div>
        <PageHeaderActions>
          <div className="flex items-center justify-end gap-2 w-full sm:w-auto">
            <NotificationsMenu align="end" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl border-emerald-100 bg-white/80 text-emerald-700 hover:bg-emerald-50 shrink-0"
                  aria-label="Calendar"
                >
                  <Calendar className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-[min(calc(100vw-2rem),18rem)] rounded-xl border-emerald-100"
              >
                <DropdownMenuLabel>This week</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-emerald-50" />
                <DropdownMenuItem className="text-sm text-emerald-800">
                  View your weekly plan below
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/planner" className="text-sm cursor-pointer">
                    Open Planner
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </PageHeaderActions>
      </motion.header>

      <CreateStudyPlan onGenerated={() => setDailyHours(totalDailyHours || 6)} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 min-w-0">
          <WeeklyPlan dailyStudyHours={totalDailyHours || dailyHours} />
        </div>
        <div className="space-y-6 min-w-0">
          <SubjectsPanel />
          <PlannerDeadlines />
        </div>
      </div>
    </div>
  );
}
