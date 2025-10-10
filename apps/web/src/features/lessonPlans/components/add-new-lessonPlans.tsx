"use client";
import { PlusCircleIcon } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { useAppForm } from "@repo/ui/components/tanstack-form";

import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { addLessonPlan } from "../actions/add-lessonPlans.action"; // ⬅️ renamed action
import { addLessonPlanSchema } from "../schemas"; // ⬅️ renamed schema (see notes below)
export function AddNewLessonPlan() {
  const [open, setOpen] = useState<boolean>(false);
  const toastId = useId();

  // Fetch classes for dropdown
  const { data: classesData, isLoading: isClassesLoading } = useQuery({
    queryKey: ["classes"],
    queryFn: async () => {
      const rpcClient = await getClient();
      const response = await rpcClient.api.classes.$get();
      if (!response.ok) throw new Error("Failed to fetch classes");
      return await response.json();
    },
  });

  const form = useAppForm({
    // Validates on change with the lesson plan schema
    validators: { onChange: addLessonPlanSchema },
    defaultValues: {
      // Maps to the API-allowed fields only
      title: "",
      content: "",
      classId: "",
    },
    onSubmit: async ({ value }) => {
      try {
        toast.loading("Creating lesson plan...", { id: toastId });

        // Only send the fields allowed by the API
        const payload = {
          title: value.title,
          classId: value.classId,
          content: value.content?.trim() || null,
        };

        await addLessonPlan(payload);

        toast.success("Lesson plan created successfully!", { id: toastId });
      } catch (error) {
        const err = error as Error;
        console.error("Failed to create lesson plan:", error);
        toast.error(`Failed: ${err.message}`, { id: toastId });
      } finally {
        setOpen(false);
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
        <Button icon={<PlusCircleIcon />}>Add Lesson Plan</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <form.AppForm>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Create Lesson Plan</DialogTitle>
              <DialogDescription>
                Fill in the details to create a new lesson plan.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4">
              {/* title -> lesson_plans.title (required) */}
              <form.AppField
                name="title"
                children={(field) => (
                  <field.FormItem>
                    <field.FormLabel>Title</field.FormLabel>
                    <field.FormControl>
                      <Input
                        placeholder="Alphabet practice, Week 1"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                    </field.FormControl>
                    <field.FormMessage />
                  </field.FormItem>
                )}
              />

              {/* content -> lesson_plans.content (optional) */}
              <form.AppField
                name="content"
                children={(field) => (
                  <field.FormItem>
                    <field.FormLabel>Content (optional)</field.FormLabel>
                    <field.FormControl>
                      {/* Using native textarea to avoid guessing your UI lib API */}
                      <textarea
                        className="w-full min-h-28 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        placeholder="Plan outline, materials, activities..."
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                    </field.FormControl>
                    <field.FormMessage />
                  </field.FormItem>
                )}
              />

              {/* classId -> lesson_plans.class_id (required) */}
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
                    <field.FormDescription>
                      Select the class for this lesson plan.
                    </field.FormDescription>
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
                Create
              </Button>
            </DialogFooter>
          </form>
        </form.AppForm>
      </DialogContent>
    </Dialog>
  );
}
