"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";

export function StudyStreak() {
  const streak = 7;
  const maxDays = 10;
  const progress = (streak / maxDays) * 100;
  const circumference = 2 * Math.PI * 52;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="glass rounded-2xl p-5 md:p-6 shadow-sm border border-emerald-100/60 flex flex-col items-center text-center"
    >
      <div className="flex items-center gap-2 mb-4">
        <Flame className="size-5 text-emerald-600" />
        <h3 className="font-semibold text-emerald-900">Study Streak</h3>
      </div>
      <div className="relative size-32">
        <svg className="size-full -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-emerald-100"
          />
          <motion.circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke="url(#streakGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
          <defs>
            <linearGradient id="streakGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-emerald-800">{streak}</span>
          <span className="text-xs text-emerald-600/70">Days</span>
        </div>
      </div>
      <p className="text-sm text-emerald-700/80 mt-4 font-medium">
        Great job! Keep it up!
      </p>
    </motion.section>
  );
}
