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

import { createBadge } from "../actions/create-badge.action";

interface AddNewBadgeProps {
  editingBadge?: any
  onEditComplete?: () => void
}

export function AddNewBadge({ editingBadge, onEditComplete }: AddNewBadgeProps) {
  const [open, setOpen] = useState(!!editingBadge)
  const [loading, setLoading] = useState(false)
  const toastId = useId()

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>(editingBadge?.iconUrl || "")

  const [formData, setFormData] = useState({
    title: editingBadge?.title || "",
    description: editingBadge?.description || "",
    badgeType: editingBadge?.badgeType || "",
    points: editingBadge?.points || 0,
    level: editingBadge?.level || "",
    iconUrl: editingBadge?.iconUrl || "",
  })

  useEffect(() => {
    if (editingBadge) {
      setOpen(true)
      setFormData({
        title: editingBadge.title || "",
        description: editingBadge.description || "",
        badgeType: editingBadge.badgeType || "",
        points: editingBadge.points || 0,
        level: editingBadge.level || "",
        iconUrl: editingBadge.iconUrl || "",
      })
      setImagePreview(editingBadge.iconUrl || "")
    }
  }, [editingBadge])

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen && editingBadge) {
      onEditComplete?.()
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImagePreview(result)
        handleInputChange("iconUrl", result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview("")
    handleInputChange("iconUrl", "")
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      e.stopPropagation()

      setLoading(true)
      try {
        toast.loading(editingBadge ? "Updating badge..." : "Creating new badge...", { id: toastId })

        await createBadge(formData)

        const existingBadges = JSON.parse(localStorage.getItem("badges") || "[]")

        if (editingBadge) {
          const updatedBadges = existingBadges.map((badge: any) =>
            badge.id === editingBadge.id
              ? { ...formData, id: editingBadge.id, createdAt: editingBadge.createdAt }
              : badge,
          )
          localStorage.setItem("badges", JSON.stringify(updatedBadges))
          toast.success("Badge updated successfully!", { id: toastId })
          onEditComplete?.()
        } else {
          const newBadge = {
            ...formData,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
          }
          localStorage.setItem("badges", JSON.stringify([...existingBadges, newBadge]))
          toast.success("Badge created successfully!", { id: toastId })
        }

        if (!editingBadge) {
          setFormData({
            title: "",
            description: "",
            badgeType: "",
            points: 0,
            level: "",
            iconUrl: "",
          })
          setImageFile(null)
          setImagePreview("")
        }

        window.dispatchEvent(new CustomEvent("badgeCreated"))
      } catch (error) {
        const err = error as Error
        console.error("Failed to create badge:", error)
        toast.error(`Failed: ${err.message}`, { id: toastId })
      } finally {
        setLoading(false)
        setOpen(false)
      }
    },
    [formData, toastId, editingBadge, onEditComplete],
  )

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

      <DialogContent className="sm:max-w-[500px]">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{editingBadge ? "Edit Badge" : "Create new Badge"}</DialogTitle>
            <DialogDescription>Fill in the details to create a badge for a child/student.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="space-y-2">
              <Label>Badge Image</Label>
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
                    className="flex items-center justify-center gap-2 h-10 px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md cursor-pointer border border-input"
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
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Star Performer"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Awarded for excellent teamwork"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                required
              />
            </div>

            {/* Badge Type */}
            <div className="space-y-2">
              <Label htmlFor="badgeType">Badge Type</Label>
              <Input
                id="badgeType"
                placeholder="Achievement / Participation"
                value={formData.badgeType}
                onChange={(e) => handleInputChange("badgeType", e.target.value)}
                required
              />
            </div>

            {/* Points */}
            <div className="space-y-2">
              <Label htmlFor="points">Points</Label>
              <Input
                id="points"
                type="number"
                placeholder="100"
                value={formData.points}
                onChange={(e) => handleInputChange("points", Number(e.target.value))}
                required
              />
            </div>

            {/* Level */}
            <div className="space-y-2">
              <Label htmlFor="level">Level</Label>
              <Input
                id="level"
                placeholder="Bronze / Silver / Gold"
                value={formData.level}
                onChange={(e) => handleInputChange("level", e.target.value)}
                required
              />
            </div>

            {/* Icon URL */}
            <div className="space-y-2">
              <Label htmlFor="iconUrl">Icon URL (Optional if image uploaded)</Label>
              <Input
                id="iconUrl"
                placeholder="https://example.com/icon.png"
                value={formData.iconUrl}
                onChange={(e) => handleInputChange("iconUrl", e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>

            <Button type="submit" disabled={loading}>
              {loading ? (editingBadge ? "Updating..." : "Creating...") : editingBadge ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
