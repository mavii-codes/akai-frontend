export type Priority = "low" | "medium" | "high";

export type Task = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  completed: boolean;
  createdAt: string;
};

export type ScheduleStatus = "in-progress" | "upcoming" | "break";

export type ScheduleItem = {
  id: string;
  time: string;
  title: string;
  description: string;
  status: ScheduleStatus;
};

export type Deadline = {
  id: string;
  title: string;
  /** ISO date YYYY-MM-DD */
  dueDateIso: string;
  icon: string;
};

export type PlannerView = "daily" | "weekly" | "monthly";

export type DayOfWeek = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export type PlannerBlock = {
  id: string;
  time: string;
  title: string;
  type: "class" | "break" | "study";
  dayOfWeek: DayOfWeek;
  /** ISO date (YYYY-MM-DD) for monthly calendar dots */
  date?: string;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};
