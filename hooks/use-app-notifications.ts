"use client";

import { useMemo } from "react";
import { buildAppNotifications } from "@/lib/notifications";
import { useTasks } from "@/store/tasks-store";
import { useDeadlines } from "@/store/deadlines-store";

export function useAppNotifications() {
  const { tasks } = useTasks();
  const { deadlines } = useDeadlines();

  const items = useMemo(
    () => buildAppNotifications(tasks, deadlines),
    [tasks, deadlines]
  );

  return {
    items,
    count: items.length,
    urgentCount: items.filter((i) => i.urgent).length,
  };
}
