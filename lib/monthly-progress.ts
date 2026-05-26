import type { Deadline, PlannerBlock, Task } from "@/types";

export type MonthlyProgressStats = {
  monthLabel: string;
  yearMonth: string;
  tasksTotal: number;
  tasksCompleted: number;
  tasksCreated: number;
  tasksDueThisMonth: number;
  completionRate: number;
  deadlinesDue: number;
  deadlinesAdded: number;
  plannerSessions: number;
  plannerByType: { class: number; study: number; break: number };
  weeklyActivity: { label: string; completed: number; added: number }[];
  priorityBreakdown: { low: number; medium: number; high: number };
};

function getYearMonth(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function isInYearMonth(isoDate: string, yearMonth: string) {
  return isoDate.startsWith(yearMonth);
}

function weekIndexInMonth(isoDate: string, yearMonth: string) {
  const [y, m] = yearMonth.split("-").map(Number);
  const day = new Date(isoDate + "T12:00:00").getDate();
  const firstDay = new Date(y, m - 1, 1).getDay();
  return Math.min(3, Math.floor((day + firstDay - 1) / 7));
}

export function computeMonthlyProgress(
  tasks: Task[],
  deadlines: Deadline[],
  plannerBlocks: PlannerBlock[],
  referenceDate = new Date()
): MonthlyProgressStats {
  const yearMonth = getYearMonth(referenceDate);
  const monthLabel = referenceDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const tasksInMonth = tasks.filter(
    (t) =>
      isInYearMonth(t.createdAt, yearMonth) ||
      isInYearMonth(t.dueDate, yearMonth)
  );
  const tasksCompleted = tasksInMonth.filter((t) => t.completed).length;
  const tasksCreated = tasks.filter((t) =>
    isInYearMonth(t.createdAt, yearMonth)
  ).length;
  const tasksDueThisMonth = tasks.filter((t) =>
    isInYearMonth(t.dueDate, yearMonth)
  ).length;
  const completionRate =
    tasksDueThisMonth > 0
      ? Math.round((tasksCompleted / tasksDueThisMonth) * 100)
      : tasksInMonth.length > 0
        ? Math.round((tasksCompleted / tasksInMonth.length) * 100)
        : 0;

  const deadlinesDue = deadlines.filter((d) =>
    isInYearMonth(d.dueDateIso, yearMonth)
  ).length;

  const weeklyActivity = ["Week 1", "Week 2", "Week 3", "Week 4"].map(
    (label, i) => ({
      label,
      completed: tasks.filter(
        (t) =>
          t.completed &&
          isInYearMonth(t.dueDate, yearMonth) &&
          weekIndexInMonth(t.dueDate, yearMonth) === i
      ).length,
      added: tasks.filter(
        (t) =>
          isInYearMonth(t.createdAt, yearMonth) &&
          weekIndexInMonth(t.createdAt, yearMonth) === i
      ).length,
    })
  );

  const priorityBreakdown = {
    low: tasksInMonth.filter((t) => t.priority === "low").length,
    medium: tasksInMonth.filter((t) => t.priority === "medium").length,
    high: tasksInMonth.filter((t) => t.priority === "high").length,
  };

  const plannerByType = {
    class: plannerBlocks.filter((b) => b.type === "class").length,
    study: plannerBlocks.filter((b) => b.type === "study").length,
    break: plannerBlocks.filter((b) => b.type === "break").length,
  };

  return {
    monthLabel,
    yearMonth,
    tasksTotal: tasksInMonth.length,
    tasksCompleted,
    tasksCreated,
    tasksDueThisMonth,
    completionRate,
    deadlinesDue,
    deadlinesAdded: deadlinesDue,
    plannerSessions: plannerBlocks.length,
    plannerByType,
    weeklyActivity,
    priorityBreakdown,
  };
}
