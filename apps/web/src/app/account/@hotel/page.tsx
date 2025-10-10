"use client";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import {
  Award,
  Baby,
  Bell,
  Calendar,
  Clock,
  GraduationCap,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";

// Import your action files
import { SignoutButton } from "@/features/auth/components/signout-button";
import { BadgesList } from "@/features/badges/actions/get-badge.action";
import { ChildrensList } from "@/features/children/actions/get-children";
import { useGetNotifications } from "@/features/notification/actions/get-notification";
import { ParentsList } from "@/features/parents/actions/get-parent";
import { TeachersList } from "@/features/teachers/actions/get-teacher";

export default function NurseryDashboard() {
  // Fetch data from your action files
  const { data: childrenData, isLoading: childrenLoading } = ChildrensList({
    page: 1,
    limit: 100,
  });
  const { data: teachersData, isLoading: teachersLoading } = TeachersList({
    page: 1,
    limit: 100,
  });
  const { data: parentsData, isLoading: parentsLoading } = ParentsList({
    page: 1,
    limit: 100,
  });
  const { data: badgesData, isLoading: badgesLoading } = BadgesList({
    page: 1,
    limit: 100,
  });
  const { data: notificationsData, isLoading: notificationsLoading } =
    useGetNotifications({ page: 1, limit: 10 });

  // Calculate statistics
  const totalChildren = childrenData?.meta?.total || 0;
  const totalTeachers = teachersData?.meta?.total || 0;
  const totalParents = parentsData?.meta?.total || 0;
  const totalBadges = badgesData?.meta?.total || 0;
  const totalNotifications = notificationsData?.meta?.total || 0;

  const statsCards = [
    {
      title: "Total Children",
      value: totalChildren,
      icon: Baby,
      description: "Enrolled in nursery",
      color: "bg-blue-500",
      trend: "+12% from last month",
    },
    {
      title: "Teachers",
      value: totalTeachers,
      icon: GraduationCap,
      description: "Active teaching staff",
      color: "bg-green-500",
      trend: "+2 new this month",
    },
    {
      title: "Parents",
      value: totalParents,
      icon: Users,
      description: "Registered guardians",
      color: "bg-purple-500",
      trend: "+8% engagement",
    },
    {
      title: "Achievements",
      value: totalBadges,
      icon: Award,
      description: "Badges earned",
      color: "bg-yellow-500",
      trend: "+15 this week",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              🏫 Kidlink Nursery Dashboard
            </h1>
            <p className="text-gray-600">
              Welcome back! Here's what's happening in your nursery today.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              {totalNotifications} Notifications
            </Button>
            <SignoutButton />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => (
            <Card key={index} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${stat.color} text-white`}>
                  <stat.icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <p className="text-xs text-gray-500 mb-2">{stat.description}</p>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.trend}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Children */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Baby className="h-5 w-5 text-blue-500" />
                Recent Children Enrollments
              </CardTitle>
              <CardDescription>
                Latest children added to the nursery
              </CardDescription>
            </CardHeader>
            <CardContent>
              {childrenLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-16 bg-gray-100 rounded animate-pulse"
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {childrenData?.data
                    ?.slice(0, 5)
                    .map((child: any, index: number) => (
                      <div
                        key={child.id || index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Baby className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {child.name || `Child ${index + 1}`}
                            </p>
                            <p className="text-sm text-gray-500">
                              Age: {child.age || "N/A"} • Class:{" "}
                              {child.className || "Unassigned"}
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary">Active</Badge>
                      </div>
                    )) || (
                    <p className="text-gray-500 text-center py-4">
                      No children data available
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-500" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Add New Child
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <GraduationCap className="h-4 w-4 mr-2" />
                Manage Teachers
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Activity
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Bell className="h-4 w-4 mr-2" />
                Send Notification
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Award className="h-4 w-4 mr-2" />
                Award Badges
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Teachers and Parents Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Teachers Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-green-500" />
                Teaching Staff ({totalTeachers})
              </CardTitle>
              <CardDescription>
                Current teachers and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {teachersLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-12 bg-gray-100 rounded animate-pulse"
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {teachersData?.data
                    ?.slice(0, 4)
                    .map((teacher: any, index: number) => (
                      <div
                        key={teacher.id || index}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <UserCheck className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {teacher.name || `Teacher ${index + 1}`}
                            </p>
                            <p className="text-sm text-gray-500">
                              {teacher.subject || "General"} •{" "}
                              {teacher.experience || "2"} years exp.
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-green-600">
                          Active
                        </Badge>
                      </div>
                    )) || (
                    <p className="text-gray-500 text-center py-4">
                      No teachers data available
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-orange-500" />
                Recent Notifications
              </CardTitle>
              <CardDescription>
                Latest updates and announcements
              </CardDescription>
            </CardHeader>
            <CardContent>
              {notificationsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-16 bg-gray-100 rounded animate-pulse"
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {notificationsData?.data
                    ?.slice(0, 4)
                    .map((notification: any, index: number) => (
                      <div
                        key={notification.id || index}
                        className="p-3 bg-orange-50 border border-orange-200 rounded-lg"
                      >
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-medium text-gray-900 text-sm">
                            {notification.topic || `Notification ${index + 1}`}
                          </h4>
                          <Badge variant="secondary" className="text-xs">
                            {notification.status || "info"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {notification.description ||
                            "Important nursery update"}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {notification.createdAt
                            ? new Date(
                                notification.createdAt
                              ).toLocaleDateString()
                            : "Today"}
                        </p>
                      </div>
                    )) || (
                    <p className="text-gray-500 text-center py-4">
                      No notifications available
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Achievement Badges */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" />
              Recent Achievements & Badges
            </CardTitle>
            <CardDescription>
              Celebrating our children's accomplishments
            </CardDescription>
          </CardHeader>
          <CardContent>
            {badgesLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="h-24 bg-gray-100 rounded animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {badgesData?.data
                  ?.slice(0, 6)
                  .map((badge: any, index: number) => (
                    <div
                      key={badge.id || index}
                      className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
                    >
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Award className="h-6 w-6 text-yellow-600" />
                      </div>
                      <h4 className="font-medium text-sm text-gray-900">
                        {badge.name || `Badge ${index + 1}`}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {badge.description || "Achievement unlocked"}
                      </p>
                    </div>
                  )) ||
                  Array.from({ length: 6 }, (_, index) => (
                    <div
                      key={index}
                      className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
                    >
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Award className="h-6 w-6 text-yellow-600" />
                      </div>
                      <h4 className="font-medium text-sm text-gray-900">
                        {
                          [
                            "Star Reader",
                            "Math Wizard",
                            "Art Master",
                            "Kind Helper",
                            "Nature Explorer",
                            "Music Lover",
                          ][index]
                        }
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Sample achievement
                      </p>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
