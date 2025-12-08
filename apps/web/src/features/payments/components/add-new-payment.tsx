"use client";

import { PlusCircleIcon, Upload, X } from "lucide-react";
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

import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useGetChildrenByParentId } from "../../children/actions/get-child-by-parent-id";
import { addPayment } from "../actions/add-payments.action";
import { paymentsInsertSchema } from "../schemas";

export function AddNewPayment() {
  const [open, setOpen] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(""); // For slip preview
  const toastId = useId();

  // Get current session
  const { data: session } = authClient.useSession();
  const currentUserId = session?.user?.id;

  // Fetch children by parent ID
  const {
    data: childrenData,
    isLoading: isChildrenLoading,
    error: childrenError,
  } = useGetChildrenByParentId(currentUserId || "");

  const form = useAppForm({
    validators: { onChange: paymentsInsertSchema },
    defaultValues: {
      childId: "",
      amount: "",
      paymentMethod: "",
      slipUrl: "",
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

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        form.setFieldValue("slipUrl", result); // Update the form field with the image preview URL
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove the selected image
  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    form.setFieldValue("slipUrl", ""); // Clear the form field for slipUrl
  };

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
              {/* Child Selection Dropdown */}
              <form.AppField
                name="childId"
                children={(field) => (
                  <field.FormItem>
                    <field.FormLabel>Select Child</field.FormLabel>
                    <field.FormControl>
                      {isChildrenLoading ? (
                        <div className="flex items-center justify-center h-12 border rounded-md">
                          <div className="w-4 h-4 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin mr-2"></div>
                          Loading children...
                        </div>
                      ) : childrenError ? (
                        <div className="text-red-500 text-sm p-2 border border-red-200 rounded-md">
                          Error loading children
                        </div>
                      ) : childrenData?.data?.length === 0 ? (
                        <div className="text-gray-500 text-sm p-2 border border-gray-200 rounded-md">
                          No children found
                        </div>
                      ) : (
                        <Select
                          value={field.state.value}
                          onValueChange={field.handleChange}
                        >
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select a child" />
                          </SelectTrigger>
                          <SelectContent>
                            {childrenData?.data?.map((child) => (
                              <SelectItem key={child.id} value={child.id}>
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                    {child.name.charAt(0).toUpperCase()}
                                  </div>
                                  {child.name}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
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

              {/* Slip Upload */}
              <form.AppField
                name="slipUrl"
                children={(field) => (
                  <field.FormItem>
                    <field.FormLabel>Payment Slip (Optional)</field.FormLabel>
                    <field.FormControl>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="slip-upload"
                          />
                          <label
                            htmlFor="slip-upload"
                            className="flex items-center justify-center gap-2 h-12 px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md cursor-pointer border border-input"
                          >
                            <Upload className="h-4 w-4" />
                            Upload Slip
                          </label>
                        </div>
                        {imagePreview && (
                          <div className="relative">
                            <img
                              src={imagePreview || "/placeholder.svg"}
                              alt="Slip preview"
                              className="w-16 h-16 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 shadow-lg"
                              onClick={removeImage}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
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
