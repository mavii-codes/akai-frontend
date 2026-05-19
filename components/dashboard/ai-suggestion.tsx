"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { PandaMascot } from "@/components/brand/panda-mascot";
import { Button } from "@/components/ui/button";

export function AiSuggestion() {
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
          <PandaMascot className="w-full h-full" animated={false} />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
            <Sparkles className="size-4 text-emerald-600" />
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">
              AI Insight
            </span>
          </div>
          <p className="text-sm text-emerald-900 leading-relaxed">
            You have a busy day ahead! Focus on your Math exam first since
            it&apos;s tomorrow.
          </p>
          <Link href="/ai-assistant" className="inline-block mt-4">
            <Button className="rounded-xl gradient-green border-0 shadow-md">
              Ask AkAI Anything
            </Button>
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
