"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Planner } from "@/types";

export type DeadlineInput = {
  title: string;
  description?: string;
  dueDate: string;
  icon?: string;
};
import axiosInstance from "@/lib/axios";

type DeadlineFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deadline?: Planner | null;
  onSave: (data: DeadlineInput) => void;
};

function getInitialFormState(deadline?: Planner | null) {
  return {
    title: deadline?.title ?? "",
    description: deadline?.description ?? "",
    dueDate: deadline?.dueDate ?? new Date().toISOString().split("T")[0],
    icon: deadline?.icon ?? "",
  };
}

export function DeadlineFormDialog({
  open,
  onOpenChange,
  deadline,
  onSave,
}: DeadlineFormDialogProps) {
  const initialState = getInitialFormState(deadline);
  const [title, setTitle] = useState(initialState.title);
  const [description, setDescription] = useState(initialState.description);
  const [dueDate, setDueDate] = useState(initialState.dueDate);
  const [icon, setIcon] = useState(initialState.icon);
  const isEdit = Boolean(deadline);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) return;
    onSave({ title, description, dueDate, icon });
    onOpenChange(false);

    try {
      const response = await axiosInstance.post("/api/deadlines/v1/create", {
      title: title.trim(),
      description: description.trim(),
      dueDate,
      icon,
    });
    console.log("Deadline saved:", response.data);
    } catch (error) {
      console.error("Error saving deadline:", error);
    }
  };

  return (
    <Dialog
      key={`${deadline?.id ?? "new"}-${open}`}
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="rounded-2xl border-emerald-100 w-[min(100vw-1.5rem,28rem)] max-w-md mx-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-emerald-900 text-lg">
            {isEdit ? "Edit Planner" : "Add Planner"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="deadline-title">Title</Label>
            <Input
              id="deadline-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Final project deadline"
              className="h-11 rounded-xl border-emerald-100"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deadline-description">Description</Label>
            <Input
              id="deadline-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional details about this planner"
              className="h-11 rounded-xl border-emerald-100"
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
            <Label htmlFor="deadline-category">Category</Label>
            <Input
              id="deadline-category"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="e.g. Math, Science, Planner"
              className="h-11 rounded-xl border-emerald-100"
            />
          </div>
          <Button
            type="submit"
            className="w-full h-11 rounded-xl gradient-green border-0 text-base"
          >
            {isEdit ? "Save Changes" : "Add Planner"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
