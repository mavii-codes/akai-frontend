"use client";

import { PieChart } from "lucide-react";

type TasksOverviewChartProps = {
  todo: number;
  inProgress: number;
  completed: number;
};

export function TasksOverviewChart({
  todo,
  inProgress,
  completed,
}: TasksOverviewChartProps) {
  const total = todo + inProgress + completed;
  const safeTotal = total || 1;
  const segments = [
    { value: todo, color: "#0ea5e9", label: "To Do" },
    { value: inProgress, color: "#f59e0b", label: "In Progress" },
    { value: completed, color: "#10b981", label: "Completed" },
  ];

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <section className="glass rounded-2xl border border-emerald-100/60 p-4 sm:p-5">
      <div className="flex items-center gap-2 mb-4">
        <PieChart className="h-5 w-5 text-emerald-600" />
        <h3 className="font-semibold text-emerald-900">Task Overview</h3>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative h-28 w-28 shrink-0">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="#ecfdf5"
              strokeWidth="12"
            />
            {segments.map((seg) => {
              const len = (seg.value / safeTotal) * circumference;
              const dash = `${len} ${circumference - len}`;
              const circle = (
                <circle
                  key={seg.label}
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth="12"
                  strokeDasharray={dash}
                  strokeDashoffset={-offset}
                  strokeLinecap="round"
                />
              );
              offset += len;
              return circle;
            })}
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-emerald-900">
            {total}
          </span>
        </div>
        <ul className="space-y-2 text-xs flex-1">
          {segments.map((s) => (
            <li
              key={s.label}
              className="flex items-center justify-between gap-2"
            >
              <span className="flex items-center gap-2 text-emerald-700">
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: s.color }}
                />
                {s.label}
              </span>
              <span className="font-semibold text-emerald-900">{s.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
