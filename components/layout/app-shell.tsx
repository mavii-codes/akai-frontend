"use client";

import { motion } from "framer-motion";
import { Sidebar } from "./sidebar";
import { MobileNav } from "./mobile-nav";
import { TasksProvider } from "@/store/tasks-store";
import { PlannerProvider } from "@/store/planner-store";
import { DeadlinesProvider } from "@/store/deadlines-store";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <TasksProvider>
      <PlannerProvider>
        <DeadlinesProvider>
          <div className="min-h-screen bg-gradient-to-br from-emerald-50/50 via-white to-emerald-50/30">
            <Sidebar />
            <motion.main
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="md:ml-64 min-h-screen pb-20 sm:pb-24 md:pb-8 overflow-x-hidden"
            >
              {children}
            </motion.main>
            <MobileNav />
          </div>
        </DeadlinesProvider>
      </PlannerProvider>
    </TasksProvider>
  );
}
