import type { DayOfWeek } from "@/types";

export const WEEK_DAYS: DayOfWeek[] = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
];

export const DAY_BORDER_COLORS: Record<DayOfWeek, string> = {
  Mon: "border-l-blue-500",
  Tue: "border-l-emerald-500",
  Wed: "border-l-teal-500",
  Thu: "border-l-cyan-500",
  Fri: "border-l-amber-500",
  Sat: "border-l-violet-500",
  Sun: "border-l-rose-400",
};

export const DAY_LABELS: Record<DayOfWeek, string> = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
  Sun: "Sunday",
};

export function getWeekDates(anchor = new Date()) {
  const d = new Date(anchor);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(d);
  monday.setDate(d.getDate() + diff);
  monday.setHours(0, 0, 0, 0);

  return WEEK_DAYS.map((weekday, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    return {
      weekday,
      date,
      label: `${DAY_LABELS[weekday]}, ${date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })}`,
    };
  });
}

export function formatDuration(hours: number) {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}h ${String(m).padStart(2, "0")}m`;
}

export function formatDateRange(start: Date, end: Date) {
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" };
  return `${start.toLocaleDateString("en-US", opts)} – ${end.toLocaleDateString("en-US", opts)}`;
}
