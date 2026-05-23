"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  ListTodo,
  CalendarDays,
  Sparkles,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { clearAuthSession } from "@/lib/auth-session";

const navItems = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/tasks", label: "Task", icon: ListTodo },
  { href: "/planner", label: "Plan", icon: CalendarDays },
  { href: "/ai-assistant", label: "AI", icon: Sparkles },
  { href: "/settings", label: "Set", icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    clearAuthSession();
    router.push("/login");
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-emerald-100 bg-white/95 backdrop-blur-xl safe-area-pb">
      <div className="flex items-stretch overflow-x-auto scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex items-center justify-around min-w-full flex-1 px-1 py-1.5 gap-0">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-1 flex-col items-center justify-center gap-0.5 rounded-lg py-1.5 px-1 min-w-[52px] max-w-[72px] transition-all touch-manipulation",
                  isActive ? "text-emerald-600" : "text-emerald-800/50"
                )}
              >
                <span
                  className={cn(
                    "flex items-center justify-center rounded-lg p-1.5 transition-all",
                    isActive && "bg-emerald-100"
                  )}
                >
                  <Icon className="size-[18px]" />
                </span>
                <span className="text-[9px] font-medium leading-none">
                  {item.label}
                </span>
              </Link>
            );
          })}
          <button
            type="button"
            onClick={handleLogout}
            className="flex flex-1 flex-col items-center justify-center gap-0.5 rounded-lg py-1.5 px-1 min-w-[52px] text-emerald-800/50 touch-manipulation"
          >
            <span className="flex items-center justify-center rounded-lg p-1.5">
              <LogOut className="size-[18px]" />
            </span>
            <span className="text-[9px] font-medium leading-none">Out</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
