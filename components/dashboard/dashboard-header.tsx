"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Bell, Calendar, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type DashboardHeaderProps = {
  greeting?: string;
  subtitle?: string;
};

export function DashboardHeader({
  greeting = "Good morning, Student! 👋",
  subtitle = "Let's make today productive",
}: DashboardHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-30 glass border-b border-emerald-100/60 px-4 md:px-8 py-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-emerald-900">
            {greeting}
          </h1>
          <p className="text-sm text-emerald-600/70 mt-0.5">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl text-emerald-700 hover:bg-emerald-50"
            aria-label="Notifications"
          >
            <Bell className="size-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl text-emerald-700 hover:bg-emerald-50"
            aria-label="Calendar"
          >
            <Calendar className="size-5" />
          </Button>
          <Link href="/tasks">
            <Button className="rounded-xl gradient-green border-0 shadow-md shadow-emerald-200/40 gap-2">
              <Plus className="size-4" />
              New Task
            </Button>
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
