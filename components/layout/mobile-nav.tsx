"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ListTodo, CalendarDays, Sparkles, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/tasks", label: "Task", icon: ListTodo },
  { href: "/planner", label: "Planner", icon: CalendarDays },
  { href: "/ai-assistant", label: "AI", icon: Sparkles },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-emerald-100 bg-white/95 backdrop-blur-xl">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-xl px-3 py-2 min-w-[60px] transition-all",
                isActive ? "text-emerald-600" : "text-emerald-800/50"
              )}
            >
              <span
                className={cn(
                  "flex items-center justify-center rounded-xl p-2 transition-all",
                  isActive && "bg-emerald-100"
                )}
              >
                <Icon className="size-5" />
              </span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
        <Link
          href="/login"
          className="flex flex-col items-center gap-0.5 rounded-xl px-3 py-2 min-w-[60px] text-emerald-800/50"
        >
          <span className="flex items-center justify-center rounded-xl p-2">
            <LogOut className="size-5" />
          </span>
          <span className="text-[10px] font-medium">Logout</span>
        </Link>
      </div>
    </nav>
  );
}
