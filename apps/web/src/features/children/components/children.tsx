"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import { Button } from "@repo/ui/components/button";
import { CardContent, CardHeader, CardTitle } from "@repo/ui/components/card";
import {
  Award,
  ChevronDown,
  Eye,
  GraduationCap,
  Grid3X3,
  List,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { createChildren } from "@/features/children/actions/create-children";
import { ChildrensList as useChildrensList } from "@/features/children/actions/get-children";

export function ChildrensList() {
  const [selectedChild, setSelectedChild] = useState<any>(null);
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"name" | "children" | "recent">("name");

  const { data, isLoading, error } = useChildrensList({});

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    organizationId: "",
    nurseryId: "",
    parentId: "",
    classId: "",
    dateOfBirth: "",
    gender: "",
    emergencyContact: "",
    medicalNotes: "",
    profileImageUrl: "",
    imagesUrl: "",
    activities: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      await createChildren(formData);
      setIsModalOpen(false);
      setFormData({
        name: "",
        email: "",
        phoneNumber: "",
        address: "",
        avatar: "",
      });
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to create children");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center py-20 space-y-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-300 rounded-full animate-spin animate-reverse"></div>
        </div>
        <div className="text-center space-y-2">
          <p className="text-lg font-medium text-gray-700">
            Loading childrens...
          </p>
          <p className="text-sm text-gray-500">
            Please wait while we fetch children information
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-red-50 via-pink-50 to-red-100 border border-red-200 rounded-2xl p-8 text-center shadow-lg">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full mb-6 shadow-inner">
          <Award className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-xl font-bold text-red-800 mb-3">
          Failed to load childrens
        </h3>
        <p className="text-red-600 mb-6 max-w-md mx-auto">
          Error: {error.message}
        </p>
      </div>
    );
  }

  const childrensData = data?.data || [];

  const filteredChildrens = childrensData.filter(
    (children: any) =>
      children.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      children.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      children.phoneNumber?.includes(searchTerm) ||
      children.children?.some(
        (child: any) =>
          child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          child.class.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const sortedChildrens = [...filteredChildrens].sort((a, b) => {
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
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
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
                  Childrens Directory
                </h1>
                <p className="text-gray-600 text-lg">
                  Manage educator profiles and student assignments
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-700">
                  {sortedChildrens.length} Children
                  {sortedChildrens.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-full">
                <Award className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-semibold text-purple-700">
                  {sortedChildrens.reduce(
                    (acc, t) => acc + (t.children?.length || 0),
                    0
                  )}{" "}
                  Students
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
            >
              + Create Children
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
                <option value="children">Sort by Students</option>
                <option value="recent">Sort by Recent</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Create Children Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-lg relative">
              <h2 className="text-2xl font-bold mb-4">Create New Children</h2>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2"
                  required
                />

                <input
                  type="date"
                  name="dateOfBirth"
                  placeholder="Date of Birth"
                  value={formData.dateOfBirth}
                  onChange={handleFormChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2"
                />
                <input
                  type="text"
                  name="gender"
                  placeholder="Gender"
                  value={formData.gender}
                  onChange={handleFormChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2"
                />
                <input
                  type="text"
                  name="emergencyContact"
                  placeholder="Emergency Contact"
                  value={formData.emergencyContact}
                  onChange={handleFormChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2"
                />
                <input
                  type="text"
                  name="medicalNotes"
                  placeholder="Medical Notes"
                  value={formData.medicalNotes}
                  onChange={handleFormChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2"
                />
                <input
                  type="text"
                  name="profileImageUrl"
                  placeholder="Profile Image URL"
                  value={formData.profileImageUrl}
                  onChange={handleFormChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2"
                />
                <input
                  type="text"
                  name="imagesUrl"
                  placeholder="Images URL"
                  value={formData.imagesUrl}
                  onChange={handleFormChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2"
                />
                <input
                  type="text"
                  name="activities"
                  placeholder="Activities"
                  value={formData.activities}
                  onChange={handleFormChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2"
                />
                <div className="flex justify-end gap-4 mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save Children"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Childrens Cards */}
        <div
          className={
            viewMode === "grid"
              ? "grid gap-8 md:grid-cols-2 xl:grid-cols-3"
              : "space-y-6"
          }
        >
          {sortedChildrens.map((children: any) => (
            <div
              key={children.id}
              className={`group relative overflow-hidden border-0 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 rounded-3xl cursor-pointer ${viewMode === "list" ? "flex flex-row gap-4 p-4" : ""}`}
              onClick={() =>
                router.push(`/account/manage/children/${children.id}`)
              }
            >
              <CardHeader className="flex items-center gap-4">
                <Avatar className="h-16 w-16 shadow-lg ring-4 ring-white group-hover:ring-blue-100 transition-all duration-300">
                  <AvatarImage src={children.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold text-lg">
                    {children.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-blue-700 transition-colors duration-200">
                    {children.name}
                  </CardTitle>
                  <p className="text-sm text-gray-600">{children.email}</p>
                  <p className="text-sm text-gray-600">
                    {children.phoneNumber}
                  </p>
                  <p className="text-sm text-gray-600">{children.address}</p>
                  <p className="text-xs text-gray-400">
                    Organization: {children.organizationId}
                  </p>
                  <p className="text-xs text-gray-400">
                    Created: {new Date(children.createdAt).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400">
                    Updated: {new Date(children.updatedAt).toLocaleString()}
                  </p>
                </div>
              </CardHeader>

              {children.children && children.children.length > 0 && (
                <CardContent className="mt-4">
                  <h4 className="font-semibold mb-2">
                    Students ({children.children.length})
                  </h4>
                  <div className="space-y-2">
                    {children.children.map((child: any) => (
                      <div
                        key={child.id}
                        className="flex items-center justify-between p-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/account/manage/children/${child.id}`);
                        }}
                      >
                        <div className="text-sm font-medium">
                          {child.name} ({child.class})
                        </div>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 shadow-sm hover:shadow-md text-xs px-3"
                        >
                          <Eye className="h-3 w-3 mr-2" /> View
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
