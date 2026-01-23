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
  Building2,
  GraduationCap,
  Shield,
  Trash2,
  TrendingUp,
  Users
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Import your action files
import { SignoutButton } from "@/features/auth/components/signout-button";
import { BadgesList } from "@/features/badges/actions/get-badge.action";
import { ChildrensList } from "@/features/children/actions/get-children";
import { useGetNotifications } from "@/features/notification/actions/get-notification";
import { useDeleteNursery } from "@/features/nursery/actions/delete-nursery.action";
import { useGetNurseries } from "@/features/nursery/actions/get-nursery-action";
import { ParentsList } from "@/features/parents/actions/get-parent";
import { TeachersList } from "@/features/teachers/actions/get-teacher";

// Simple inline SVG PieChart component to avoid adding dependencies
function PieChart({ data, size = 200 }: { data: { label: string; value: number; color: string }[]; size?: number }) {
  const total = data.reduce((s, d) => s + Math.max(0, d.value), 0);
  const radius = size / 2;
  let cumulative = 0;
  const [hovered, setHovered] = useState<number | null>(null);

  if (total === 0) {
    return (
      <div className="flex flex-col items-center gap-2">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={radius} cy={radius} r={radius} fill="#f3f4f6" />
          <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="text-sm" fill="#6b7280">
            No data
          </text>
        </svg>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row items-center gap-4 ">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: 'visible' }}>
        {data.map((d, i) => {
          const start = (cumulative / total) * Math.PI * 2;
          cumulative += d.value;
          const end = (cumulative / total) * Math.PI * 2;
          const mid = (start + end) / 2;
          const large = end - start > Math.PI ? 1 : 0;
          const x1 = radius + radius * Math.sin(start);
          const y1 = radius - radius * Math.cos(start);
          const x2 = radius + radius * Math.sin(end);
          const y2 = radius - radius * Math.cos(end);
          const path = `M ${radius} ${radius} L ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2} Z`;

          const offset = hovered === i ? 8 : 0;
          const dx = Math.sin(mid) * offset;
          const dy = -Math.cos(mid) * offset;
          const opacity = hovered === null ? 1 : hovered === i ? 1 : 0.25;

          return (
            <g key={i} transform={`translate(${dx},${dy})`} style={{ transition: 'transform 120ms ease, opacity 120ms ease' }}>
                <path
                  d={path}
                  fill={d.color}
                  fillOpacity={opacity}
                  stroke="#ffffff"
                  strokeWidth={2}
                  strokeLinejoin="round"
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                />
            </g>
          );
        })}

        <circle cx={radius} cy={radius} r={radius * 0.6} fill="white" />
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="text-xs md:text-sm font-semibold" fill="#111827">
          {hovered !== null && data[hovered] ? `${data[hovered].label}: ${data[hovered].value}` : total}
        </text>
      </svg>

      <div className="flex flex-col text-sm">
        {data.map((d, i) => (
          <div
            key={d.label}
            className="flex items-center gap-2 py-1"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{ cursor: 'pointer', opacity: hovered === null ? 1 : hovered === i ? 1 : 0.6 }}
          >
            <span className="inline-block w-3 h-3 rounded" style={{ background: d.color }} />
            <span className="text-slate-700">{d.label}</span>
            <span className="text-slate-500 ml-2">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Fetch data from your action files
  const { data: nurseriesData, isLoading: nurseriesLoading } =
    useGetNurseries();
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
  const { data: notificationsData } = useGetNotifications({
    page: 1,
    limit: 10,
  });

  const deleteNurseryMutation = useDeleteNursery();

  // Calculate statistics
  const totalNurseries = nurseriesData?.meta?.totalCount || 0;
  const totalChildren = childrenData?.meta?.totalCount || 0;
  const totalTeachers = teachersData?.meta?.totalCount || 0;
  const totalParents = parentsData?.meta?.totalCount || 0;
  const totalBadges = badgesData?.meta?.totalCount || 0;
  const totalNotifications = notificationsData?.meta?.totalCount || 0;

  const statsCards = [
    {
      title: "Total Nurseries",
      value: totalNurseries,
      icon: Building2,
      description: "Registered nurseries",
      color: "bg-indigo-500",
      trend: "+3 this month",
    },
    {
      title: "Total Children",
      value: totalChildren,
      icon: Baby,
      description: "Across all nurseries",
      color: "bg-blue-500",
      trend: "+12% from last month",
    },
    {
      title: "Teachers",
      value: totalTeachers,
      icon: GraduationCap,
      description: "Active teaching staff",
      color: "bg-green-500",
      trend: "+5 new this month",
    },
    {
      title: "Parents",
      value: totalParents,
      icon: Users,
      description: "Registered guardians",
      color: "bg-purple-500",
      trend: "+8% engagement",
    },
  ];

  const handleDeleteNursery = (id: string) => {
    deleteNurseryMutation.mutate(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
            </div>
            <p className="text-gray-600 ml-16">
              Manage all nurseries and system-wide operations
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

        {/* Distribution Pie Chart */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Platform Distribution</CardTitle>
            <CardDescription>Users and resources breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <PieChart
              size={180}
              data={[
                { label: "Children", value: totalChildren, color: "#161D6F" },
                { label: "Parents", value: totalParents, color: "#0B2F9F" },
                { label: "Nurseries", value: totalNurseries, color: "#3D74B6" },
                { label: "Teachers", value: totalTeachers, color: "#0F828C" },
              ]}
            />
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => (
            <Card
              key={index}
              className="relative overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
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

        {/* Nurseries Management */}
        <Card className="shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Building2 className="h-6 w-6 text-indigo-500" />
                  Manage Nurseries
                </CardTitle>
                <CardDescription className="mt-2">
                  View all nurseries and manage their status
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {totalNurseries} Total
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {nurseriesLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-20 bg-gray-100 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">
                        Nursery Name
                      </th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">
                        Address
                      </th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">
                        Phone Numbers
                      </th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">
                        Created At
                      </th>
                      <th className="text-center py-4 px-4 font-semibold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {nurseriesData?.data && nurseriesData.data.length > 0 ? (
                      nurseriesData.data.map((nursery: any) => (
                        <tr
                          key={nursery.id}
                          className="border-b border-gray-100 hover:bg-indigo-50 transition-colors"
                        >
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                <Building2 className="h-5 w-5 text-indigo-600" />
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">
                                  {nursery.title}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {nursery.description?.substring(0, 50)}
                                  {nursery.description?.length > 50
                                    ? "..."
                                    : ""}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-gray-700">
                            {nursery.address || "N/A"}
                          </td>
                          <td className="py-4 px-4 text-gray-700">
                            {nursery.phoneNumbers?.join(", ") || "N/A"}
                          </td>
                          <td className="py-4 px-4 text-gray-700">
                            {nursery.createdAt
                              ? new Date(nursery.createdAt).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center justify-center gap-2">
                              {/* <Link href={`/admin/nurseries/${nursery.id}`}>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center gap-1"
                                >
                                  <Eye className="h-4 w-4" />
                                  View
                                </Button>
                              </Link> */}
                              {deleteConfirmId === nursery.id ? (
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() =>
                                      handleDeleteNursery(nursery.id)
                                    }
                                    disabled={deleteNurseryMutation.isPending}
                                  >
                                    Confirm
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setDeleteConfirmId(null)}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  className="flex items-center justify-center gap-1"
                                  onClick={() => setDeleteConfirmId(nursery.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Delete
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          className="text-center py-8 text-gray-500"
                        >
                          No nurseries found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Links to Other Management Pages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/admin/children">
            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Baby className="h-6 w-6 text-blue-600" />
                  </div>
                  View All Children
                </CardTitle>
                <CardDescription>
                  Browse and manage all children across nurseries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {totalChildren}
                </div>
                <p className="text-sm text-gray-500 mt-1">Total children</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/parents">
            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-purple-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  View All Parents
                </CardTitle>
                <CardDescription>
                  Browse and manage all registered parents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  {totalParents}
                </div>
                <p className="text-sm text-gray-500 mt-1">Total parents</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/teachers">
            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-green-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <GraduationCap className="h-6 w-6 text-green-600" />
                  </div>
                  View All Teachers
                </CardTitle>
                <CardDescription>
                  Browse and manage all teaching staff
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {totalTeachers}
                </div>
                <p className="text-sm text-gray-500 mt-1">Total teachers</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* System Overview */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Award className="h-6 w-6 text-yellow-500" />
              System Overview
            </CardTitle>
            <CardDescription>
              Quick insights into the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-800">
                      Total Badges Awarded
                    </p>
                    <p className="text-3xl font-bold text-yellow-600 mt-1">
                      {totalBadges}
                    </p>
                  </div>
                  <Award className="h-12 w-12 text-yellow-500" />
                </div>
              </div>
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-800">
                      Active Notifications
                    </p>
                    <p className="text-3xl font-bold text-orange-600 mt-1">
                      {totalNotifications}
                    </p>
                  </div>
                  <Bell className="h-12 w-12 text-orange-500" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
