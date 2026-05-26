"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function TasksAiBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-emerald-100 bg-gradient-to-r from-emerald-50/90 via-white to-teal-50/50 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <p className="text-sm text-emerald-800/90">
        <span className="font-medium text-emerald-900">
          Feeling overwhelmed?
        </span>{" "}
        Let AkAI prioritize your tasks for you.
      </p>
      <Button
        asChild
        className="shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow-md shadow-emerald-600/15"
      >
        <Link href="/ai-assistant">
          <Sparkles className="h-4 w-4" />
          Prioritize with AkAI
        </Link>
      </Button>
    </motion.div>
  );
}
