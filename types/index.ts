export type Priority = "low" | "medium" | "high";

export type TaskStatus = "todo" | "in-progress" | "completed";

export type Task = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  completed: boolean;
  createdAt: string;
  status: TaskStatus;
  /** Subject label shown on task cards (e.g. Math, Physics) */
  subject: string;
  /** 0–100, used for in-progress tasks */
  progress: number;
};

export type ScheduleStatus = "in-progress" | "upcoming" | "break";

export type ScheduleItem = {
  id: string;
  time: string;
  title: string;
  description: string;
  status: ScheduleStatus;
};

export type Planner = {
  id: string;
  title: string;
  description?: string;
  /** ISO date YYYY-MM-DD */
  dueDate: string;
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

export type Subject = {
  id: string;
  name: string;
  color: string;
  dailyHours: number;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};
