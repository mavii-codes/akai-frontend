"use client";

import Link from "next/link";
import { ChevronDown, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuthUser } from "@/hooks/use-auth-user";
import { cn } from "@/lib/utils";

type PageUserChipProps = {
  className?: string;
};

export function PageUserChip({ className }: PageUserChipProps) {
  const { displayName, email, avatarUrl, avatarInitial, ready, isLoggedIn } =
    useAuthUser();

  const name = ready && isLoggedIn ? displayName : "Student";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "h-10 sm:h-11 rounded-xl border-emerald-100 bg-white/80 text-emerald-800 hover:bg-emerald-50 gap-2 px-2 sm:px-3 max-w-full min-w-0 touch-manipulation",
            className
          )}
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-100 text-emerald-700">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <User className="h-4 w-4" />
            )}
          </span>
          <span className="hidden sm:inline truncate text-sm font-medium max-w-[120px] md:max-w-[160px]">
            Hello, {name}!
          </span>
          <span className="inline sm:hidden text-sm font-medium truncate max-w-[5rem]">
            {name}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 text-emerald-500 hidden sm:block" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-[min(calc(100vw-2rem),16rem)] rounded-xl border-emerald-100"
      >
        <DropdownMenuLabel className="font-normal min-w-0">
          <p className="font-semibold text-emerald-900 truncate">
            Hello, {name}!
          </p>
          {isLoggedIn && email && (
            <p className="text-xs text-emerald-600/70 truncate mt-0.5 font-normal">
              {email}
            </p>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-emerald-50" />
        <DropdownMenuItem asChild>
          <Link href="/settings" className="cursor-pointer">
            Profile &amp; settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/home" className="cursor-pointer">
            Dashboard
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
