"use client";

import { motion } from "framer-motion";

export function AuthDecorations() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute -top-20 -right-20 size-64 rounded-full bg-emerald-200/40 blur-3xl"
      />
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, delay: 1 }}
        className="absolute -bottom-32 -left-20 size-80 rounded-full bg-emerald-300/30 blur-3xl"
      />
      <div className="absolute top-1/4 left-10 size-4 rounded-full bg-emerald-400/40" />
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-1/3 right-16 size-3 rounded-full bg-emerald-500/30"
      />
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
        className="absolute bottom-1/3 right-1/4 size-5 rounded-full bg-emerald-300/35"
      />
    </div>
  );
}
