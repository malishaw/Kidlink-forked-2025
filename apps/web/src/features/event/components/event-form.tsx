"use client";

import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { Textarea } from "@repo/ui/components/textarea";
import { Image as ImageIcon, Upload, X } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { addEvent } from "../actions/create-event.action";
import { updateEvent } from "../actions/update-event.action";
import type { EventFormType, EventType } from "../schemas";

interface EventFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: EventType;
}

export function EventForm({
  open,
  onClose,
  onSuccess,
  initialData,
}: EventFormProps) {
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [formData, setFormData] = useState<EventFormType>({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    ticketPrice: "",
    venue: "",
    coverImageUrl: "",
    galleryImagesUrl: "",
    status: "draft",
    organizer: "",
  });

  const isEditing = !!initialData;

  // Initialize form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        startDate: initialData.startDate || "",
        endDate: initialData.endDate || "",
        ticketPrice: initialData.ticketPrice || "",
        venue: initialData.venue || "",
        coverImageUrl: initialData.coverImageUrl || "",
        galleryImagesUrl: initialData.galleryImagesUrl || "",
        status:
          (initialData.status as "draft" | "published" | "cancelled") ||
          "draft",
        organizer: initialData.organizer || "",
      });
      // Set preview image if it exists
      setPreviewImage(initialData.coverImageUrl || null);
    } else {
      // Reset form for create mode
      setFormData({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        ticketPrice: "",
        venue: "",
        coverImageUrl: "",
        galleryImagesUrl: "",
        status: "draft",
        organizer: "",
      });
      // Reset preview image
      setPreviewImage(null);
    }
  }, [initialData, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Event name is required");
      return;
    }

    startTransition(async () => {
      try {
        let result;

        if (isEditing && initialData) {
          result = await updateEvent(initialData.id, formData);
        } else {
          result = await addEvent(formData);
        }

        if (result.success) {
          toast.success(
            isEditing
              ? "Event updated successfully"
              : "Event created successfully"
          );
          onSuccess?.();
          onClose();
        } else {
          toast.error(
            result.error ||
              (isEditing ? "Failed to update event" : "Failed to create event")
          );
        }
      } catch (error) {
        console.error("Form submission error:", error);
        toast.error(
          isEditing ? "Failed to update event" : "Failed to create event"
        );
      }
    });
  };

  const handleChange = (field: keyof EventFormType, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setPreviewImage(dataUrl);
        // For now, set the data URL as the cover image
        // In a real app, you'd upload to a server and get back a URL
        handleChange("coverImageUrl", dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlChange = (url: string) => {
    setPreviewImage(url);
    handleChange("coverImageUrl", url);
  };

  const clearImage = () => {
    setPreviewImage(null);
    handleChange("coverImageUrl", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>{isEditing ? "Edit Event" : "Create New Event"}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            disabled={isPending}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Event Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Enter event name"
                disabled={isPending}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Enter event description"
                disabled={isPending}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) => handleChange("startDate", e.target.value)}
                  disabled={isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => handleChange("endDate", e.target.value)}
                  disabled={isPending}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="venue">Venue</Label>
                <Input
                  id="venue"
                  value={formData.venue}
                  onChange={(e) => handleChange("venue", e.target.value)}
                  placeholder="Enter venue"
                  disabled={isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ticketPrice">Ticket Price</Label>
                <Input
                  id="ticketPrice"
                  value={formData.ticketPrice}
                  onChange={(e) => handleChange("ticketPrice", e.target.value)}
                  placeholder="Enter price"
                  disabled={isPending}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="organizer">Organizer</Label>
              <Input
                id="organizer"
                value={formData.organizer}
                onChange={(e) => handleChange("organizer", e.target.value)}
                placeholder="Enter organizer name"
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label>Event Cover Image</Label>

              {/* Image Preview */}
              {previewImage && (
                <div className="relative">
                  <img
                    src={previewImage}
                    alt="Event cover preview"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={clearImage}
                    className="absolute top-2 right-2"
                    disabled={isPending}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* Upload Options */}
              <div className="space-y-3">
                {/* File Upload */}
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isPending}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isPending}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Image File
                  </Button>
                </div>

                {/* URL Input */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Or paste image URL"
                    value={formData.coverImageUrl}
                    onChange={(e) => handleImageUrlChange(e.target.value)}
                    disabled={isPending}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      handleImageUrlChange(formData.coverImageUrl || "")
                    }
                    disabled={isPending || !formData.coverImageUrl}
                  >
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Helper Text */}
              <p className="text-xs text-muted-foreground">
                Upload an image file (max 5MB) or provide an image URL
              </p>
            </div>
          </CardContent>

          <CardFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="flex-1">
              {isPending ? "Creating..." : "Create Event"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
