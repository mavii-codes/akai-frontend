"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type PandaMascotProps = {
  className?: string;
  animated?: boolean;
};

function PandaSvg() {
  return (
    <svg
      viewBox="0 0 120 140"
      fill="none"
      className="w-full h-full drop-shadow-lg"
      aria-hidden
    >
      <ellipse cx="60" cy="95" rx="35" ry="40" fill="white" stroke="#10b981" strokeWidth="2.5" />
      <ellipse cx="28" cy="35" rx="18" ry="20" fill="#1f2937" />
      <ellipse cx="92" cy="35" rx="18" ry="20" fill="#1f2937" />
      <ellipse cx="28" cy="38" rx="10" ry="11" fill="#374151" />
      <ellipse cx="92" cy="38" rx="10" ry="11" fill="#374151" />
      <ellipse cx="42" cy="88" rx="9" ry="10" fill="#1f2937" />
      <ellipse cx="78" cy="88" rx="9" ry="10" fill="#1f2937" />
      <circle cx="45" cy="85" r="3" fill="white" />
      <circle cx="81" cy="85" r="3" fill="white" />
      <ellipse cx="60" cy="102" rx="6" ry="5" fill="#1f2937" />
      <path
        d="M50 108 Q60 115 70 108"
        stroke="#1f2937"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <rect x="35" y="115" width="50" height="20" rx="8" fill="#10b981" opacity="0.9" />
      <text x="60" y="129" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">
        AkAI
      </text>
      <circle cx="95" cy="60" r="8" fill="#34d399" opacity="0.5" />
      <circle cx="25" cy="70" r="6" fill="#6ee7b7" opacity="0.4" />
    </svg>
  );
}

export function PandaMascot({ className, animated = true }: PandaMascotProps) {
  if (!animated) {
    return (
      <div className={cn("relative", className)}>
        <PandaSvg />
      </div>
    );
  }

  return (
    <motion.div
      className={cn("relative", className)}
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      <PandaSvg />
    </motion.div>
  );
}
