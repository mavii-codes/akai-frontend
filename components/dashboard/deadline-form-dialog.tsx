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
import {
  DEADLINE_CATEGORIES,
  type DeadlineCategory,
} from "@/lib/deadline-categories";
import type { DeadlineInput } from "@/store/deadlines-store";
import type { Deadline } from "@/types";
import { cn } from "@/lib/utils";

type DeadlineFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deadline?: Deadline | null;
  onSave: (data: DeadlineInput) => void;
};

export function DeadlineFormDialog({
  open,
  onOpenChange,
  deadline,
  onSave,
}: DeadlineFormDialogProps) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
<<<<<<< HEAD
  const [category, setCategory] = useState<DeadlineCategory>("assignment");
=======
  const [icon, setIcon] = useState("file-text");
  const isEdit = Boolean(deadline);
>>>>>>> 7df49d51b88c1ce928757f2d94ca5b3506f8db59

  useEffect(() => {
    if (!open) return;
    if (deadline) {
      setTitle(deadline.title);
      setDueDate(deadline.dueDateIso);
      setIcon(deadline.icon ?? "file-text");
    } else {
      setTitle("");
      setDueDate(new Date().toISOString().split("T")[0]);
      setCategory("assignment");
    }
  }, [open, deadline]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) return;
    onSave({ title, dueDate, icon: category });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl border-emerald-100 w-[min(100vw-1.5rem,28rem)] max-w-md mx-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-emerald-900 text-lg">
            {isEdit ? "Edit Deadline" : "Add Deadline"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="deadline-title">Title</Label>
            <Input
              id="deadline-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Science research report"
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
            <div className="grid grid-cols-2 gap-2">
<<<<<<< HEAD
              {DEADLINE_CATEGORIES.map((opt) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setCategory(opt.value)}
                    className={cn(
                      "rounded-xl py-2.5 px-2 text-sm font-medium border transition-all touch-manipulation min-h-[44px] flex flex-col items-center justify-center gap-1",
                      category === opt.value
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "border-emerald-100 text-emerald-700 hover:bg-emerald-50"
                    )}
                  >
                    <Icon className="size-4" />
                    <span className="text-xs leading-tight text-center">
                      {opt.label}
                    </span>
                  </button>
                );
              })}
=======
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
>>>>>>> 7df49d51b88c1ce928757f2d94ca5b3506f8db59
            </div>
          </div>
          <Button
            type="submit"
            className="w-full h-11 rounded-xl gradient-green border-0 text-base"
          >
            {isEdit ? "Save Changes" : "Add Deadline"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
