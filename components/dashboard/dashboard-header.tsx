"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Bell, Calendar, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAuthUser } from "@/hooks/use-auth-user";
import { getEmailUsername } from "@/lib/auth-session";

function getTimeGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function DashboardHeader() {
  const { email, displayName, ready } = useAuthUser();

  const name = ready && email ? getEmailUsername(email) : displayName;
  const greeting = `${getTimeGreeting()}, ${name}! 👋`;

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
          <p className="text-sm text-emerald-600/70 mt-0.5 truncate">
            {email
              ? `Signed in as ${email}`
              : "Let's make today productive and amazing."}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl text-emerald-700 hover:bg-emerald-50"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[260px]">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuItem className="px-3 py-2 text-sm text-emerald-800">
                You have 2 new reminders for today.
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="px-3 py-2 text-sm text-emerald-800">
                Study session starts at 11:00 AM.
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="px-3 py-2 text-sm text-emerald-800">
                Project deadline due tomorrow.
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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
              <DropdownMenuLabel>Upcoming events</DropdownMenuLabel>
              <DropdownMenuItem className="px-3 py-2 text-sm text-emerald-800">
                Math exam on May 22 at 09:00 AM.
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="px-3 py-2 text-sm text-emerald-800">
                Biology quiz on May 24.
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="px-3 py-2 text-sm text-emerald-800">
                Research paper due May 29.
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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
