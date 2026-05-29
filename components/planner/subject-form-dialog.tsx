"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SUBJECT_COLOR_OPTIONS } from "@/lib/subject-colors";
import { cn } from "@/lib/utils";
import type { Subject } from "@/types";
import axiosInstance from "@/lib/axios";

type SubjectFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subject?: Subject | null;
  onSave: (data: { id: string, name: string; color: string; dailyHours: number }) => void;
};

function getInitialFormState(subject?: Subject | null) {
  return {
    name: subject?.name ?? "",
    color: subject?.color ?? SUBJECT_COLOR_OPTIONS[0].id,
    dailyHours: subject?.dailyHours ?? 1.5,
  };
}

export function SubjectFormDialog({
  open,
  onOpenChange,
  subject,
  onSave,
}: SubjectFormDialogProps) {
  const initialState = getInitialFormState(subject);
  const [name, setName] = useState(initialState.name);
  const [color, setColor] = useState<string>(initialState.color);
  const [dailyHours, setDailyHours] = useState(initialState.dailyHours);

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      id: subject?.id ?? "",
      name: name.trim(),
      color,
      dailyHours: Math.max(0.5, Math.min(8, dailyHours)),
    });
    onOpenChange(false);

    try {
      const response = await axiosInstance.post("/api/subjects/v1/create", {
        name: name.trim(),
        color,
        dailyHours: Math.max(0.5, Math.min(8, dailyHours)),
      });
      console.log("Subject saved:", response.data);
    } catch (error) {
      console.error("Error saving subject:", error);
    }
  };

  return (
    <Dialog
      key={`${subject?.id ?? "new"}-${open}`}
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-md border-emerald-100">
        <DialogHeader>
          <DialogTitle className="text-emerald-900">
            {subject ? "Edit Subject" : "Add Subject"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="subject-name">Name</Label>
            <Input
              id="subject-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Subject name"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label>Daily hours</Label>
            <Input
              type="number"
              min={0.5}
              max={8}
              step={0.5}
              value={dailyHours}
              onChange={(e) => setDailyHours(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {SUBJECT_COLOR_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setColor(opt.id)}
                  className={cn(
                    "h-8 w-8 rounded-full border-2 transition-all",
                    opt.dot,
                    color === opt.id
                      ? "border-emerald-900 scale-110"
                      : "border-transparent opacity-70 hover:opacity-100"
                  )}
                  aria-label={opt.id}
                />
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
