"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useAuthUser } from "@/hooks/use-auth-user";
import { cn } from "@/lib/utils";

export function SidebarUserCard() {
  const { email, displayName, avatarUrl, avatarInitial, ready, isLoggedIn } =
    useAuthUser();

  if (!ready) {
    return (
      <div className="mx-1 mb-3 h-[72px] rounded-2xl bg-white/60 animate-pulse border border-emerald-50" />
    );
  }

  const greeting = isLoggedIn ? displayName : "Student";

  return (
    <Link href="/settings" className="block min-w-0">
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="mx-1 mb-3 flex items-center gap-2.5 sm:gap-3 rounded-2xl border border-emerald-100/80 bg-white p-3 sm:p-3.5 shadow-sm shadow-emerald-100/50 transition-shadow hover:shadow-md min-w-0"
      >
        <div className="flex size-10 sm:size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-100 text-emerald-700">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt="" className="size-full object-cover" />
          ) : (
            <span className="text-sm sm:text-base font-bold">{avatarInitial}</span>
          )}
        </div>
        <div className="min-w-0 flex-1 overflow-hidden">
          <p
            className="text-[13px] sm:text-sm font-bold text-emerald-950 leading-snug"
            title={isLoggedIn ? `Hello, ${greeting}!` : undefined}
          >
            <span className="text-emerald-800/90">Hello, </span>
            <span
              className={cn(
                "text-emerald-700 break-words",
                "line-clamp-2 sm:line-clamp-1 sm:truncate sm:block"
              )}
            >
              {greeting}!
            </span>
          </p>
          <p
            className="truncate text-[11px] sm:text-xs text-emerald-700/55 leading-snug mt-0.5"
            title={email ?? undefined}
          >
            {isLoggedIn && email ? email : "Log in to personalize"}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}
