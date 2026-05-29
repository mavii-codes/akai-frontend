"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home,
  CalendarDays,
  Sparkles,
  Settings,
  LogOut,
} from "lucide-react";
import { PandaLogo } from "@/components/brand/panda-logo";
import { SidebarUserCard } from "@/components/layout/sidebar-user-card";
import { cn } from "@/lib/utils";
import { clearAuthSession } from "@/lib/auth-session";

const navItems = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/planner", label: "Planner", icon: CalendarDays },
  { href: "/ai-assistant", label: "AI Assistant", icon: Sparkles },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    clearAuthSession();
    router.push("/login");
  };

  return (
    <aside className="hidden md:flex fixed left-0 top-0 z-40 h-screen w-64 flex-col border-r border-emerald-100/80 bg-white/90 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col h-full p-5"
      >
        <div className="flex items-center gap-3 px-2 py-4 mb-6">
          <PandaLogo size="md" />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-xl font-bold text-emerald-800 tracking-tight">
              AkAi
            </h1>
            <p className="text-xs text-emerald-600/70">Your Study Companion</p>
          </motion.div>
        </div>

        <nav className="flex-1 space-y-1.5">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <motion.span
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all",
                    isActive
                      ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md shadow-emerald-200"
                      : "text-emerald-800/70 hover:bg-emerald-50 hover:text-emerald-800"
                  )}
                >
                  <Icon className="size-5" />
                  {item.label}
                </motion.span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-4 border-t border-emerald-100/80">
          <SidebarUserCard />
          <button
            type="button"
            onClick={handleLogout}
            className="w-full"
          >
            <motion.span
              whileHover={{ x: 4 }}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-emerald-700/70 hover:bg-red-50 hover:text-red-600 transition-all"
            >
              <LogOut className="size-5" />
              Log out
            </motion.span>
          </button>
        </div>
      </motion.div>
    </aside>
  );
}
