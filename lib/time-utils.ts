/** Sort planner blocks by time string (e.g. "8:00 AM", "14:30") */
export function sortByTime<T extends { time: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time));
}

export function parseTimeToMinutes(time: string): number {
  const trimmed = time.trim().toUpperCase();
  const match12 = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/);
  if (!match12) return 0;
  let hours = parseInt(match12[1], 10);
  const minutes = parseInt(match12[2], 10);
  const period = match12[3];
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  if (!period && hours < 8) hours += 12; // assume morning for 24h-ish without AM/PM
  return hours * 60 + minutes;
}

export function formatTimeInput(value: string): string {
  const [h, m] = value.split(":");
  if (!h || !m) return value;
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}

export function getTodayDayOfWeek(): string {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
  return days[new Date().getDay()];
}
