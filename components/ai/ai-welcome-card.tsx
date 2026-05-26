"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { PandaMascot } from "@/components/brand/panda-mascot";
import { useAuthUser } from "@/hooks/use-auth-user";

export function AiWelcomeCard() {
  const { displayName, ready } = useAuthUser();
  const name = ready ? displayName : "Student";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-emerald-100/80 bg-gradient-to-br from-emerald-50/95 via-white to-teal-50/40 p-5 sm:p-6 mb-6"
    >
      <div className="flex flex-col sm:flex-row items-center gap-5">
        <div className="flex-1 min-w-0 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 text-emerald-600 text-xs font-medium mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            AkAI Study Companion
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-emerald-900">
            Hi {name}! I&apos;m AkAI
          </h2>
          <p className="text-sm text-emerald-700/80 mt-2 leading-relaxed">
            I can explain concepts, solve problems step-by-step, summarize your
            notes, generate quizzes, and help you plan your study sessions.
          </p>
        </div>
        <div className="w-24 h-28 sm:w-28 sm:h-32 shrink-0">
          <PandaMascot className="w-full h-full" animated />
        </div>
      </div>
    </motion.div>
  );
}
