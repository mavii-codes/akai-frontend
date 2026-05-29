"use client";

import { useMemo } from "react";
import { buildAppNotifications } from "@/lib/notifications";

export function useAppNotifications() {
  const tasks: [] = [];
  const deadlines: [] = [];

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
