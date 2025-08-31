"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import {
  AlertCircle,
  Award,
  Calendar,
  ChevronDown,
  Eye,
  GraduationCap,
  Grid3X3,
  List,
  Mail,
  MapPin,
  Phone,
  Search,
  Users,
} from "lucide-react";
import { useState } from "react";

import { TeachersList as useTeachersList } from "@/features/teachers/actions/get-teacher";

export function TeachersList() {
  const [selectedChild, setSelectedChild] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"name" | "children" | "recent">("name");
  const { data, isLoading, error } = useTeachersList({});

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center py-20 space-y-8">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-2 w-16 h-16 border-4 border-transparent border-t-indigo-400 rounded-full animate-spin animate-reverse"></div>
          <div className="absolute inset-4 w-12 h-12 border-4 border-transparent border-t-purple-300 rounded-full animate-spin"></div>
        </div>
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2">
            <GraduationCap className="h-6 w-6 text-blue-600" />
            <p className="text-xl font-semibold text-gray-800">
              Loading teachers...
            </p>
          </div>
          <p className="text-gray-500 max-w-sm">
            Fetching teacher profiles and student assignments
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center p-8">
        <div className="bg-gradient-to-br from-red-50 via-pink-50 to-red-100 border border-red-200 rounded-3xl p-12 text-center shadow-xl max-w-md">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full mb-8 shadow-inner">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h3 className="text-2xl font-bold text-red-800 mb-4">
            Unable to Load Teachers
          </h3>
          <p className="text-red-600 mb-6 leading-relaxed">
            {error.message ||
              "Something went wrong while fetching teacher data."}
          </p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="border-red-200 text-red-600 hover:bg-red-50"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const teachersData = data?.data || [];

  // Enhanced filtering with multiple criteria
  const filteredTeachers = teachersData.filter(
    (teacher: any) =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.phoneNumber?.includes(searchTerm) ||
      teacher.children?.some(
        (child: any) =>
          child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          child.class.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  // Enhanced sorting
  const sortedTeachers = [...filteredTeachers].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "children":
        return (b.children?.length || 0) - (a.children?.length || 0);
      case "recent":
        return (
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
        );
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Header Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                    <GraduationCap className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Teachers Directory
                  </h1>
                  <p className="text-gray-600 text-lg">
                    Manage educator profiles and student assignments
                  </p>
                </div>
              </div>

              {/* Stats Row */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-700">
                    {sortedTeachers.length} Teacher
                    {sortedTeachers.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-full">
                  <Award className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-semibold text-purple-700">
                    {sortedTeachers.reduce(
                      (acc, t) => acc + (t.children?.length || 0),
                      0
                    )}{" "}
                    Students
                  </span>
                </div>
              </div>
            </div>

            {/* Enhanced Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "grid"
                      ? "bg-white shadow-md text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "list"
                      ? "bg-white shadow-md text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2 pr-8 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="name">Sort by Name</option>
                  <option value="children">Sort by Students</option>
                  <option value="recent">Sort by Recent</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Enhanced Search Bar */}
          <div className="mt-8">
            <div className="relative max-w-2xl">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by teacher name, email, phone, or student details..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base placeholder-gray-400"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Teachers Content */}
        {sortedTeachers.length === 0 ? (
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-16 text-center shadow-xl">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-8 shadow-inner">
              <Users className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-4">
              {searchTerm
                ? "No matching teachers found"
                : "No teachers registered"}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto text-lg leading-relaxed">
              {searchTerm
                ? "Try adjusting your search terms or browse all teachers."
                : "Start by adding teacher profiles to manage your educational staff."}
            </p>
            {searchTerm && (
              <Button
                onClick={() => setSearchTerm("")}
                className="mt-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              >
                Clear Search
              </Button>
            )}
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid gap-8 md:grid-cols-2 xl:grid-cols-3"
                : "space-y-6"
            }
          >
            {sortedTeachers.map((teacher: any) => (
              <Card
                key={teacher.id}
                className={`group relative overflow-hidden border-0 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 rounded-3xl ${
                  viewMode === "list" ? "flex flex-row" : ""
                }`}
              >
                {/* Animated Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>

                <CardHeader
                  className={`relative z-10 ${viewMode === "list" ? "pb-4" : "pb-6"}`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Avatar className="h-20 w-20 shadow-2xl ring-4 ring-white group-hover:ring-blue-100 transition-all duration-300 group-hover:scale-110">
                        <AvatarImage
                          src={
                            teacher.avatar ||
                            `/teacher-${teacher.id}.png?height=80&width=80`
                          }
                        />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 text-white text-xl font-bold">
                          {teacher.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-3 border-white shadow-lg flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-blue-700 transition-colors duration-300 truncate">
                        {teacher.name}
                      </CardTitle>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-1 font-medium">
                          Teacher
                        </Badge>
                        {teacher.children?.length > 0 && (
                          <Badge
                            variant="outline"
                            className="border-purple-200 text-purple-700 bg-purple-50"
                          >
                            {teacher.children.length} Student
                            {teacher.children.length !== 1 ? "s" : ""}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent
                  className={`relative z-10 space-y-6 ${viewMode === "list" ? "flex-1" : ""}`}
                >
                  {/* Contact Information */}
                  <div className="bg-gradient-to-r from-gray-50/80 to-white/80 backdrop-blur-sm rounded-2xl p-5 space-y-4">
                    <h4 className="font-semibold text-gray-800 flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Contact Details
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-700 group-hover:text-gray-800 transition-colors duration-200">
                        <div className="p-2.5 bg-blue-100 rounded-xl mr-3 group-hover:bg-blue-200 transition-colors">
                          <Mail className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="text-sm font-medium truncate flex-1">
                          {teacher.email}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-700 group-hover:text-gray-800 transition-colors duration-200">
                        <div className="p-2.5 bg-green-100 rounded-xl mr-3 group-hover:bg-green-200 transition-colors">
                          <Phone className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="text-sm font-medium">
                          {teacher.phoneNumber}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-700 group-hover:text-gray-800 transition-colors duration-200">
                        <div className="p-2.5 bg-orange-100 rounded-xl mr-3 group-hover:bg-orange-200 transition-colors">
                          <MapPin className="h-4 w-4 text-orange-600" />
                        </div>
                        <span className="text-sm font-medium truncate flex-1">
                          {teacher.address}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Students Section */}
                  <div className="bg-gradient-to-br from-purple-50/80 via-blue-50/80 to-indigo-50/80 backdrop-blur-sm rounded-2xl p-5">
                    <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      Students ({teacher.children?.length || 0})
                    </h4>
                    <div
                      className={`space-y-3 ${teacher.children?.length > 2 ? "max-h-48 overflow-y-auto" : ""}`}
                    >
                      {teacher.children?.map((child: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 group/child"
                        >
                          <div className="flex items-center space-x-3 flex-1 min-w-0">
                            <Avatar className="h-12 w-12 shadow-md ring-2 ring-white group-hover/child:ring-purple-100 transition-all">
                              <AvatarImage
                                src={child.avatar || "/placeholder.svg"}
                              />
                              <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-500 text-white text-sm font-bold">
                                {child.name
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-sm text-gray-800 truncate">
                                {child.name}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge
                                  variant="outline"
                                  className="text-xs border-purple-200 text-purple-700 bg-purple-50"
                                >
                                  {child.class}
                                </Badge>
                                <span className="text-xs text-gray-600 flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  Age {child.age}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => setSelectedChild(child)}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-xs px-4 py-2 ml-3"
                          >
                            <Eye className="h-3 w-3 mr-2" />
                            View
                          </Button>
                        </div>
                      )) || (
                        <div className="text-center py-8">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Users className="h-8 w-8 text-gray-400" />
                          </div>
                          <p className="text-gray-500 text-sm font-medium">
                            No students assigned yet
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
