"use client"

import { useState } from "react"
import { AddNewBadge } from "./add-new-badge"
import { BadgeList } from "./badge-list"

interface BadgeData {
  id?: string
  title: string
  description: string
  badgeType: string
  points: number
  level: string
  iconUrl: string
  createdAt?: string
}

export function BadgeManagement() {
  const [editingBadge, setEditingBadge] = useState<BadgeData | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)

  const handleEditBadge = (badge: BadgeData) => {
    setEditingBadge(badge)
    setShowEditDialog(true)
  }

  const handleEditComplete = () => {
    setEditingBadge(null)
    setShowEditDialog(false)
  }

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Badge Management</h1>
            <p className="text-muted-foreground">Create and manage badges for students</p>
          </div>
          <AddNewBadge />
        </div>

        <BadgeList onEditBadge={handleEditBadge} />

        {showEditDialog && editingBadge && (
          <div className="fixed inset-0 z-50">
            <AddNewBadge editingBadge={editingBadge} onEditComplete={handleEditComplete} />
          </div>
        )}
      </div>
    </div>
  )
}
