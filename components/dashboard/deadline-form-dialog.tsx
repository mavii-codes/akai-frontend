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
import { Label } from "@/components/ui/label";
import type { DeadlineInput } from "@/store/deadlines-store";
import { cn } from "@/lib/utils";

const ICON_OPTIONS = [
  { value: "file-text", label: "Paper" },
  { value: "calculator", label: "Math" },
  { value: "microscope", label: "Science" },
  { value: "book", label: "Book" },
];

type DeadlineFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: DeadlineInput) => void;
};

export function DeadlineFormDialog({
  open,
  onOpenChange,
  onSave,
}: DeadlineFormDialogProps) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [icon, setIcon] = useState("file-text");

  useEffect(() => {
    if (open && !title) {
      setDueDate(new Date().toISOString().split("T")[0]);
    }
    if (!open) {
      setTitle("");
      setDueDate(new Date().toISOString().split("T")[0]);
      setIcon("file-text");
    }
  }, [open, title]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) return;
    onSave({ title, dueDate, icon });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl border-emerald-100 w-[min(100vw-1.5rem,28rem)] max-w-md mx-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-emerald-900 text-lg">Add Deadline</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="deadline-title">Title</Label>
            <Input
              id="deadline-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Math Exam"
              className="h-11 rounded-xl border-emerald-100"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deadline-date">Due date</Label>
            <Input
              id="deadline-date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="h-11 rounded-xl border-emerald-100"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
              {ICON_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setIcon(opt.value)}
                  className={cn(
                    "rounded-xl py-2.5 text-sm font-medium border transition-all touch-manipulation min-h-[44px]",
                    icon === opt.value
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "border-emerald-100 text-emerald-700 hover:bg-emerald-50"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <Button
            type="submit"
            className="w-full h-11 rounded-xl gradient-green border-0 text-base"
          >
            Add Deadline
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
