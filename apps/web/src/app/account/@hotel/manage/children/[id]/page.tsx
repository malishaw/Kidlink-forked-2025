"use client";

import { BadgesList } from "@/features/badges/actions/get-badge.action";
import { ChildrensList as useChildrensList } from "@/features/children/actions/get-children";
import { updateChildren } from "@/features/children/actions/update-children";
import { useGetFeedbacksByChildId } from "@/features/feedback/actions/get-feedback-by-child";
import FeedbackForm from "@/features/feedback/components/feedback-form";
import { ChildrensList as useClassesList } from "@/features/nursery/actions/get-classes";
import { ParentsList as useParentsList } from "@/features/parents/actions/get-parent";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import {
  AlertCircle,
  Calendar,
  Camera,
  CheckCircle,
  Clock,
  GraduationCap,
  Heart,
  Mail,
  MessageSquare,
  Phone,
  Plus,
  Star,
  Users,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const params = useParams();
  const id = (params?.id as string) || "1";
  const { data, isLoading, error } = useChildrensList({});
  const children = data?.data?.find((c: any) => c.id === id);

  // Fetch feedbacks for this child
  const {
    data: feedbacksData,
    isLoading: isFeedbacksLoading,
    error: feedbacksError,
  } = useGetFeedbacksByChildId(id, { page: 1, limit: 20 });

  // Classes fetch
  const {
    data: classesData,
    isLoading: isClassesLoading,
    error: classesError,
  } = useClassesList({});
  const classes = classesData?.data || [];

  // Assign class state
  const [selectedClassId, setSelectedClassId] = useState(
    children?.classId || ""
  );
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignError, setAssignError] = useState("");
  const [assignSuccess, setAssignSuccess] = useState(false);

  // Assign parent state
  const [selectedParentId, setSelectedParentId] = useState(
    children?.parentId || ""
  );
  const [assignParentLoading, setAssignParentLoading] = useState(false);
  const [assignParentError, setAssignParentError] = useState("");
  const [assignParentSuccess, setAssignParentSuccess] = useState(false);

  // Get parents
  const {
    data: parentsData,
    isLoading: isParentsLoading,
    error: parentsError,
  } = useParentsList({});
  const parents = parentsData?.data || [];

  // Badges fetch
  const badgesQuery = BadgesList({ page: 1, limit: 50 });
  const [selectedBadgeId, setSelectedBadgeId] = useState("");
  const [assignBadgeLoading, setAssignBadgeLoading] = useState(false);
  const [assignBadgeError, setAssignBadgeError] = useState("");
  const [assignBadgeSuccess, setAssignBadgeSuccess] = useState(false);

  // Get current badges array, ensuring it's always an array
  const currentBadges = Array.isArray(children?.badgeId)
    ? children.badgeId
    : children?.badgeId
      ? [children.badgeId]
      : [];

  // Feedback form state
  const [isFeedbackFormOpen, setIsFeedbackFormOpen] = useState(false);

  // Badge selection modal state
  const [isBadgeSelectionOpen, setIsBadgeSelectionOpen] = useState(false);

  const handleAssignClass = async () => {
    setAssignLoading(true);
    setAssignError("");
    setAssignSuccess(false);
    try {
      await updateChildren(id, { ...children, classId: selectedClassId });
      setAssignSuccess(true);
    } catch (err: any) {
      setAssignError(err.message || "Failed to assign class");
    } finally {
      setAssignLoading(false);
    }
  };

  const handleAssignParent = async () => {
    setAssignParentLoading(true);
    setAssignParentError("");
    setAssignParentSuccess(false);
    try {
      // Find the selected parent by id
      const selectedParent = parents.find(
        (parent: any) => parent.id === selectedParentId
      );

      if (!selectedParent) {
        throw new Error("Selected parent not found");
      }

      // Check if the parent has a userId
      if (!selectedParent.userId) {
        throw new Error("Selected parent does not have a userId");
      }

      // Store the parent's userId in the child's parentId field
      await updateChildren(id, {
        ...children,
        parentId: selectedParent.userId,
      });
      setAssignParentSuccess(true);
    } catch (err: any) {
      setAssignParentError(err.message || "Failed to assign parent");
    } finally {
      setAssignParentLoading(false);
    }
  };

  const handleAssignBadge = async () => {
    setAssignBadgeLoading(true);
    setAssignBadgeError("");
    setAssignBadgeSuccess(false);
    try {
      // Add the new badge to existing badges array (avoid duplicates)
      const updatedBadges = currentBadges.includes(selectedBadgeId)
        ? currentBadges
        : [...currentBadges, selectedBadgeId];

      await updateChildren(id, { ...children, badgeId: updatedBadges });
      setAssignBadgeSuccess(true);
      setSelectedBadgeId(""); // Reset selection
      setIsBadgeSelectionOpen(false); // Close modal immediately
    } catch (err: any) {
      setAssignBadgeError(err.message || "Failed to assign badge");
    } finally {
      setAssignBadgeLoading(false);
    }
  };

  const handleRemoveBadge = async (badgeIdToRemove: string) => {
    setAssignBadgeLoading(true);
    setAssignBadgeError("");
    setAssignBadgeSuccess(false);
    try {
      // Remove the badge from existing badges array
      const updatedBadges = currentBadges.filter(
        (id) => id !== badgeIdToRemove
      );

      await updateChildren(id, { ...children, badgeId: updatedBadges });
      setAssignBadgeSuccess(true);

      // Reload the page to show updated data
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err: any) {
      setAssignBadgeError(err.message || "Failed to remove badge");
    } finally {
      setAssignBadgeLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading child details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 p-6">
        <Card className="max-w-md w-full border-red-200 bg-white shadow-lg">
          <CardContent className="flex flex-col items-center gap-4 p-8">
            <AlertCircle className="w-12 h-12 text-red-500" />
            <div className="text-center">
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Error Loading Data
              </h3>
              <p className="text-red-600">{error.message}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!children) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 p-6">
        <Card className="max-w-md w-full bg-white shadow-lg">
          <CardContent className="flex flex-col items-center gap-4 p-8">
            <Users className="w-12 h-12 text-slate-400" />
            <div className="text-center">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Child Not Found
              </h3>
              <p className="text-slate-600">No details found for this child.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Child Profile
          </h1>
          <p className="text-slate-600">
            Manage child information and assignments
          </p>
        </div>

        {/* Main Profile Card */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                <AvatarImage src={children.avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold text-xl">
                  {children.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="text-white">
                <h2 className="text-3xl font-bold mb-1">{children.name}</h2>
                <div className="flex items-center gap-2 text-blue-100 mb-1">
                  <Mail className="w-4 h-4" />
                  <span>{children.email}</span>
                </div>
                <div className="flex items-center gap-2 text-blue-100">
                  <Phone className="w-4 h-4" />
                  <span>{children.phoneNumber}</span>
                </div>
                {/* Display assigned badge name */}
                {/* {children.badgeId && badgesQuery.data?.data && (
                  <div className="flex items-center gap-2 mt-2 text-yellow-200">
                    <span className="inline-block w-5 h-5 bg-yellow-400 rounded-full"></span>
                    <span className="font-semibold">Badge:</span>
                    <span>
                      {badgesQuery.data.data.find(
                        (badge: any) => badge.id === children.badgeId
                      )?.name || children.badgeId}
                    </span>
                  </div>
                )} */}
              </div>
            </div>
          </div>

          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-500" />
                  Personal Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-slate-500" />
                    <div>
                      <p className="text-sm font-medium text-slate-600">
                        Date of Birth
                      </p>
                      <p className="text-slate-800">{children.dateOfBirth}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <Users className="w-5 h-5 text-slate-500" />
                    <div>
                      <p className="text-sm font-medium text-slate-600">
                        Gender
                      </p>
                      <p className="text-slate-800">{children.gender}</p>
                    </div>
                  </div>
                  {/* <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-slate-500" />
                    <div>
                      <p className="text-sm font-medium text-slate-600">
                        Address
                      </p>
                      <p className="text-slate-800">{children.address}</p>
                    </div>
                  </div> */}
                </div>
              </div>

              {/* Additional Details */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-500" />
                  Important Details
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm font-medium text-amber-800 mb-1">
                      Emergency Contact
                    </p>
                    <p className="text-amber-700">
                      {children.emergencyContact}
                    </p>
                  </div>
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm font-medium text-red-800 mb-1">
                      Medical Notes
                    </p>
                    <p className="text-red-700">{children.medicalNotes}</p>
                  </div>
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm font-medium text-green-800 mb-1">
                      Activities
                    </p>
                    <p className="text-green-700">{children.activities}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* System Information */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-500">
                {/* <div>
                  <span className="font-medium">Organization ID:</span>{" "}
                  {children.organizationId}
                </div> */}
                <div>
                  <span className="font-medium">Created:</span>{" "}
                  {new Date(children.createdAt).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-medium">Updated:</span>{" "}
                  {new Date(children.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assignment Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Assign Class Section */}
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <GraduationCap className="w-6 h-6 text-blue-600" />
                </div>
                Assign Class
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isClassesLoading ? (
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                  <div className="w-5 h-5 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                  <span className="text-blue-700">Loading classes...</span>
                </div>
              ) : classesError ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Error loading classes
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Select Class
                    </label>
                    <select
                      className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      value={selectedClassId}
                      onChange={(e) => setSelectedClassId(e.target.value)}
                    >
                      <option value="">Choose a class...</option>
                      {classes.map((cls: any) => (
                        <option key={cls.id} value={cls.id}>
                          {cls.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                    onClick={handleAssignClass}
                    disabled={assignLoading || !selectedClassId}
                  >
                    {assignLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Assigning...
                      </>
                    ) : (
                      <>
                        <GraduationCap className="w-4 h-4" />
                        Assign Class
                      </>
                    )}
                  </button>

                  {assignError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-700 text-sm flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {assignError}
                      </p>
                    </div>
                  )}

                  {assignSuccess && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-700 text-sm flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Class assigned successfully!
                      </p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Assign Parent Section */}
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                Assign Parent
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isParentsLoading ? (
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                  <div className="w-5 h-5 border-2 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
                  <span className="text-green-700">Loading parents...</span>
                </div>
              ) : parentsError ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Error loading parents
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Select Parent
                    </label>
                    <select
                      className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      value={selectedParentId}
                      onChange={(e) => setSelectedParentId(e.target.value)}
                    >
                      <option value="">Choose a parent...</option>
                      {parents.map((parent: any) => (
                        <option key={parent.id} value={parent.id}>
                          {parent.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                    onClick={handleAssignParent}
                    disabled={assignParentLoading || !selectedParentId}
                  >
                    {assignParentLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Assigning...
                      </>
                    ) : (
                      <>
                        <Users className="w-4 h-4" />
                        Assign Parent
                      </>
                    )}
                  </button>

                  {assignParentError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-700 text-sm flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {assignParentError}
                      </p>
                    </div>
                  )}

                  {assignParentSuccess && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-700 text-sm flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Parent assigned successfully!
                      </p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="w-full" >
                  {/* Manage Badges Section - Full Width */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="inline-block w-6 h-6 bg-yellow-400 rounded-full"></span>
              </div>
              Manage Badges
            </CardTitle>
          </CardHeader>
          <CardContent>
            {badgesQuery.isLoading ? (
              <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg">
                Loading badges...
              </div>
            ) : badgesQuery.isError ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                Failed to load badges.
              </div>
            ) : (
              <div className="space-y-4">
                {/* Current badges grid with add button */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {/* Show current badges */}
                  {currentBadges.map((badgeId: string) => {
                    const badge = badgesQuery.data?.data?.find((b: any) => b.id === badgeId);
                    if (!badge) return null;
                    return (
                      <div key={badgeId} className="relative group">
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden">
                          <div className="flex flex-col items-center justify-center gap-2 p-4">
                            <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                              {badge.iconUrl ? (
                                <img src={badge.iconUrl} alt={badge.title} className="w-12 h-12 rounded-full object-cover" />
                              ) : (
                                <span className="text-2xl text-white">🏅</span>
                              )}
                            </div>
                            <h3 className="text-xs font-bold text-slate-800 text-center truncate max-w-full">{badge.title}</h3>
                          </div>
                          {/* Remove button */}
                          <button
                            onClick={() => handleRemoveBadge(badgeId)}
                            className="absolute -top-0 -right-0 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                            disabled={assignBadgeLoading}
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {/* Add badge button */}
                  <div
                    onClick={() => setIsBadgeSelectionOpen(true)}
                    className="bg-white/70 backdrop-blur-sm rounded-2xl border-2 border-dashed border-gray-300 hover:border-yellow-400 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer group"
                  >
                    <div className="flex flex-col items-center justify-center align-ce gap-2 p-4 h-full min-h-[120px]">
                      <div className="w-16 h-16 rounded-full bg-yellow-50 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow shadow-amber-400">
                        <span className="text-2xl text-yellow-600 font-bold">+</span>
                      </div>
                      <span className="text-xs font-bold text-slate-600 group-hover:text-yellow-600 transition-colors">Add Badge</span>
                    </div>
                  </div>
                </div>

                {assignBadgeError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {assignBadgeError}
                    </p>
                  </div>
                )}
                {assignBadgeSuccess && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-700 text-sm flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Badge updated successfully!
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        </div>

        {/* Feedback Section */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <MessageSquare className="w-7 h-7 text-purple-600" />
                </div>
                Child Feedback History
                {feedbacksData?.data && (
                  <span className="text-sm font-normal text-slate-500 bg-purple-50 px-3 py-1 rounded-full">
                    {feedbacksData.data.length} feedback
                    {feedbacksData.data.length !== 1 ? "s" : ""}
                  </span>
                )}
              </CardTitle>
              <button
                onClick={() => setIsFeedbackFormOpen(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-xl font-semibold shadow-md transition-all duration-200 hover:shadow-lg"
              >
                <Plus className="w-4 h-4" />
                Add Feedback
              </button>
            </div>
          </CardHeader>
          <CardContent>
            {isFeedbacksLoading ? (
              <div className="flex items-center justify-center gap-3 p-8 bg-purple-50 rounded-lg">
                <div className="w-6 h-6 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                <span className="text-purple-700 font-medium">
                  Loading feedback history...
                </span>
              </div>
            ) : feedbacksError ? (
              <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Error loading feedback: {feedbacksError.message}
                </p>
              </div>
            ) : !feedbacksData?.data || feedbacksData.data.length === 0 ? (
              <div className="text-center p-12 bg-slate-50 rounded-lg">
                <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-600 mb-2">
                  No Feedback Yet
                </h3>
                <p className="text-slate-500">
                  This child hasn't received any feedback yet.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {feedbacksData.data.map((feedback: any) => (
                  <div
                    key={feedback.id}
                    className="p-6 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-full">
                          <MessageSquare className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-800">
                            Teacher Feedback
                          </h4>
                          <p className="text-sm text-slate-500 flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {new Date(feedback.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                      {feedback.rating && (
                        <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium text-yellow-700">
                            {feedback.rating}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Feedback Content */}
                    {feedback.teacherFeedback && (
                      <div className="mb-4 p-4 bg-white rounded-lg border border-slate-200">
                        <h5 className="font-medium text-slate-700 mb-2 flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Teacher's Feedback:
                        </h5>
                        <p className="text-slate-600 leading-relaxed">
                          {feedback.teacherFeedback}
                        </p>
                      </div>
                    )}

                    {/* Reply Section */}
                    {feedback.reply && (
                      <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h5 className="font-medium text-blue-700 mb-2 flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Reply:
                        </h5>
                        <p className="text-blue-600 leading-relaxed">
                          {feedback.reply}
                        </p>
                      </div>
                    )}

                    {/* Additional Content */}
                    {feedback.content && (
                      <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
                        <h5 className="font-medium text-green-700 mb-2">
                          Additional Notes:
                        </h5>
                        <p className="text-green-600 leading-relaxed">
                          {feedback.content}
                        </p>
                      </div>
                    )}

                    {/* Images Section */}
                    {feedback.images && feedback.images.length > 0 && (
                      <div className="mt-4">
                        <h5 className="font-medium text-slate-700 mb-3 flex items-center gap-2">
                          <Camera className="w-4 h-4" />
                          Attached Images:
                        </h5>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {feedback.images.map(
                            (image: string, index: number) => (
                              <div
                                key={index}
                                className="relative aspect-square rounded-lg overflow-hidden bg-slate-100 hover:scale-105 transition-transform duration-200 cursor-pointer"
                              >
                                <img
                                  src={image}
                                  alt={`Feedback image ${index + 1}`}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.src = "/placeholder.svg";
                                  }}
                                />
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {/* Footer with metadata */}
                    <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-4">
                        {feedback.teacherId && (
                          <span>Teacher ID: {feedback.teacherId}</span>
                        )}
                        {/* {feedback.organizationId && (
                          <span>Org: {feedback.organizationId}</span>
                        )} */}
                      </div>
                      {feedback.updatedAt &&
                        feedback.updatedAt !== feedback.createdAt && (
                          <span>
                            Updated:{" "}
                            {new Date(feedback.updatedAt).toLocaleDateString()}
                          </span>
                        )}
                    </div>
                  </div>
                ))}

                {/* Show pagination info if there are more feedbacks */}
                {feedbacksData.meta &&
                  feedbacksData.meta.totalCount > feedbacksData.data.length && (
                    <div className="text-center py-4 text-slate-500">
                      Showing {feedbacksData.data.length} of{" "}
                      {feedbacksData.meta.totalCount} feedback entries
                    </div>
                  )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Badge Selection Modal */}
      {isBadgeSelectionOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-800">Select Badges to Assign</h2>
                <button
                  onClick={() => setIsBadgeSelectionOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {badgesQuery.isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-600 rounded-full animate-spin"></div>
                    <span>Loading badges...</span>
                  </div>
                </div>
              ) : badgesQuery.isError ? (
                <div className="text-center py-12">
                  <p className="text-red-500">Failed to load badges. Please try again.</p>
                </div>
              ) : !badgesQuery.data?.data || badgesQuery.data.data.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <span className="text-4xl">🏅</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-3">No Badges Available</h3>
                  <p className="text-slate-600">Create badges first to assign them to children.</p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {badgesQuery.data.data
                    .filter((badge: any) => !currentBadges.includes(badge.id))
                    .map((badge: any) => (
                    <div key={badge.id} className="group cursor-pointer" onClick={() => {
                      setSelectedBadgeId(badge.id);
                      // Store the badge ID and close modal
                      const updatedBadges = [...currentBadges, badge.id];
                      updateChildren(id, { ...children, badgeId: updatedBadges })
                        .then(() => {
                          setAssignBadgeSuccess(true);
                          setIsBadgeSelectionOpen(false);
                          // Refresh page to show updated data
                          setTimeout(() => {
                            window.location.reload();
                          }, 1000);
                        })
                        .catch((err: any) => {
                          setAssignBadgeError(err.message || "Failed to assign badge");
                        });
                    }}>
                      <div className="relative bg-white/70 backdrop-blur-sm rounded-3xl border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] overflow-hidden">
                        {/* Decorative Background */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-200/20 to-transparent rounded-full blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-200/20 to-transparent rounded-full blur-2xl"></div>

                        <div className="flex flex-col items-center justify-center gap-3 p-6">
                          {/* Badge Circle */}
                          <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg transition-all duration-200 group-hover:scale-105 group-hover:shadow-xl">
                            {badge.iconUrl ? (
                              <img src={badge.iconUrl} alt={badge.title} className="w-24 h-24 rounded-full object-cover" />
                            ) : (
                              <span className="text-4xl text-white">🏅</span>
                            )}
                            <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>

                          {/* Badge Info */}
                          <div className="text-center">
                            <h3 className="text-sm font-bold text-slate-800 max-w-[7rem] truncate group-hover:text-amber-700 transition-colors">{badge.title}</h3>
                            <div className="flex items-center justify-center gap-2 mt-2">
                              <span className="text-xs px-2 py-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-full">{badge.level}</span>
                              <span className="text-xs text-slate-600">{badge.points} pts</span>
                            </div>
                          </div>

                          {/* Hover effect */}
                          <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Feedback Form Modal */}
      {isFeedbackFormOpen && (
        <FeedbackForm
          isOpen={isFeedbackFormOpen}
          onClose={() => setIsFeedbackFormOpen(false)}
          childId={params.id}
        />
      )}
    </div>
  );
}
