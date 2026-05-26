"use client";

import { useState } from "react";
import {
  Calculator,
  Microscope,
  FileText,
  BookOpen,
  Pencil,
  Trash2,
  Plus,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  useDeadlines,
  getDaysLeft,
  formatDeadlineDate,
} from "@/store/deadlines-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeadlineFormDialog } from "@/components/dashboard/deadline-form-dialog";
import type { Deadline } from "@/types";

const iconMap = {
  calculator: Calculator,
  microscope: Microscope,
  "file-text": FileText,
  book: BookOpen,
};

type DeadlinesViewAllProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeadlinesViewAll({ open, onOpenChange }: DeadlinesViewAllProps) {
  const { deadlines, addDeadline, updateDeadline, deleteDeadline } = useDeadlines();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Deadline | null>(null);

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (deadline: Deadline) => {
    setEditing(deadline);
    setFormOpen(true);
  };

  const handleDelete = (deadline: Deadline) => {
    if (window.confirm(`Delete "${deadline.title}"?`)) {
      deleteDeadline(deadline.id);
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-md border-emerald-100 p-0 flex flex-col"
        >
          <SheetHeader className="px-4 sm:px-6 pt-6 pb-4 border-b border-emerald-100">
            <SheetTitle className="text-emerald-900 text-left">
              All Deadlines
            </SheetTitle>
            <p className="text-sm text-emerald-600/70 text-left font-normal">
              Edit, update, or remove your deadlines
            </p>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-3">
            {deadlines.length === 0 ? (
              <p className="text-sm text-emerald-600/60 text-center py-12">
                No deadlines yet. Add your first one below.
              </p>
            ) : (
              deadlines.map((item) => {
                const Icon =
                  iconMap[item.icon as keyof typeof iconMap] ?? FileText;
                return (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-white p-3 sm:p-4 min-w-0"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                      <Icon className="size-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-emerald-900 truncate">
                        {item.title}
                      </p>
                      <p className="text-xs text-emerald-600/70 mt-0.5">
                        {formatDeadlineDate(item.dueDateIso)}
                      </p>
                      <Badge
                        variant="outline"
                        className="mt-2 border-emerald-200 text-emerald-700 bg-emerald-50 text-[10px]"
                      >
                        {getDaysLeft(item.dueDateIso)} days left
                      </Badge>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-1 shrink-0">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => openEdit(item)}
                        className="text-emerald-600 hover:bg-emerald-50 size-9 sm:size-8"
                        aria-label="Edit deadline"
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => handleDelete(item)}
                        className="text-red-500 hover:bg-red-50 size-9 sm:size-8"
                        aria-label="Delete deadline"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="p-4 sm:p-6 border-t border-emerald-100 bg-white/80">
            <Button
              type="button"
              onClick={openAdd}
              className="w-full rounded-xl gradient-green border-0 gap-2 min-h-[44px]"
            >
              <Plus className="size-4" />
              Add Deadline
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <DeadlineFormDialog
        open={formOpen}
        onOpenChange={(isOpen) => {
          setFormOpen(isOpen);
          if (!isOpen) setEditing(null);
        }}
        deadline={editing}
        onSave={(data) => {
          if (editing) {
            updateDeadline(editing.id, data);
          } else {
            addDeadline(data);
          }
        }}
      />
    </>
  );
}
