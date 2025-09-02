"use client";

import { PencilIcon } from "lucide-react";
import { useCallback, useId, useState } from "react";

import { Button } from "@repo/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/dialog";
import { Input } from "@repo/ui/components/input";
import { useAppForm } from "@repo/ui/components/tanstack-form";

import { toast } from "sonner";
import { updateLessonPlan } from "../actions/update-lesson-plan.action";
import type { lessonPlan } from "../schemas";

type Props = {
  lesson: lessonPlan;
  trigger?: React.ReactNode;
};

export function EditLessonPlan({ lesson, trigger }: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const toastId = useId();

  const form = useAppForm({
    defaultValues: {
      title: lesson.title || "",
      content: lesson.content || "",
    },
    onSubmit: async ({ value }) => {
      try {
        toast.loading("Updating lesson plan...", { id: toastId });

        const payload = {
          title: value.title?.trim() || undefined,
          content: value.content?.trim() || undefined,
        };

        await updateLessonPlan(lesson.id, payload);

        toast.success("Lesson plan updated successfully!", { id: toastId });
        setOpen(false);
      } catch (error) {
        const err = error as Error;
        console.error("Failed to update lesson plan:", error);
        toast.error(`Failed: ${err.message}`, { id: toastId });
      }
    },
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    },
    [form]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" icon={<PencilIcon />} variant="ghost">
            Edit Lesson Plan
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <form.AppForm>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Edit Lesson Plan</DialogTitle>
              <DialogDescription>
                Update the lesson plan details below.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4">
              {/* title */}
              <form.AppField
                name="title"
                children={(field) => (
                  <field.FormItem>
                    <field.FormLabel>Title</field.FormLabel>
                    <field.FormControl>
                      <Input
                        placeholder="Lesson plan title"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                    </field.FormControl>
                    <field.FormMessage />
                  </field.FormItem>
                )}
              />

              {/* content */}
              <form.AppField
                name="content"
                children={(field) => (
                  <field.FormItem>
                    <field.FormLabel>Content (optional)</field.FormLabel>
                    <field.FormControl>
                      <textarea
                        className="w-full min-h-28 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        placeholder="Lesson plan content, activities, materials..."
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                    </field.FormControl>
                    <field.FormMessage />
                  </field.FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>

              <Button type="submit" loading={form.state.isSubmitting}>
                Update Lesson Plan
              </Button>
            </DialogFooter>
          </form>
        </form.AppForm>
      </DialogContent>
    </Dialog>
  );
}
