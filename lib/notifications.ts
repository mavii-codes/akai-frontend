import { getDaysUntilDue } from "@/lib/task-utils";
import type { Planner, Task } from "@/types";

function getDaysLeft(dueDate: string): number {
  const due = new Date(dueDate + "T23:59:59");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export type AppNotification = {
  id: string;
  title: string;
  body: string;
  href?: string;
  urgent?: boolean;
};

export function buildAppNotifications(
  tasks: Task[],
  deadlines: Planner[]
): AppNotification[] {
  const items: AppNotification[] = [];

  tasks
    .filter((t) => t.status !== "completed")
    .forEach((t) => {
      const days = getDaysUntilDue(t.dueDate);
      if (days <= 7) {
        items.push({
          id: `task-${t.id}`,
          title: t.title,
          body:
            days < 0
              ? "Overdue — complete this task"
              : days === 0
                ? "Due today"
                : `Due in ${days} day${days === 1 ? "" : "s"}`,
          href: "/tasks",
          urgent: days <= 2,
        });
      }
    });

  deadlines.forEach((d) => {
    const days = getDaysLeft(d.dueDate);
    if (days <= 14) {
      items.push({
        id: `deadline-${d.id}`,
        title: d.title,
        body:
          days === 0
            ? "Planner is today"
            : `Due in ${days} day${days === 1 ? "" : "s"}`,
        href: "/planner",
        urgent: days <= 2,
      });
    }
  });

  items.sort((a, b) => {
    if (a.urgent && !b.urgent) return -1;
    if (!a.urgent && b.urgent) return 1;
    return 0;
  });

  return items.slice(0, 8);
}
