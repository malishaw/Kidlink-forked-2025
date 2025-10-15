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
import { useAppForm } from "@repo/ui/components/tanstack-form";

import { toast } from "sonner";
import { addPayment } from "../actions/add-payments.action";
import { paymentsInsertSchema } from "../schemas";

export function AddNewPayment() {
  const [open, setOpen] = useState<boolean>(false);
  const toastId = useId();

  const form = useAppForm({
    validators: { onChange: paymentsInsertSchema },
    defaultValues: {
      childId: "",
      amount: "",
      paymentMethod: "",
    },
    onSubmit: async ({ value }) => {
      try {
        toast.loading("Creating new payment...", { id: toastId });

        await addPayment(value);

        toast.success("Payment created successfully!", { id: toastId });
      } catch (error) {
        const err = error as Error;
        console.error("Failed to add payment:", error);
        toast.error(`Failed: ${err.message}`, {
          id: toastId,
        });
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
        <Button icon={<PlusCircleIcon />}>Add new Payment</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <form.AppForm>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Create new Payment</DialogTitle>
              <DialogDescription>
                Create a new payment by filling out the details below.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4">
              <form.AppField
                name="childId"
                children={(field) => (
                  <field.FormItem>
                    <field.FormLabel>Child ID</field.FormLabel>
                    <field.FormControl>
                      <Input
                        placeholder="Enter child ID"
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
                name="amount"
                children={(field) => (
                  <field.FormItem>
                    <field.FormLabel>Amount</field.FormLabel>
                    <field.FormControl>
                      <Input
                        type="number"
                        placeholder="0.00"
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
                name="paymentMethod"
                children={(field) => (
                  <field.FormItem>
                    <field.FormLabel>Payment Method</field.FormLabel>
                    <field.FormControl>
                      <Input
                        placeholder="cash, card, etc."
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
                Create
              </Button>
            </DialogFooter>
          </form>
        </form.AppForm>
      </DialogContent>
    </Dialog>
  );
}
