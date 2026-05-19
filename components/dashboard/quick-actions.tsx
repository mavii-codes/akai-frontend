"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  CalendarPlus,
  ListPlus,
  MessageCircle,
  TrendingUp,
} from "lucide-react";

const actions = [
  {
    label: "Generate Study Plan",
    icon: CalendarPlus,
    href: "/planner",
    gradient: "from-emerald-500 to-emerald-600",
  },
  {
    label: "Add Task",
    icon: ListPlus,
    href: "/tasks",
    gradient: "from-emerald-400 to-emerald-500",
  },
  {
    label: "Ask AI Assistant",
    icon: MessageCircle,
    href: "/ai-assistant",
    gradient: "from-emerald-600 to-emerald-700",
  },
  {
    label: "View Progress",
    icon: TrendingUp,
    href: "/home",
    gradient: "from-emerald-500 to-teal-500",
  },
];

export function QuickActions() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h3 className="font-semibold text-emerald-900 mb-3">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, i) => {
          const Icon = action.icon;
          return (
            <Link key={action.label} href={action.href}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 + i * 0.05 }}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="glass rounded-xl p-4 border border-emerald-100/60 cursor-pointer group"
              >
                <div
                  className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${action.gradient} text-white shadow-md mb-3 group-hover:shadow-lg transition-shadow`}
                >
                  <Icon className="size-5" />
                </div>
                <p className="text-sm font-medium text-emerald-900 leading-snug">
                  {action.label}
                </p>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </motion.section>
  );
}
