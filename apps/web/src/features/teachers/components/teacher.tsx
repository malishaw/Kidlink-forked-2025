"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import { Button } from "@repo/ui/components/button";
import { Card, CardHeader, CardTitle } from "@repo/ui/components/card";
import { useQuery } from "@tanstack/react-query";
import {
  Award,
  ChevronDown,
  GraduationCap,
  Grid3X3,
  List,
  Plus,
  Search,
  Users,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { createTeacher } from "@/features/teachers/actions/create-teacher";
import { useGetTeacherByUserId } from "@/features/teachers/actions/get-teacher-by-user-id";
import { authClient } from "@/lib/auth-client";
import { getClient } from "@/lib/rpc/client";

export function TeachersList() {
  const { data: session } = authClient.useSession();
  const [activeMember, setActiveMember] = useState<any>(null);
  const [isLoadingMember, setIsLoadingMember] = useState(true);
  const [selectedChild, setSelectedChild] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"name" | "children" | "recent">("name");
  const router = useRouter();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    avatar: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch active member to get the userId
  useEffect(() => {
    const fetchActiveMember = async () => {
      try {
        setIsLoadingMember(true);
        const response = await fetch(
          "/api/auth/organization/get-active-member"
        );
        if (response.ok) {
          const memberData = await response.json();
          setActiveMember(memberData);
        }
      } catch (error) {
        console.error("Failed to fetch active member:", error);
      } finally {
        setIsLoadingMember(false);
      }
    };
    fetchActiveMember();
  }, []);

  // Get teachers by userId using the new action
  const {
    data: teachersData,
    isLoading: teachersLoading,
    error: teachersError,
    refetch: refetchTeachers,
  } = useGetTeacherByUserId(activeMember?.userId || "", {
    page: 1,
    limit: 50,
    sort: "desc",
    search: searchTerm,
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createTeacher({
        ...formData,
        userId: activeMember?.userId,
        organizationId: activeMember?.organizationId,
      });
      setIsModalOpen(false);
      setFormData({
        name: "",
        email: "",
        phoneNumber: "",
        address: "",
        avatar: "",
      });
      refetchTeachers();
    } catch (err) {
      console.error(err);
      alert("Failed to create teacher");
    } finally {
      setIsSubmitting(false);
    }
  };

  const { data: classesResponse, isLoading: classesLoading } = useQuery({
    queryKey: ["all-classes"],
    queryFn: async () => {
      const rpcClient = await getClient();
      const classesRes = await rpcClient.api["classes"].$get();

      if (!classesRes.ok) {
        const errorData = await classesRes.json();
        throw new Error(errorData.message || "Failed to fetch classes");
      }

      const classes = await classesRes.json();
      return classes;
    },
  });

  const classesData = classesResponse?.data || [];

  const getClassName = (classId: string) => {
    if (classesLoading) return "Loading...";
    const classData = classesData.find((cls: any) => cls.id === classId);
    return classData?.name || "No assigned class";
  };

  const isLoading = isLoadingMember || teachersLoading;
  const error = teachersError;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col justify-center items-center py-20 space-y-6">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-300 rounded-full animate-spin animate-reverse"></div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-lg font-medium text-gray-700">
                Loading teachers...
              </p>
              <p className="text-sm text-gray-500">
                Please wait while we fetch teacher information
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-red-50 via-pink-50 to-red-100 border border-red-200 rounded-2xl p-8 text-center shadow-lg">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full mb-6 shadow-inner">
              <Award className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-red-800 mb-3">
              Failed to load teachers
            </h3>
            <p className="text-red-600 mb-6 max-w-md mx-auto">
              Error: {error.message}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const teachers = teachersData?.data || [];

  const filteredTeachers = teachers.filter(
    (teacher: any) =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.phoneNumber?.includes(searchTerm)
  );

  const sortedTeachers = [...filteredTeachers].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
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
        {/* Header */}
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
                    My Teachers Directory
                  </h1>
                  <p className="text-gray-600 text-lg">
                    Manage your teacher profiles and assignments
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-700">
                    {sortedTeachers.length} Teacher
                    {sortedTeachers.length !== 1 ? "s" : ""}
                  </span>
                </div>
                {/* {activeMember?.userId && (
                  <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-full">
                    <Award className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-semibold text-purple-700">
                      User: {activeMember.userId}
                    </span>
                  </div>
                )} */}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Teacher
              </Button>
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

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2 pr-8 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="name">Sort by Name</option>
                  <option value="recent">Sort by Recent</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search teachers by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {/* Create Teacher Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-lg relative mx-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Create New Teacher
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    placeholder="Enter phone number"
                    value={formData.phoneNumber}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    placeholder="Enter address"
                    value={formData.address}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div className="flex gap-3 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating..." : "Create Teacher"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Teachers Grid/List */}
        {sortedTeachers.length === 0 ? (
          <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20">
            <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <GraduationCap className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              {searchTerm ? "No Teachers Found" : "No Teachers Yet"}
            </h2>
            <p className="text-slate-600 text-lg mb-6">
              {searchTerm
                ? "No teachers match your search criteria."
                : "Get started by creating your first teacher profile."}
            </p>
            {!searchTerm && (
              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create First Teacher
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
                className={`group relative overflow-hidden border-0 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 rounded-3xl cursor-pointer ${
                  viewMode === "list" ? "flex flex-row gap-4 p-4" : ""
                }`}
                onClick={() =>
                  router.push(`/account/manage/teachers/${teacher.id}`)
                }
              >
                <CardHeader className="flex items-start gap-4">
                  <Avatar className="h-16 w-16 shadow-lg ring-4 ring-white group-hover:ring-blue-100 transition-all duration-300">
                    <AvatarImage src={teacher.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold text-lg">
                      {teacher.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-blue-700 transition-colors duration-200 mb-2">
                      {teacher.name}
                    </CardTitle>

                    {/* Contact Information */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>{teacher.email}</span>
                      </div>

                      {teacher.phoneNumber && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>{teacher.phoneNumber}</span>
                        </div>
                      )}

                      {teacher.address && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span>{teacher.address}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span>
                          Class:{" "}
                          {teacher.classId
                            ? getClassName(teacher.classId)
                            : "No assigned class"}
                        </span>
                      </div>
                    </div>

                    {/* Timestamps */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="grid grid-cols-1 gap-1 text-xs text-gray-400">
                        <div>
                          Created:{" "}
                          {new Date(
                            teacher.createdAt || ""
                          ).toLocaleDateString()}
                        </div>
                        {teacher.updatedAt && (
                          <div>
                            Updated:{" "}
                            {new Date(teacher.updatedAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                {/* Decorative Elements */}
                <div className="absolute -right-4 -top-4 w-16 h-16 rounded-full bg-gradient-to-br from-blue-200 to-purple-200 opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
              </Card>
            ))}
          </div>
        )}

        {/* Pagination Info */}
        {teachersData?.meta && (
          <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <p className="text-sm text-gray-600">
              Showing {teachersData.meta.totalCount} teacher
              {teachersData.meta.totalCount !== 1 ? "s" : ""}
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
