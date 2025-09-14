"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import { Button } from "@repo/ui/components/button";
import { CardHeader, CardTitle } from "@repo/ui/components/card";
import { useQuery } from "@tanstack/react-query";
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
import { useEffect, useState } from "react";

import { createChildren } from "@/features/children/actions/create-children";
import { ChildrensList as useChildrensList } from "@/features/children/actions/get-children";
import { getClient } from "@/lib/rpc/client";

const useGetClassById = async (classId: string) => {
  // Placeholder implementation for fetching class by ID
  return { data: { name: "Sample Class" } };
};

const useGetParentById = (parentId: string) => {
  // Placeholder implementation for fetching parent by ID
  return {
    data: { name: "Sample Parent" },
    isLoading: false,
    error: null,
  };
};

export function ChildrensList() {
  const [selectedChild, setSelectedChild] = useState<any>(null);
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"name" | "children" | "recent">("name");

  const { data, isLoading, error } = useChildrensList({});

  const childrensData = data?.data || [];

  // Fetch all classes
  const {
    data: classesResponse,
    isLoading: classesLoading,
    error: classesError,
  } = useQuery({
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

  const getClassName = (classId: string): string => {
    if (classesLoading) return "Loading...";
    const classData = classesData.find(
      (cls: { id: string }) => cls.id === classId
    );
    return classData?.name || "No assigned class";
  };

  // Fetch all badges
  const {
    data: badgesResponse,
    isLoading: badgesLoading,
    error: badgesError,
  } = useQuery({
    queryKey: ["all-badges"],
    queryFn: async () => {
      const rpcClient = await getClient();
      const badgesRes = await rpcClient.api["badges"].$get();

      if (!badgesRes.ok) {
        const errorData = await badgesRes.json();
        throw new Error(errorData.message || "Failed to fetch badges");
      }

      const badges = await badgesRes.json();
      return badges;
    },
  });

  const badgesData = badgesResponse?.data || [];

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
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to create children");
    } finally {
      setIsSubmitting(false);
    }
  };

  const [classNames, setClassNames] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchClassNames = async () => {
      const classIdMap: Record<string, string> = { ...classNames };
      const classIdsToFetch = childrensData
        .map((child) => child.classId)
        .filter((classId) => classId && !classIdMap[classId]);

      if (classIdsToFetch.length === 0) return;

      for (const classId of classIdsToFetch) {
        try {
          const { data } = await useGetClassById(classId);
          classIdMap[classId] = data?.name || "Unknown class";
        } catch {
          classIdMap[classId] = "Error fetching class";
        }
      }

      setClassNames(classIdMap);
    };

    fetchClassNames();
  }, [childrensData, classNames]);

  // Add a function to fetch parent names based on parent ID
  const getParentName = (parentId: string): string => {
    if (!parentId) return "No assigned parent";
    const {
      data: parentData,
      isLoading: parentLoading,
      error: parentError,
    } = useGetParentById(parentId);

    if (parentLoading) return "Loading...";
    if (parentError) return "Error fetching parent";

    return parentData?.name || "Unknown parent";
  };

  const getBadgeName = (badgeId: string): string => {
    if (badgesLoading) return "Loading...";
    const badgeData = badgesData.find(
      (badge: { id: string }) => badge.id === badgeId
    );
    return badgeData?.title || "No badge assigned";
  };

  if (isLoading || classesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex flex-col justify-center items-center py-20 space-y-8">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-pink-400 rounded-full animate-spin animate-reverse"></div>
          <div className="absolute inset-2 w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 blur-sm"></div>
        </div>
        <div className="text-center space-y-3">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Loading Children...
          </h3>
          <p className="text-slate-600 text-lg">
            Please wait while we fetch children information
          </p>
          <div className="flex gap-2 justify-center text-sm text-slate-500 mt-4">
            <span>👶 Students</span>
            <span>•</span>
            <span>📚 Profiles</span>
            <span>•</span>
            <span>🎓 Education</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || classesError) {
    return (
      <div className="bg-gradient-to-br from-red-50 via-pink-50 to-red-100 border border-red-200 rounded-2xl p-8 text-center shadow-lg">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full mb-6 shadow-inner">
          <Award className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-xl font-bold text-red-800 mb-3">
          Failed to load childrens
        </h3>
        <p className="text-red-600 mb-6 max-w-md mx-auto">
          Error: {error?.message || classesError?.message}
        </p>
      </div>
    );
  }

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
              {/* <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-full">
                <Award className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-semibold text-purple-700">
                  {sortedChildrens.reduce(
                    (acc, t) => acc + (t.children?.length || 0),
                    0
                  )}{" "}
                  Students
                </span>
              </div> */}
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
            <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
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
                {/* Profile Image Section */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Profile Picture
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="relative h-24 w-24 rounded-xl overflow-hidden border-2 border-gray-200">
                      {formData.profileImageUrl ? (
                        <img
                          src={formData.profileImageUrl}
                          alt="Profile preview"
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg";
                          }}
                        />
                      ) : (
                        <div className="h-full w-full bg-gray-50 flex items-center justify-center">
                          <Users className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            try {
                              // Create a temporary URL for preview
                              const previewUrl = URL.createObjectURL(file);
                              setFormData({
                                ...formData,
                                profileImageUrl: previewUrl,
                              });

                              // Here you would typically upload the file to your server
                              // const uploadedUrl = await uploadImage(file);
                              // setFormData({ ...formData, profileImageUrl: uploadedUrl });
                            } catch (error) {
                              console.error("Error uploading image:", error);
                              alert("Failed to upload profile image");
                            }
                          }
                        }}
                        className="hidden"
                        id="profile-image-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          document
                            .getElementById("profile-image-upload")
                            ?.click()
                        }
                        className="w-full"
                      >
                        Upload Profile Image
                      </Button>
                      <div className="relative">
                        <input
                          type="text"
                          name="profileImageUrl"
                          placeholder="or paste profile image URL"
                          value={formData.profileImageUrl}
                          onChange={handleFormChange}
                          className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm"
                        />
                        {formData.profileImageUrl && (
                          <Button
                            type="button"
                            variant="ghost"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-6 p-1 text-gray-400 hover:text-gray-600"
                            onClick={() =>
                              setFormData({ ...formData, profileImageUrl: "" })
                            }
                          >
                            ✕
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Images Section */}
                {/* <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Additional Images
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {formData.imagesUrl &&
                      formData.imagesUrl.split(",").map((url, index) => (
                        <div
                          key={index}
                          className="relative h-20 w-20 rounded-lg overflow-hidden border-2 border-gray-200"
                        >
                          <img
                            src={url.trim()}
                            alt={`Additional image ${index + 1}`}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.svg";
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const urls = formData.imagesUrl
                                .split(",")
                                .filter((_, i) => i !== index);
                              setFormData({
                                ...formData,
                                imagesUrl: urls.join(","),
                              });
                            }}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    <div className="h-20 w-20">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={async (e) => {
                          const files = Array.from(e.target.files || []);
                          if (files.length > 0) {
                            try {
                              // Create temporary URLs for preview
                              const previewUrls = files.map((file) =>
                                URL.createObjectURL(file)
                              );
                              const currentUrls = formData.imagesUrl
                                ? formData.imagesUrl.split(",")
                                : [];
                              setFormData({
                                ...formData,
                                imagesUrl: [
                                  ...currentUrls,
                                  ...previewUrls,
                                ].join(","),
                              });

                              // Here you would typically upload the files to your server
                              // const uploadedUrls = await Promise.all(files.map(file => uploadImage(file)));
                              // setFormData({ ...formData, imagesUrl: uploadedUrls.join(',') });
                            } catch (error) {
                              console.error("Error uploading images:", error);
                              alert("Failed to upload images");
                            }
                          }
                        }}
                        className="hidden"
                        id="additional-images-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          document
                            .getElementById("additional-images-upload")
                            ?.click()
                        }
                        className="w-full h-full flex flex-col items-center justify-center text-gray-500 border-2 border-dashed rounded-lg hover:bg-gray-50"
                      >
                        <span className="text-2xl mb-1">+</span>
                        <span className="text-xs">Add Images</span>
                      </Button>
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      name="imagesUrl"
                      placeholder="or paste comma-separated image URLs"
                      value={formData.imagesUrl}
                      onChange={handleFormChange}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm"
                    />
                    {formData.imagesUrl && (
                      <Button
                        type="button"
                        variant="ghost"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-6 p-1 text-gray-400 hover:text-gray-600"
                        onClick={() =>
                          setFormData({ ...formData, imagesUrl: "" })
                        }
                      >
                        ✕
                      </Button>
                    )}
                  </div>
                </div> */}
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
              className={`group relative overflow-hidden bg-white/90 backdrop-blur-md shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 rounded-3xl cursor-pointer border border-white/50 ${viewMode === "list" ? "flex flex-row gap-6 p-6" : "p-6"}`}
              onClick={() =>
                router.push(`/account/manage/children/${children.id}`)
              }
            >
              {/* Background Gradient Effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/60 via-purple-50/40 to-pink-50/60"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-200/20 to-transparent rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-200/20 to-transparent rounded-full blur-2xl"></div>

              <div className="relative z-10 space-y-6">
                {/* Header Section */}
                <CardHeader className="flex items-center gap-4 p-0">
                  <div className="relative">
                    <Avatar className="h-16 w-16 shadow-lg ring-4 ring-white/80 group-hover:ring-blue-200/80 transition-all duration-300">
                      <AvatarImage
                        src={children.avatar || "/placeholder.svg"}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white font-bold text-lg">
                        {children.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    {/* Active Status Indicator */}
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white shadow-md"></div>
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-blue-700 transition-colors duration-200 mb-2">
                      {children.name}
                    </CardTitle>
                    <div className="flex flex-wrap gap-2">
                      <div className="px-3 py-1 bg-blue-100/80 text-blue-700 rounded-full text-xs font-medium">
                        {getClassName(children.classId)}
                      </div>
                      {children.badgeId && (
                        <div className="px-3 py-1 bg-amber-100/80 text-amber-700 rounded-full text-xs font-medium flex items-center gap-1">
                          🏆 {getBadgeName(children.badgeId)}
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>

                {/* Contact Information */}
                {(children.email ||
                  children.phoneNumber ||
                  children.address) && (
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 space-y-3">
                    <h4 className="font-semibold text-gray-700 text-sm flex items-center gap-2">
                      📞 Contact Information
                    </h4>
                    <div className="space-y-2">
                      {children.email && (
                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
                          <span className="text-gray-600 truncate">
                            {children.email}
                          </span>
                        </div>
                      )}
                      {children.phoneNumber && (
                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
                          <span className="text-gray-600">
                            {children.phoneNumber}
                          </span>
                        </div>
                      )}
                      {children.address && (
                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-2 h-2 bg-purple-400 rounded-full flex-shrink-0"></div>
                          <span className="text-gray-600 truncate">
                            {children.address}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Timeline Information */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4">
                  <h4 className="font-semibold text-gray-700 text-sm flex items-center gap-2 mb-3">
                    📅 Timeline
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="space-y-1">
                      <span className="font-medium text-gray-600">Created</span>
                      <div className="text-gray-500">
                        {new Date(children.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="font-medium text-gray-600">Updated</span>
                      <div className="text-gray-500">
                        {new Date(children.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Students Section */}
                {children.children && children.children.length > 0 && (
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4">
                    <h4 className="font-semibold text-gray-700 text-sm flex items-center gap-2 mb-3">
                      👥 Students ({children.children.length})
                    </h4>
                    <div className="space-y-2">
                      {children.children.map((child: any) => (
                        <div
                          key={child.id}
                          className="flex items-center justify-between p-3 bg-white/80 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-white/60"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/account/manage/children/${child.id}`);
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                              {child.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-medium text-gray-700 truncate">
                                {child.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {child.class}
                              </div>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 text-white shadow-sm hover:shadow-md text-xs px-3 py-1 rounded-lg flex-shrink-0"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <div className="pt-2">
                  <Button
                    className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/account/manage/children/${children.id}`);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Profile
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
