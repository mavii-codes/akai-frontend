"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

import { PandaMascot } from "@/components/brand/panda-mascot";
import { Button } from "@/components/ui/button";


export function AiSuggestion() {

  const pendingTasks: any = 0
  const nextDeadline: any = []

  const insight = nextDeadline
    ? `You have ${pendingTasks} task${pendingTasks === 1 ? "" : "s"} left and ${nextDeadline.title} due on ${new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
      }).format(new Date(nextDeadline.dueDate || new Date()))}.`
    : pendingTasks > 0
      ? `You have ${pendingTasks} task${pendingTasks === 1 ? "" : "s"} ready to work on. Add deadlines to prioritize your next milestone.`
      : "Your dashboard is ready for backend data. Add tasks or deadlines to generate more personalized guidance.";

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="relative overflow-hidden rounded-2xl border border-emerald-200/60 bg-gradient-to-br from-emerald-100/80 via-emerald-50 to-white p-5 md:p-6 green-glow"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-300/20 rounded-full blur-2xl" />

      <div className="relative flex flex-col sm:flex-row items-center gap-4">
        <div className="w-24 h-28 shrink-0">
          <PandaMascot
            className="w-full h-full"
            animated={false}
          />
        </div>

        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
            <Sparkles className="size-4 text-emerald-600" />

            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">
              AI Insight
            </span>
          </div>

          <p className="text-sm text-emerald-900 leading-relaxed">
            {insight}
          </p>

          <Link
            href="/ai-assistant"
            className="inline-block mt-4"
          >
            <Button className="rounded-xl gradient-green border-0 shadow-md">
              Ask AkAI Anything
            </Button>
          </Link>
        </div>
      </div>
    </motion.section>
  );
}