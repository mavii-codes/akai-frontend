"use client";

import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { NotificationsMenu } from "@/components/layout/notifications-menu";
import { useAuthUser } from "@/hooks/use-auth-user";

function getTimeGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function DashboardHeader() {
  const { email, displayName, fullName, ready, isLoggedIn } = useAuthUser();

  const upcomingEvents: Array<{ id: string; title: string; dueDate: string }> = [];
  const greeting = `${getTimeGreeting()}! 👋`;

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-30 glass border-b border-emerald-100/60 px-4 md:px-8 py-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-xl md:text-2xl font-bold text-emerald-900 truncate">
            {greeting}
          </h1>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <NotificationsMenu />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl text-emerald-700 hover:bg-emerald-50"
                aria-label="Calendar"
              >
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[260px]">
              <DropdownMenuLabel>Upcoming deadlines</DropdownMenuLabel>
              {upcomingEvents.length === 0 ? (
                <DropdownMenuItem className="px-3 py-2 text-sm text-emerald-700">
                  No deadlines yet. Add one from the dashboard to see it here.
                </DropdownMenuItem>
              ) : (
                upcomingEvents.map((deadline, index) => (
                  <div key={deadline.id}>
                    <DropdownMenuItem className="px-3 py-2 text-sm text-emerald-800">
                      {deadline.title} — {deadline.dueDate}
                    </DropdownMenuItem>
                    {index < upcomingEvents.length - 1 && <DropdownMenuSeparator />}
                  </div>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>

        </div>
      </div>
    </motion.header>
  );
}
