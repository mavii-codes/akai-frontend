"use client";

import { useEffect, useState } from "react";
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

type SubjectFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subject?: Subject | null;
  onSave: (data: { name: string; color: string; dailyHours: number }) => void;
};

export function SubjectFormDialog({
  open,
  onOpenChange,
  subject,
  onSave,
}: SubjectFormDialogProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState<string>(SUBJECT_COLOR_OPTIONS[0].id);
  const [dailyHours, setDailyHours] = useState(1.5);

  useEffect(() => {
    if (open) {
      setName(subject?.name ?? "");
      setColor(subject?.color ?? SUBJECT_COLOR_OPTIONS[0].id);
      setDailyHours(subject?.dailyHours ?? 1.5);
    }
  }, [open, subject]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      color,
      dailyHours: Math.max(0.5, Math.min(8, dailyHours)),
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              placeholder="e.g. Mathematics"
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
