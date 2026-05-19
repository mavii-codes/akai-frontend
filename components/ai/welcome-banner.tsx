"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { PandaMascot } from "@/components/brand/panda-mascot";

export function AiWelcomeBanner() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl gradient-green p-6 text-white"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.12),transparent_60%)]" />
      <div className="relative flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="size-5" />
            <span className="text-sm font-medium text-emerald-50/90">
              AI Assistant ✨
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold">Hi Student! I&apos;m AkAI</h2>
          <p className="text-emerald-50/90 mt-2 text-sm md:text-base">
            Ask me questions, generate study materials, and boost your
            productivity.
          </p>
          <p className="text-xs text-emerald-100/70 mt-3">
            Your intelligent study companion. Ask anything!
          </p>
        </div>
        <div className="w-32 h-36 shrink-0">
          <PandaMascot className="w-full h-full" />
        </div>
      </div>
    </motion.section>
  );
}
