"use client";

import { getClient } from "@/lib/rpc/client";
import { PencilIcon } from "lucide-react";
import { useCallback, useId, useState } from "react";

import { RichTextEditor } from "@/components/rich-text-editor";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { useAppForm } from "@repo/ui/components/tanstack-form";

import { useQuery } from "@tanstack/react-query";
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

  // Fetch classes for dropdown
  const { data: classesData, isLoading: isClassesLoading } = useQuery({
    queryKey: ["classes"],
    queryFn: async () => {
      const rpcClient = await getClient();
      const response = await rpcClient.api.classes.$get({
        query: { page: "1", limit: "100" },
      });
      if (!response.ok) throw new Error("Failed to fetch classes");
      return await response.json();
    },
  });

  const form = useAppForm({
    defaultValues: {
      title: lesson.title || "",
      content: lesson.content || "",
      classId: lesson.classId || "",
    },
    onSubmit: async ({ value }) => {
      try {
        toast.loading("Updating lesson plan...", { id: toastId });

        const payload = {
          title: value.title?.trim() || undefined,
          content: value.content?.trim() || undefined,
          classId: value.classId || undefined,
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
    [form],
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
                      <RichTextEditor
                        value={field.state.value}
                        onChange={(value) => field.handleChange(value)}
                        onBlur={field.handleBlur}
                        placeholder="Lesson plan content, activities, materials..."
                      />
                    </field.FormControl>
                    <field.FormMessage />
                  </field.FormItem>
                )}
              />

              {/* classId */}
              <form.AppField
                name="classId"
                children={(field) => (
                  <field.FormItem>
                    <field.FormLabel>Class</field.FormLabel>
                    <field.FormControl>
                      <Select
                        value={field.state.value}
                        onValueChange={(value) => field.handleChange(value)}
                        disabled={isClassesLoading}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              isClassesLoading
                                ? "Loading classes..."
                                : "Select a class"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {classesData?.data?.map((classItem: any) => (
                            <SelectItem key={classItem.id} value={classItem.id}>
                              {classItem.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
