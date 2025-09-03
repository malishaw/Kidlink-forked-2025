"use client";

import { TrashIcon } from "lucide-react";
import { useId, useState } from "react";

import { Button } from "@repo/ui/components/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@repo/ui/components/alert-dialog";

import { toast } from "sonner";
import { deleteLessonPlan } from "../actions/delete-lessonPlans.action";
import type { lessonPlan } from "../schemas";

type Props = {
  lesson: lessonPlan;
  trigger?: React.ReactNode;
};

export function DeleteLessonPlan({ lesson, trigger }: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const toastId = useId();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      toast.loading("Deleting lesson plan...", { id: toastId });

      await deleteLessonPlan(lesson.id);

      toast.success("Lesson plan deleted successfully!", { id: toastId });
      setOpen(false);
    } catch (error) {
      const err = error as Error;
      console.error("Failed to delete lesson plan:", error);
      toast.error(`Failed to delete: ${err.message}`, { id: toastId });
    } finally {
      setIsDeleting(false);
    }
  };

  const lessonTitle = lesson.title || `Lesson ${lesson.id}`;

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {trigger || (
          <Button size="sm" icon={<TrashIcon />} variant="ghost">
            Delete
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Lesson Plan</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{lessonTitle}"? This action cannot be undone and will permanently remove the lesson plan from the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Deleting..." : "Delete Lesson Plan"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
