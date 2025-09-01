"use client"

import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button"
import { Trash2, Edit } from "lucide-react"
import { toast } from "sonner"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";



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

interface BadgeListProps {
  onEditBadge?: (badge: BadgeData) => void
}

export function BadgeList({ onEditBadge }: BadgeListProps) {
  const [badges, setBadges] = useState<BadgeData[]>([])
  const [loading, setLoading] = useState(true)

  const fetchBadges = () => {
    try {
      const storedBadges = localStorage.getItem("badges")
      if (storedBadges) {
        setBadges(JSON.parse(storedBadges))
      }
    } catch (error) {
      console.error("Failed to fetch badges:", error)
    } finally {
      setLoading(false)
    }
  }

  const deleteBadge = (badgeId: string) => {
    try {
      const existingBadges = JSON.parse(localStorage.getItem("badges") || "[]")
      const updatedBadges = existingBadges.filter((badge: BadgeData) => badge.id !== badgeId)
      localStorage.setItem("badges", JSON.stringify(updatedBadges))
      setBadges(updatedBadges)
      toast.success("Badge deleted successfully!")
    } catch (error) {
      console.error("Failed to delete badge:", error)
      toast.error("Failed to delete badge")
    }
  }

  useEffect(() => {
    fetchBadges()

    const handleBadgeCreated = () => {
      fetchBadges()
    }

    window.addEventListener("badgeCreated", handleBadgeCreated)
    return () => window.removeEventListener("badgeCreated", handleBadgeCreated)
  }, [])

  const getLevelColor = (level: string) => {
    const levelLower = level.toLowerCase()
    if (levelLower.includes("gold")) return "bg-yellow-100 text-yellow-800"
    if (levelLower.includes("silver")) return "bg-gray-100 text-gray-800"
    if (levelLower.includes("bronze")) return "bg-orange-100 text-orange-800"
    return "bg-blue-100 text-blue-800"
  }

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(6)].map((_, i) => (
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

  if (badges.length === 0) {
    return (
      <Card className="text-center py-8">
        <CardContent>
          <p className="text-muted-foreground">No badges created yet. Create your first badge to see it here!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-20 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {badges.map((badge, index) => (
        <Card key={badge.id || index} className="w-80 h-56 hover:shadow-md transition-shadow flex flex-col relative">
          <CardHeader className="pb-2 flex-shrink-0">
            <div className="flex items-center gap-3">
              <Avatar className="w-20 h-20 flex-shrink-0">
                <AvatarImage src={badge.iconUrl || "/placeholder.svg"} alt={badge.title} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                  {badge.title.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg truncate">{badge.title}</CardTitle>
                <CardDescription className="text-sm">{badge.badgeType}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between space-y-2">
            <p className="text-sm text-muted-foreground line-clamp-2 flex-1 -mt-4">{badge.description}</p>

            <div className="flex items-center gap-2">
              <Badge variant="secondary" className={`text-sm px-3 py-2 ${getLevelColor(badge.level)}`}>
                {badge.level}
              </Badge>
              <div className="text-left">
                <span className="text-lg font-semibold text-primary">{badge.points}</span>
                <span className="text-xs text-muted-foreground ml-1">points</span>
              </div>
            </div>
          </CardContent>

          <div className="absolute bottom-3 right-3 flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEditBadge?.(badge)}
              className="h-8 w-8 p-0 hover:bg-blue-100"
            >
              <Edit className="w-5 h-5 text-blue-600" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteBadge(badge.id!)}
              className="h-8 w-8 p-0 hover:bg-red-100"
            >
              <Trash2 className="w-5 h-5 text-red-600" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}
