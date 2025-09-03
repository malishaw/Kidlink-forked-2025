"use client"

import { useState } from "react"
import { AddNewLessonPlan } from "./add-new-lessonPlan"
import { LessonPlanList } from "./lessonPlan-list"

// import the shared LessonPlanData interface from a single source
import type { LessonPlanData } from "./add-new-lessonPlan"

export function LessonPlanManagement() {
  const [editingLessonPlan, setEditingLessonPlan] = useState<LessonPlanData | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)

  const handleEditLessonPlan = (lessonPlan: LessonPlanData) => {
    setEditingLessonPlan(lessonPlan)
    setShowEditDialog(true)
  }

  const handleEditComplete = () => {
    setEditingLessonPlan(null)
    setShowEditDialog(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Lesson Plan Management</h1>
            <p className="text-lg text-muted-foreground mt-2">Create and manage lesson plans for students</p>
          </div>
          <AddNewLessonPlan />
        </div>

        <LessonPlanList onEditLessonPlan={handleEditLessonPlan} />

        {showEditDialog && editingLessonPlan && (
          <div className="fixed inset-0 z-50">
            <AddNewLessonPlan editingLessonPlan={editingLessonPlan} onEditComplete={handleEditComplete} />
          </div>
        )}
      </div>
    </div>
  )
}
