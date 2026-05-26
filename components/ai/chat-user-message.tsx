"use client";

import { motion } from "framer-motion";
import { User } from "lucide-react";

type ChatUserMessageProps = {
  content: string;
};

export function ChatUserMessage({ content }: ChatUserMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3 flex-row-reverse"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm">
        <User className="h-4 w-4" />
      </div>
      <div className="max-w-[85%] rounded-2xl rounded-tr-md bg-emerald-600 text-white px-4 py-3 text-sm leading-relaxed shadow-md shadow-emerald-600/15">
        {content}
      </div>
    </motion.div>
  );
}
