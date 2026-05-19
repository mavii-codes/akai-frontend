"use client";

import { motion } from "framer-motion";
import { BookOpen, Sparkles, Target } from "lucide-react";
import { PandaMascot } from "@/components/brand/panda-mascot";

export function HeroBanner() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      whileHover={{ scale: 1.005 }}
      className="relative overflow-hidden rounded-3xl gradient-green p-6 md:p-8 text-white shadow-xl shadow-emerald-200/40"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_50%)]" />
      <div className="relative flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-xl md:text-2xl font-bold leading-tight">
            AkAI is here to support your study journey.
          </h2>
          <p className="text-emerald-50/90 mt-2 text-sm md:text-base max-w-md">
            Stay organized, get reminders, and achieve your goals one step at a
            time.
          </p>
        </div>
        <div className="relative w-36 h-40 md:w-44 md:h-48 shrink-0">
          <PandaMascot className="w-full h-full" />
          <motion.div
            animate={{ y: [0, -6, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute -top-2 -right-2 p-2 rounded-full bg-white/20 backdrop-blur"
          >
            <Sparkles className="size-4" />
          </motion.div>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
            className="absolute bottom-4 -left-4 p-2 rounded-full bg-white/20 backdrop-blur"
          >
            <BookOpen className="size-4" />
          </motion.div>
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
            className="absolute top-1/2 -right-6 p-2 rounded-full bg-white/20 backdrop-blur"
          >
            <Target className="size-4" />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
