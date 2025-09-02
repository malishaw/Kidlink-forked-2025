"use client";

import { BadgesList } from "@/features/badges/actions/get-badge.action";
import { ChildrensList as useChildrensList } from "@/features/children/actions/get-children";
import { updateChildren } from "@/features/children/actions/update-children";
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
  CheckCircle,
  GraduationCap,
  Heart,
  Mail,
  MapPin,
  Phone,
  Users,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const params = useParams();
  const id = (params?.id as string) || "1";
  const { data, isLoading, error } = useChildrensList({});
  const children = data?.data?.find((c: any) => c.id === id);

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
      await updateChildren(id, { ...children, parentId: selectedParentId });
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
      await updateChildren(id, { ...children, badgeId: selectedBadgeId });
      setAssignBadgeSuccess(true);
    } catch (err: any) {
      setAssignBadgeError(err.message || "Failed to assign badge");
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
                {children.badgeId && badgesQuery.data?.data && (
                  <div className="flex items-center gap-2 mt-2 text-yellow-200">
                    <span className="inline-block w-5 h-5 bg-yellow-400 rounded-full"></span>
                    <span className="font-semibold">Badge:</span>
                    <span>
                      {badgesQuery.data.data.find(
                        (badge: any) => badge.id === children.badgeId
                      )?.name || children.badgeId}
                    </span>
                  </div>
                )}
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
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-slate-500" />
                    <div>
                      <p className="text-sm font-medium text-slate-600">
                        Address
                      </p>
                      <p className="text-slate-800">{children.address}</p>
                    </div>
                  </div>
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
                <div>
                  <span className="font-medium">Organization ID:</span>{" "}
                  {children.organizationId}
                </div>
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
        <div className="grid md:grid-cols-3 gap-8">
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

          {/* Assign Badge Section */}
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <span className="inline-block w-6 h-6 bg-yellow-400 rounded-full"></span>
                </div>
                Assign Badge
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {badgesQuery.isLoading ? (
                <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg">
                  Loading badges...
                </div>
              ) : badgesQuery.isError ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  Failed to load badges.
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Select Badge
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-xl px-4 py-2 mb-4"
                      value={selectedBadgeId}
                      onChange={(e) => setSelectedBadgeId(e.target.value)}
                    >
                      <option value="">Select a badge</option>
                      {badgesQuery.data?.data?.map((badge: any) => (
                        <option key={badge.id} value={badge.id}>
                          {badge.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    className="w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-medium rounded-xl hover:from-yellow-600 hover:to-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                    onClick={handleAssignBadge}
                    disabled={assignBadgeLoading || !selectedBadgeId}
                  >
                    {assignBadgeLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Assigning...
                      </>
                    ) : (
                      <>Assign Badge</>
                    )}
                  </button>
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
                        Badge assigned successfully!
                      </p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
