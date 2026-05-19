import type { Deadline, PlannerBlock, ScheduleItem } from "@/types";

export const todaysSchedule: ScheduleItem[] = [
  {
    id: "1",
    time: "09:00 AM",
    title: "Mathematics",
    description: "Calculus — Chapter 5 review",
    status: "in-progress",
  },
  {
    id: "2",
    time: "11:00 AM",
    title: "Physics",
    description: "Mechanics lab preparation",
    status: "upcoming",
  },
  {
    id: "3",
    time: "01:00 PM",
    title: "Lunch Break",
    description: "Recharge and relax",
    status: "break",
  },
  {
    id: "4",
    time: "02:00 PM",
    title: "Computer Science",
    description: "Data structures practice",
    status: "upcoming",
  },
  {
    id: "5",
    time: "04:00 PM",
    title: "English",
    description: "Essay draft review",
    status: "upcoming",
  },
];

export const upcomingDeadlines: Deadline[] = [
  {
    id: "1",
    title: "Math Exam",
    dueDate: "May 22, 2026",
    daysLeft: 2,
    icon: "calculator",
  },
  {
    id: "2",
    title: "Biology Quiz",
    dueDate: "May 24, 2026",
    daysLeft: 4,
    icon: "microscope",
  },
  {
    id: "3",
    title: "Research Paper",
    dueDate: "May 29, 2026",
    daysLeft: 9,
    icon: "file-text",
  },
];

export const plannerBlocks: PlannerBlock[] = [
  { id: "1", time: "8:00 AM", title: "Math Review", type: "study" },
  { id: "2", time: "10:00 AM", title: "Physics Notes", type: "class" },
  { id: "3", time: "1:00 PM", title: "Lunch Break", type: "break" },
  { id: "4", time: "3:00 PM", title: "Programming Practice", type: "study" },
];

export const aiSuggestedPrompts = [
  "Can you explain photosynthesis in simple terms?",
  "Help me create a study plan for my Math exam",
  "Summarize my tasks for today",
  "Generate flashcards for Biology",
];

export const initialTasks = [
  {
    id: "1",
    title: "Complete Calculus homework",
    description: "Problems 1-15 from Chapter 5",
    dueDate: "2026-05-21",
    priority: "high" as const,
    completed: false,
    createdAt: "2026-05-19",
  },
  {
    id: "2",
    title: "Read Physics chapter",
    description: "Mechanics — Newton's laws",
    dueDate: "2026-05-22",
    priority: "medium" as const,
    completed: false,
    createdAt: "2026-05-19",
  },
  {
    id: "3",
    title: "Draft English essay outline",
    description: "Topic: Climate change impact",
    dueDate: "2026-05-25",
    priority: "low" as const,
    completed: true,
    createdAt: "2026-05-18",
  },
];

export const recentConversations = [
  "Photosynthesis explanation",
  "Math exam study plan",
  "Biology flashcards",
];
