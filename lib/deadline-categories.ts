import {
  BookOpen,
  ClipboardList,
  FolderKanban,
  Medal,
  type LucideIcon,
} from "lucide-react";

export type DeadlineCategory =
  | "report"
  | "assignment"
  | "project"
  | "performance-task";

export const DEADLINE_CATEGORIES: {
  value: DeadlineCategory;
  label: string;
  icon: LucideIcon;
}[] = [
  { value: "report", label: "Report", icon: ClipboardList },
  { value: "assignment", label: "Assignment", icon: BookOpen },
  { value: "project", label: "Project", icon: FolderKanban },
  {
    value: "performance-task",
    label: "Performance Task",
    icon: Medal,
  },
];

const LEGACY_ICON_MAP: Record<string, DeadlineCategory> = {
  "file-text": "report",
  calculator: "assignment",
  microscope: "report",
  book: "assignment",
};

export function resolveDeadlineCategory(icon: string): DeadlineCategory {
  if (DEADLINE_CATEGORIES.some((c) => c.value === icon)) {
    return icon as DeadlineCategory;
  }
  return LEGACY_ICON_MAP[icon] ?? "assignment";
}

export function getDeadlineCategoryMeta(icon: string) {
  const category = resolveDeadlineCategory(icon);
  return (
    DEADLINE_CATEGORIES.find((c) => c.value === category) ??
    DEADLINE_CATEGORIES[1]
  );
}
