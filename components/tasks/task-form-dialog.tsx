"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { Priority, Task, TaskStatus } from "@/types";
import type { TaskInput } from "@/store/tasks-store";
import { cn } from "@/lib/utils";

type TaskFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
  subjectSuggestions?: string[];
  onSave: (data: TaskInput) => void;
};

export function TaskFormDialog({
  open,
  onOpenChange,
  task,
  subjectSuggestions = [],
  onSave,
}: TaskFormDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [subject, setSubject] = useState("");
  const [progress, setProgress] = useState(30);

  useEffect(() => {
    if (!open) return;
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setDueDate(task.dueDate);
      setPriority(task.priority);
      setStatus(task.status);
      setSubject(task.subject);
      setProgress(task.progress);
    } else {
      setTitle("");
      setDescription("");
      setDueDate(new Date().toISOString().split("T")[0]);
      setPriority("medium");
      setStatus("todo");
      setSubject("");
      setProgress(30);
    }
  }, [task, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      description,
      dueDate,
      priority,
      status,
      subject: subject.trim(),
      progress: status === "in-progress" ? progress : undefined,
    });
    onOpenChange(false);
  };

  const priorities: Priority[] = ["low", "medium", "high"];
  const statuses: { value: TaskStatus; label: string }[] = [
    { value: "todo", label: "To Do" },
    { value: "in-progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl border-emerald-100 w-[calc(100vw-2rem)] max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-emerald-900">
            {task ? "Edit Task" : "New Task"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="task-title">Title</Label>
            <Input
              id="task-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Study for Math Exam"
              className="rounded-xl border-emerald-100"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="task-desc">Description</Label>
            <Textarea
              id="task-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What needs to be done?"
              className="rounded-xl border-emerald-100 min-h-[72px]"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="task-subject">Subject</Label>
              <Input
                id="task-subject"
                list="task-subjects"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Math"
                className="rounded-xl border-emerald-100"
              />
              <datalist id="task-subjects">
                {subjectSuggestions.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-due">Due Date</Label>
              <Input
                id="task-due"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="rounded-xl border-emerald-100"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Priority</Label>
            <div className="flex gap-2">
              {priorities.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={cn(
                    "flex-1 rounded-xl py-2 text-sm font-medium capitalize border transition-all",
                    priority === p
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "border-emerald-100 text-emerald-700 hover:bg-emerald-50"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <div className="flex gap-2 flex-wrap">
              {statuses.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setStatus(s.value)}
                  className={cn(
                    "rounded-xl px-3 py-2 text-xs font-medium border transition-all",
                    status === s.value
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "border-emerald-100 text-emerald-700 hover:bg-emerald-50"
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          {status === "in-progress" && (
            <div className="space-y-2">
              <Label htmlFor="task-progress">
                Progress ({progress}%)
              </Label>
              <input
                id="task-progress"
                type="range"
                min={5}
                max={95}
                step={5}
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
            </div>
          )}
          <Button
            type="submit"
            className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 border-0"
          >
            {task ? "Save Changes" : "Create Task"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
