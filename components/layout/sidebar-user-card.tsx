"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useAuthUser } from "@/hooks/use-auth-user";
import { getEmailInitial } from "@/lib/auth-session";
import { loadProfile } from "@/lib/profile-storage";
import { useEffect, useState } from "react";

export function SidebarUserCard() {
  const { email, ready, isLoggedIn } = useAuthUser();
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>();

  useEffect(() => {
    const profile = loadProfile();
    setAvatarUrl(profile.profileImage || undefined);
    const onProfileUpdate = () => {
      setAvatarUrl(loadProfile().profileImage || undefined);
    };
    window.addEventListener("akai-profile-updated", onProfileUpdate);
    return () => window.removeEventListener("akai-profile-updated", onProfileUpdate);
  }, []);

  if (!ready) {
    return (
      <div className="mx-1 mb-3 h-[72px] rounded-2xl bg-white/60 animate-pulse border border-emerald-50" />
    );
  }

  const initial = email ? getEmailInitial(email) : "S";
  const primaryText = isLoggedIn ? email : "Guest";

  return (
    <Link href="/settings">
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="mx-1 mb-3 flex items-center gap-3 rounded-2xl border border-emerald-100/80 bg-white p-3.5 shadow-sm shadow-emerald-100/50 transition-shadow hover:shadow-md"
      >
        <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-100 text-emerald-700">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt="" className="size-full object-cover" />
          ) : (
            <span className="text-base font-bold">{initial}</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-emerald-950" title={primaryText}>
            {isLoggedIn ? (
              <>
                Hello,{" "}
                <span className="text-emerald-700">{primaryText}</span>
              </>
            ) : (
              "Hello, Student!"
            )}
          </p>
          <p className="truncate text-xs text-emerald-700/55 leading-snug mt-0.5">
            {isLoggedIn
              ? "Keep going, you're doing great! :)"
              : "Log in to personalize"}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}
