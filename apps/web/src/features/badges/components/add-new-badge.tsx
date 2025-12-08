"use client";

import type React from "react";

import { PlusCircleIcon, Upload, X } from "lucide-react";
import { useCallback, useEffect, useId, useState } from "react";
import { toast } from "sonner";

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
import { Label } from "@repo/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { Textarea } from "@repo/ui/components/textarea";

import { createBadge } from "../actions/create-badge.action";

interface AddNewBadgeProps {
  editingBadge?: any;
  onEditComplete?: () => void;
}

export function AddNewBadge({
  editingBadge,
  onEditComplete,
}: AddNewBadgeProps) {
  const [open, setOpen] = useState(!!editingBadge);
  const [loading, setLoading] = useState(false);
  const toastId = useId();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    editingBadge?.iconUrl || ""
  );

  const [formData, setFormData] = useState({
    title: editingBadge?.title || "",
    description: editingBadge?.description || "",
    badgeType: editingBadge?.badgeType || "",
    points: editingBadge?.points || 0,
    level: editingBadge?.level || "",
    iconUrl: editingBadge?.iconUrl || "",
  });

  useEffect(() => {
    if (editingBadge) {
      setOpen(true);
      setFormData({
        title: editingBadge.title || "",
        description: editingBadge.description || "",
        badgeType: editingBadge.badgeType || "",
        points: editingBadge.points || 0,
        level: editingBadge.level || "",
        iconUrl: editingBadge.iconUrl || "",
      });
      setImagePreview(editingBadge.iconUrl || "");
    }
  }, [editingBadge]);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen && editingBadge) {
      onEditComplete?.();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        handleInputChange("iconUrl", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    handleInputChange("iconUrl", "");
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();

      setLoading(true);
      try {
        toast.loading(
          editingBadge ? "Updating badge..." : "Creating new badge...",
          { id: toastId }
        );

        // Use the createBadge action to save the badge to the database
        await createBadge(formData);

        toast.success(
          editingBadge
            ? "Badge updated successfully!"
            : "Badge created successfully!",
          { id: toastId }
        );

        if (!editingBadge) {
          setFormData({
            title: "",
            description: "",
            badgeType: "",
            points: 0,
            level: "",
            iconUrl: "",
          });
          setImageFile(null);
          setImagePreview("");
        }

        window.dispatchEvent(new CustomEvent("badgeCreated"));
        window.location.reload(); // Reload the page after badge creation
      } catch (error) {
        const err = error as Error;
        console.error("Failed to create badge:", error);
        toast.error(`Failed: ${err.message}`, { id: toastId });
      } finally {
        setLoading(false);
        setOpen(false);
      }
    },
    [formData, toastId, editingBadge, onEditComplete]
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {!editingBadge && (
        <DialogTrigger asChild>
          <Button className="gap-2">
            <PlusCircleIcon className="h-4 w-4" />
            Add new Badge
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-800">
              {editingBadge ? "Edit Badge" : "Create New Badge"}
            </DialogTitle>
            <DialogDescription>
              Fill in the details to create a badge for a child/student.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6">
            {/* Badge Image */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Badge Image</Label>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <Label
                    htmlFor="image-upload"
                    className="flex items-center justify-center gap-2 h-12 px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md cursor-pointer border border-input"
                  >
                    <Upload className="h-4 w-4" />
                    Upload Image
                  </Label>
                </div>
                {imagePreview && (
                  <div className="relative">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Badge preview"
                      className="w-16 h-16 object-cover rounded-md border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                      onClick={removeImage}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Badge Title
              </Label>
              <Input
                id="title"
                placeholder="Star Performer"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="h-12"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Awarded for excellent teamwork and outstanding performance"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                rows={3}
                required
              />
            </div>

            {/* Badge Type and Level - Grid Layout */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="badgeType" className="text-sm font-medium">
                  Badge Type
                </Label>
                <Select
                  value={formData.badgeType}
                  onValueChange={(value) =>
                    handleInputChange("badgeType", value)
                  }
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="achievement">🏆 Achievement</SelectItem>
                    <SelectItem value="progress">📈 Progress</SelectItem>
                    <SelectItem value="skill">🎯 Skill</SelectItem>
                    <SelectItem value="participation">
                      👥 Participation
                    </SelectItem>
                    <SelectItem value="creativity">🎨 Creativity</SelectItem>
                    <SelectItem value="leadership">⭐ Leadership</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="level" className="text-sm font-medium">
                  Level
                </Label>
                <Select
                  value={formData.level}
                  onValueChange={(value) => handleInputChange("level", value)}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bronze">🥉 Bronze</SelectItem>
                    <SelectItem value="silver">🥈 Silver</SelectItem>
                    <SelectItem value="gold">🥇 Gold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Points */}
            <div className="space-y-2">
              <Label htmlFor="points" className="text-sm font-medium">
                Points
              </Label>
              <Input
                id="points"
                type="number"
                placeholder="100"
                value={formData.points}
                onChange={(e) =>
                  handleInputChange("points", Number(e.target.value))
                }
                className="h-12"
                required
              />
            </div>
          </div>

          <DialogFooter className="flex gap-3 pt-4">
            <DialogClose asChild>
              <Button variant="outline" className="flex-1 h-12">
                Cancel
              </Button>
            </DialogClose>

            <Button
              type="submit"
              disabled={loading}
              className="flex-1 h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-green-200 border-t-green-600 rounded-full animate-spin" />
                  {editingBadge ? "Updating..." : "Creating..."}
                </>
              ) : editingBadge ? (
                "Update Badge"
              ) : (
                "Create Badge"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
