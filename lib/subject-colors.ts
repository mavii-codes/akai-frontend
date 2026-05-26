export const SUBJECT_COLOR_OPTIONS = [
  { id: "blue", dot: "bg-blue-500", soft: "bg-blue-100 text-blue-700" },
  { id: "emerald", dot: "bg-emerald-500", soft: "bg-emerald-100 text-emerald-700" },
  { id: "teal", dot: "bg-teal-500", soft: "bg-teal-100 text-teal-700" },
  { id: "cyan", dot: "bg-cyan-500", soft: "bg-cyan-100 text-cyan-700" },
  { id: "amber", dot: "bg-amber-500", soft: "bg-amber-100 text-amber-700" },
  { id: "violet", dot: "bg-violet-500", soft: "bg-violet-100 text-violet-700" },
  { id: "rose", dot: "bg-rose-500", soft: "bg-rose-100 text-rose-700" },
  { id: "orange", dot: "bg-orange-500", soft: "bg-orange-100 text-orange-700" },
] as const;

export function getSubjectColor(colorId: string) {
  return (
    SUBJECT_COLOR_OPTIONS.find((c) => c.id === colorId) ??
    SUBJECT_COLOR_OPTIONS[0]
  );
}
