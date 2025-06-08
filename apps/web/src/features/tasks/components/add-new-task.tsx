"use client";
import { useCallback } from "react";

import { Button } from "@repo/ui/components/button";
import { Checkbox } from "@repo/ui/components/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@repo/ui/components/dialog";
import { Input } from "@repo/ui/components/input";
import { useAppForm } from "@repo/ui/components/tanstack-form";

import { insertTaskSchema } from "@nextplate/api/schema";

export function AddNewTask() {
  const form = useAppForm({
    validators: { onChange: insertTaskSchema },
    defaultValues: {
      name: "",
      done: false
    },
    onSubmit: async ({ value }) => console.log(value)
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
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add new Task</Button>
      </DialogTrigger>

      <form.AppForm>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create new Task</DialogTitle>
              <DialogDescription>
                Create a new task by filling out the details below.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4">
              <form.AppField
                name="name"
                children={(field) => (
                  <field.FormItem>
                    <field.FormLabel>Task Name</field.FormLabel>
                    <field.FormControl>
                      <Input
                        placeholder="FatahChan"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                    </field.FormControl>
                    <field.FormMessage />
                  </field.FormItem>
                )}
              />

              <form.AppField
                name="done"
                children={(field) => (
                  <field.FormItem>
                    <field.FormLabel>Status</field.FormLabel>
                    <field.FormControl>
                      <Checkbox
                        checked={field.state.value}
                        onCheckedChange={(checked: boolean) => {
                          field.handleChange(checked);
                        }}
                      />
                    </field.FormControl>
                    <field.FormDescription>
                      Mark this task as completed or not.
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
              <Button type="submit">Create</Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </form.AppForm>
    </Dialog>
  );
}
