"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useDeadlines } from "@/store/deadlines-store";
import { usePlanner } from "@/store/planner-store";
import { useTasks } from "@/store/tasks-store";
import { computeMonthlyProgress } from "@/lib/monthly-progress";
import {
  CalendarDays,
  CheckCircle2,
  ListTodo,
  Target,
  type LucideIcon,
} from "lucide-react";

type ProgressDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ProgressDialog({ open, onOpenChange }: ProgressDialogProps) {
  const { tasks } = useTasks();
  const { deadlines } = useDeadlines();
  const { schedules } = usePlanner();
  const stats = computeMonthlyProgress(tasks, deadlines, schedules);

  const maxWeekly = Math.max(
    1,
    ...stats.weeklyActivity.map((w) => Math.max(w.completed, w.added))
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl border-emerald-100 w-[min(100vw-1.5rem,32rem)] max-w-lg max-h-[min(90vh,40rem)] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-emerald-900 text-lg flex items-center gap-2">
            <Target className="size-5 text-emerald-600" />
            Monthly Progress — {stats.monthLabel}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div className="rounded-xl bg-emerald-50/80 border border-emerald-100 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-emerald-800">
                Task completion
              </span>
              <span className="text-2xl font-bold text-emerald-700">
                {stats.completionRate}%
              </span>
            </div>
            <Progress value={stats.completionRate} className="h-2" />
            <p className="text-xs text-emerald-600/70 mt-2">
              {stats.tasksCompleted} of {stats.tasksDueThisMonth || stats.tasksTotal}{" "}
              tasks completed this month
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <StatCard
              icon={ListTodo}
              label="Active this month"
              value={String(stats.tasksTotal)}
            />
            <StatCard
              icon={CheckCircle2}
              label="Completed"
              value={String(stats.tasksCompleted)}
            />
            <StatCard
              icon={CalendarDays}
              label="Deadlines due"
              value={String(stats.deadlinesDue)}
            />
            <StatCard
              icon={CalendarDays}
              label="Planner blocks"
              value={String(stats.plannerSessions)}
            />
          </div>

          <div>
            <h4 className="text-sm font-semibold text-emerald-900 mb-2">
              Weekly activity
            </h4>
            <div className="space-y-2">
              {stats.weeklyActivity.map((week) => (
                <div key={week.label} className="flex items-center gap-3">
                  <span className="text-xs text-emerald-700 w-14 shrink-0">
                    {week.label}
                  </span>
                  <div className="flex-1 flex gap-1 h-6 items-end">
                    <div
                      className="flex-1 rounded-md bg-emerald-200/80 min-h-[4px]"
                      style={{
                        height: `${Math.max(8, (week.completed / maxWeekly) * 24)}px`,
                      }}
                      title={`${week.completed} completed`}
                    />
                    <div
                      className="flex-1 rounded-md bg-emerald-500/70 min-h-[4px]"
                      style={{
                        height: `${Math.max(8, (week.added / maxWeekly) * 24)}px`,
                      }}
                      title={`${week.added} added`}
                    />
                  </div>
                  <span className="text-[10px] text-emerald-600/80 w-16 text-right">
                    {week.completed}c · {week.added}a
                  </span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-emerald-500/70 mt-1">
              c = completed · a = added
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-emerald-900 mb-2">
              Task priority (this month)
            </h4>
            <div className="flex gap-2 flex-wrap">
              <PriorityPill label="High" count={stats.priorityBreakdown.high} />
              <PriorityPill
                label="Medium"
                count={stats.priorityBreakdown.medium}
              />
              <PriorityPill label="Low" count={stats.priorityBreakdown.low} />
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-emerald-900 mb-2">
              Planner breakdown
            </h4>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <PlannerPill label="Class" count={stats.plannerByType.class} />
              <PlannerPill label="Study" count={stats.plannerByType.study} />
              <PlannerPill label="Break" count={stats.plannerByType.break} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-emerald-100 bg-white/70 p-3">
      <Icon className="size-4 text-emerald-600 mb-1" />
      <p className="text-xl font-bold text-emerald-900">{value}</p>
      <p className="text-[10px] text-emerald-600/70">{label}</p>
    </div>
  );
}

function PriorityPill({ label, count }: { label: string; count: number }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-800">
      {label}: {count}
    </span>
  );
}

function PlannerPill({ label, count }: { label: string; count: number }) {
  return (
    <div className="rounded-lg bg-emerald-50 border border-emerald-100 py-2">
      <p className="font-semibold text-emerald-800">{count}</p>
      <p className="text-emerald-600/70">{label}</p>
    </div>
  );
}
