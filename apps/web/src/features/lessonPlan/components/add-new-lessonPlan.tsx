"use client"

import type React from "react"

import { PlusCircleIcon } from "lucide-react"
import { useCallback, useEffect, useId, useState } from "react"
import { toast } from "sonner"

import { Button } from "@repo/ui/components/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/dialog"
import { Input } from "@repo/ui/components/input"
import { Label } from "@repo/ui/components/label"
import { Textarea } from "@repo/ui/components/textarea"

import { createLessonPlan } from "../actions/create-lessonPlan.action"
import { updateLessonPlan } from "../actions/update-lessonPlan.action"
import type { lessonPlanInsertType, lessonPlanUpdateType } from "../schemas"

export interface LessonPlanData {
  id?: string
  title: string
  content: string
  childId: string
  classId?: string
  createdAt?: string
}

interface AddNewLessonPlanProps {
  editingLessonPlan?: LessonPlanData
  onEditComplete?: () => void
}

export function AddNewLessonPlan({ editingLessonPlan, onEditComplete }: AddNewLessonPlanProps) {
  const [open, setOpen] = useState(!!editingLessonPlan)
  const [loading, setLoading] = useState(false)
  const toastId = useId()

  const [formData, setFormData] = useState({
    title: editingLessonPlan?.title || "",
    content: editingLessonPlan?.content || "",
    childId: editingLessonPlan?.childId || "",
    classId: editingLessonPlan?.classId || "",
  })

  useEffect(() => {
    if (editingLessonPlan) {
      setOpen(true)
      setFormData({
        title: editingLessonPlan.title || "",
        content: editingLessonPlan.content || "",
        childId: editingLessonPlan.childId || "",
        classId: editingLessonPlan.classId || "",
      })
    }
  }, [editingLessonPlan])

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen && editingLessonPlan) {
      onEditComplete?.()
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      e.stopPropagation()

      if (!formData.title.trim() || !formData.childId.trim()) {
        toast.error("Please fill in all required fields")
        return
      }

      setLoading(true)
      try {
        toast.loading(editingLessonPlan ? "Updating lesson plan..." : "Creating new lesson plan...", { id: toastId })

        if (editingLessonPlan) {
          const updateData: lessonPlanUpdateType = {
            title: formData.title,
            content: formData.content,
            childId: formData.childId,
            ...(formData.classId ? { classId: formData.classId } : {}),
          }
          await updateLessonPlan(editingLessonPlan.id!, updateData)
          toast.success("Lesson plan updated successfully!", { id: toastId })
          onEditComplete?.()
        } else {
          const createData: lessonPlanInsertType = {
            title: formData.title,
            content: formData.content,
            childId: formData.childId,
            ...(formData.classId ? { classId: formData.classId } : {}),
          }
          await createLessonPlan(createData)
          toast.success("Lesson plan created successfully!", { id: toastId })
        }

        if (!editingLessonPlan) {
          setFormData({
            title: "",
            content: "",
            childId: "",
            classId: "",
          })
        }

        window.dispatchEvent(new CustomEvent("lessonPlanCreated"))
      } catch (error) {
        const err = error as Error
        console.error("Failed to save lesson plan:", error)
        toast.error(`Failed: ${err.message}`, { id: toastId })
      } finally {
        setLoading(false)
        setOpen(false)
      }
    },
    [formData, toastId, editingLessonPlan, onEditComplete],
  )

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {!editingLessonPlan && (
        <DialogTrigger asChild>
          <Button className="gap-2">
            <PlusCircleIcon className="h-4 w-4" />
            Add New Lesson Plan
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-[500px]">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{editingLessonPlan ? "Edit Lesson Plan" : "Create New Lesson Plan"}</DialogTitle>
            <DialogDescription>Fill in the details to create a lesson plan for a student.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Mathematics - Fractions Introduction"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                required
              />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="Detailed lesson plan content, objectives, activities, and assessment methods..."
                value={formData.content}
                onChange={(e) => handleInputChange("content", e.target.value)}
                rows={6}
                className="resize-none"
              />
            </div>

            {/* Child ID */}
            <div className="space-y-2">
              <Label htmlFor="childId">Student ID *</Label>
              <Input
                id="childId"
                placeholder="student-123"
                value={formData.childId}
                onChange={(e) => handleInputChange("childId", e.target.value)}
                required
              />
            </div>

            {/* Class ID */}
            <div className="space-y-2">
              <Label htmlFor="classId">Class ID (Optional)</Label>
              <Input
                id="classId"
                placeholder="class-456"
                value={formData.classId}
                onChange={(e) => handleInputChange("classId", e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>

            <Button type="submit" disabled={loading}>
              {loading ? (editingLessonPlan ? "Updating..." : "Creating...") : editingLessonPlan ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
