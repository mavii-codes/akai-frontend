"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CalendarDays,
  CalendarPlus,
  ListPlus,
<<<<<<< HEAD
  TrendingUp,
=======
  MessageCircle,
>>>>>>> 7df49d51b88c1ce928757f2d94ca5b3506f8db59
} from "lucide-react";
import { ProgressDialog } from "@/components/dashboard/progress-dialog";

const linkActions = [
  {
    label: "Generate Study Plan",
    shortLabel: "Study Plan",
    icon: CalendarPlus,
    href: "/planner",
    gradient: "from-emerald-500 to-emerald-600",
  },
  {
    label: "Add Task",
    shortLabel: "Add Task",
    icon: ListPlus,
    href: "/tasks",
    gradient: "from-emerald-400 to-emerald-500",
  },
  {
<<<<<<< HEAD
    label: "Planner",
    icon: CalendarDays,
    href: "/planner",
=======
    label: "Ask AI Assistant",
    shortLabel: "Ask AI",
    icon: MessageCircle,
    href: "/ai-assistant",
>>>>>>> 7df49d51b88c1ce928757f2d94ca5b3506f8db59
    gradient: "from-emerald-600 to-emerald-700",
  },
];

export function QuickActions() {
  const [progressOpen, setProgressOpen] = useState(false);

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="w-full min-w-0"
    >
<<<<<<< HEAD
      <h3 className="font-semibold text-emerald-900 mb-3">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {linkActions.map((action, i) => {
=======
      <h3 className="font-semibold text-emerald-900 mb-3 text-base sm:text-lg">
        Quick Actions
      </h3>
      <div className="grid grid-cols-1 min-[400px]:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
        {actions.map((action, i) => {
>>>>>>> 7df49d51b88c1ce928757f2d94ca5b3506f8db59
          const Icon = action.icon;
          return (
            <Link key={action.label} href={action.href} className="min-w-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 + i * 0.05 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
<<<<<<< HEAD
                className="glass rounded-xl p-4 border border-emerald-100/60 cursor-pointer group h-full"
=======
                className="glass rounded-xl p-3 sm:p-4 border border-emerald-100/60 cursor-pointer group h-full min-h-[72px] sm:min-h-[88px] touch-manipulation"
>>>>>>> 7df49d51b88c1ce928757f2d94ca5b3506f8db59
              >
                <div className="flex min-[400px]:flex-col items-center min-[400px]:items-start gap-3 min-[400px]:gap-0 w-full">
                  <div
                    className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${action.gradient} text-white shadow-md shrink-0 min-[400px]:mb-3 group-hover:shadow-lg transition-shadow`}
                  >
                    <Icon className="size-5" />
                  </div>
                  <p className="text-sm font-medium text-emerald-900 leading-snug text-center min-[400px]:text-left flex-1 min-[400px]:flex-none">
                    <span className="min-[400px]:hidden">{action.shortLabel}</span>
                    <span className="hidden min-[400px]:inline">{action.label}</span>
                  </p>
                </div>
              </motion.div>
            </Link>
          );
        })}

        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setProgressOpen(true)}
          className="glass rounded-xl p-4 border border-emerald-100/60 cursor-pointer group text-left h-full"
        >
          <div className="inline-flex p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-md mb-3 group-hover:shadow-lg transition-shadow">
            <TrendingUp className="size-5" />
          </div>
          <p className="text-sm font-medium text-emerald-900 leading-snug">
            View Progress
          </p>
        </motion.button>
      </div>

      <ProgressDialog open={progressOpen} onOpenChange={setProgressOpen} />
    </motion.section>
  );
}
