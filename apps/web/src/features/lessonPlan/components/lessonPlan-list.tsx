"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/card"
import { Button } from "@repo/ui/components/button"
import { Trash2, Edit, BookOpen, Calendar, User } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@repo/ui/components/badge"

import { LessonPlansList } from "../actions/get-lessonPlan.action"
import { deleteLessonPlan } from "../actions/delete-lessonPlan.action"

interface LessonPlanData {
  id: string
  title: string
  content?: string
  childId: string
  classId?: string
  teacherId?: string
  createdAt: string
  updatedAt: string
}

interface LessonPlanListProps {
  onEditLessonPlan?: (lessonPlan: LessonPlanData) => void
}

export function LessonPlanList({ onEditLessonPlan }: LessonPlanListProps) {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")

  const {
    data: lessonPlansData,
    isLoading,
    error,
    refetch,
  } = LessonPlansList({
    page,
    limit: 12,
    search,
    sort: "desc",
  })

  const lessonPlans = lessonPlansData?.data || []
  const totalPages = lessonPlansData?.totalPages || 1

  const handleDeleteLessonPlan = async (lessonPlanId: string) => {
    try {
      await deleteLessonPlan(Number(lessonPlanId))
      toast.success("Lesson plan deleted successfully!")
      refetch()
    } catch (error) {
      console.error("Failed to delete lesson plan:", error)
      toast.error("Failed to delete lesson plan")
    }
  }

  useEffect(() => {
    const handleLessonPlanCreated = () => {
      refetch()
    }

    window.addEventListener("lessonPlanCreated", handleLessonPlanCreated)
    return () => window.removeEventListener("lessonPlanCreated", handleLessonPlanCreated)
  }, [refetch])

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card className="text-center py-8">
        <CardContent>
          <p className="text-red-600">Error loading lesson plans. Please try again.</p>
          <Button onClick={() => refetch()} className="mt-4">
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (lessonPlans.length === 0) {
    return (
      <Card className="text-center py-8">
        <CardContent>
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            No lesson plans created yet. Create your first lesson plan to see it here!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search lesson plans..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md"
          />
        </div>
      </div>

      {/* Lesson Plans Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {lessonPlans.map((lessonPlan: LessonPlanData) => (
          <Card key={lessonPlan.id} className="hover:shadow-md transition-shadow relative">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2 pr-2">{lessonPlan.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(lessonPlan.createdAt).toLocaleDateString()}
                  </CardDescription>
                </div>
                <BookOpen className="h-5 w-5 text-primary flex-shrink-0" />
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {lessonPlan.content && <p className="text-sm text-muted-foreground line-clamp-3">{lessonPlan.content}</p>}

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-xs">
                  <User className="h-3 w-3 mr-1" />
                  {lessonPlan.childId}
                </Badge>
                {lessonPlan.classId && (
                  <Badge variant="outline" className="text-xs">
                    Class: {lessonPlan.classId}
                  </Badge>
                )}
              </div>

              <div className="flex justify-end gap-1 pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditLessonPlan?.(lessonPlan)}
                  className="h-8 w-8 p-0 hover:bg-blue-100"
                >
                  <Edit className="w-4 h-4 text-blue-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteLessonPlan(lessonPlan.id)}
                  className="h-8 w-8 p-0 hover:bg-red-100"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button variant="outline" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
            Previous
          </Button>
          <span className="flex items-center px-4">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
