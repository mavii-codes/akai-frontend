import { generateId } from "@/lib/id";
import { WEEK_DAYS } from "@/lib/planner-utils";
import type { DayOfWeek, PlannerBlock, Subject } from "@/types";

const ACTIVITIES = [
  "Review notes",
  "Practice problems",
  "Past papers",
  "Concept review",
  "Homework",
];

const START_TIMES = ["09:00", "10:30", "13:00", "14:30", "16:00", "17:30"];

export function buildWeeklyPlanFromSubjects(
  subjects: Subject[],
  dailyStudyHours: number
): PlannerBlock[] {
  if (subjects.length === 0) return [];

  const blocks: PlannerBlock[] = [];
  let timeIndex = 0;

  WEEK_DAYS.forEach((day, dayIndex) => {
    let dayHours = 0;
    let subjectIndex = dayIndex % subjects.length;

    while (dayHours < dailyStudyHours && dayHours < 12) {
      const subject = subjects[subjectIndex % subjects.length];
      const activity = ACTIVITIES[(dayIndex + subjectIndex) % ACTIVITIES.length];
      const time = START_TIMES[timeIndex % START_TIMES.length];
      timeIndex += 1;

      blocks.push({
        id: generateId(),
        time,
        title: `${subject.name} — ${activity}`,
        type: "study",
        dayOfWeek: day as DayOfWeek,
      });

      dayHours += subject.dailyHours;
      subjectIndex += 1;
    }
  });

  return blocks;
}
