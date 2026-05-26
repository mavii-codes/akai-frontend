import { getDaysUntilDue } from "@/lib/task-utils";
import { getDaysLeft } from "@/store/deadlines-store";
import type { Deadline, Task } from "@/types";

export type AppNotification = {
  id: string;
  title: string;
  body: string;
  href?: string;
  urgent?: boolean;
};

export function buildAppNotifications(
  tasks: Task[],
  deadlines: Deadline[]
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
    const days = getDaysLeft(d.dueDateIso);
    if (days <= 14) {
      items.push({
        id: `deadline-${d.id}`,
        title: d.title,
        body:
          days === 0
            ? "Deadline is today"
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
