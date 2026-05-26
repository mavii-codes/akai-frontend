"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAppNotifications } from "@/hooks/use-app-notifications";
import { cn } from "@/lib/utils";

type NotificationsMenuProps = {
  /** Override badge count (e.g. page-specific); defaults to live app notifications */
  badgeCount?: number;
  className?: string;
  align?: "start" | "center" | "end";
};

export function NotificationsMenu({
  badgeCount,
  className,
  align = "end",
}: NotificationsMenuProps) {
  const { items, count, urgentCount } = useAppNotifications();
  const displayCount = badgeCount ?? count;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "relative h-10 w-10 sm:h-11 sm:w-11 rounded-xl border-emerald-100 bg-white/80 text-emerald-700 hover:bg-emerald-50 shrink-0 touch-manipulation",
            className
          )}
          aria-label={
            displayCount > 0
              ? `Notifications, ${displayCount} unread`
              : "Notifications"
          }
        >
          <Bell className="h-5 w-5 sm:h-[22px] sm:w-[22px]" />
          {displayCount > 0 && (
            <span
              className={cn(
                "absolute -top-0.5 -right-0.5 flex items-center justify-center rounded-full bg-emerald-600 text-white font-bold leading-none shadow-sm",
                displayCount > 9
                  ? "h-4 min-w-[18px] px-1 text-[9px]"
                  : "h-4 w-4 text-[10px]"
              )}
            >
              {displayCount > 9 ? "9+" : displayCount}
            </span>
          )}
          {urgentCount > 0 && displayCount > 0 && (
            <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        sideOffset={8}
        className={cn(
          "w-[min(calc(100vw-2rem),20rem)] sm:w-72 max-h-[min(70vh,24rem)] overflow-y-auto",
          "rounded-xl border-emerald-100 p-1"
        )}
      >
        <DropdownMenuLabel className="text-emerald-900 font-semibold px-2 py-2">
          Notifications
          {displayCount > 0 && (
            <span className="ml-2 text-xs font-normal text-emerald-600/70">
              ({displayCount})
            </span>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-emerald-50" />
        {items.length === 0 ? (
          <p className="px-3 py-6 text-center text-sm text-emerald-600/60">
            You&apos;re all caught up — no reminders right now.
          </p>
        ) : (
          items.map((item, i) => (
            <div key={item.id}>
              {i > 0 && <DropdownMenuSeparator className="bg-emerald-50" />}
              <DropdownMenuItem
                asChild
                className={cn(
                  "flex flex-col items-start gap-0.5 px-3 py-2.5 cursor-pointer rounded-lg",
                  "focus:bg-emerald-50 whitespace-normal",
                  item.urgent && "bg-rose-50/50 focus:bg-rose-50"
                )}
              >
                {item.href ? (
                  <Link href={item.href} className="w-full min-w-0">
                    <span className="font-medium text-sm text-emerald-900 line-clamp-2">
                      {item.title}
                    </span>
                    <span className="text-xs text-emerald-600/75 mt-0.5 block">
                      {item.body}
                    </span>
                  </Link>
                ) : (
                  <>
                    <span className="font-medium text-sm text-emerald-900 line-clamp-2">
                      {item.title}
                    </span>
                    <span className="text-xs text-emerald-600/75">{item.body}</span>
                  </>
                )}
              </DropdownMenuItem>
            </div>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
