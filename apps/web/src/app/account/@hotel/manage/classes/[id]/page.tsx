"use client";

import { ChildrensList } from "@/features/children/actions/get-children";
import { useGetClassById } from "@/features/classes/actions/get-class-by-id";
import { updateClass } from "@/features/classes/actions/update-class-action";
import { TeachersList } from "@/features/teachers/actions/get-teacher";
import { useParams } from "next/navigation";
import * as React from "react";

export default function ClassDetailPage() {
  // Children assignment state
  const [selectedChildren, setSelectedChildren] = React.useState<string[]>([]);
  const [assignChildLoading, setAssignChildLoading] = React.useState(false);
  const [assignChildError, setAssignChildError] = React.useState<string>("");
  const childrenQuery = ChildrensList({ page: 1, limit: 50 });

  // Assign additional teacher state
  const [selectedAdditionalTeacher, setSelectedAdditionalTeacher] =
    React.useState<string>("");
  const [assignAdditionalTeacherLoading, setAssignAdditionalTeacherLoading] =
    React.useState(false);
  const [assignAdditionalTeacherError, setAssignAdditionalTeacherError] =
    React.useState<string>("");
  const handleAssignChild = async () => {
    if (!selectedChildren.length || !classId) return;
    setAssignChildLoading(true);
    setAssignChildError("");
    try {
      // Add childIds to class.childIds (append to existing array)
      const currentChildIds = Array.isArray(data?.childIds)
        ? data.childIds
        : [];
      const newChildIds = Array.from(
        new Set([...currentChildIds, ...selectedChildren])
      );
      await updateClass(classId, { childIds: newChildIds });
      refetch();
      setSelectedChildren([]);
    } catch (err: any) {
      setAssignChildError(err.message || "Failed to assign children");
    } finally {
      setAssignChildLoading(false);
    }
  };
  const params = useParams();
  const classId = params?.id as string;

  // Section state
  const [selectedTeacher, setSelectedTeacher] = React.useState<string>("");
  const [assignLoading, setAssignLoading] = React.useState(false);
  const teachersQuery = TeachersList({ page: 1, limit: 50 });
  const [assignError, setAssignError] = React.useState<string>("");
  // Handler to assign additional teacher (append to teacherIds)
  const handleAssignAdditionalTeacher = async () => {
    if (!selectedAdditionalTeacher || !classId) return;
    setAssignAdditionalTeacherLoading(true);
    setAssignAdditionalTeacherError("");
    try {
      const currentTeacherIds = Array.isArray(data?.teacherIds)
        ? data.teacherIds
        : [];
      const newTeacherIds = currentTeacherIds.includes(
        selectedAdditionalTeacher
      )
        ? currentTeacherIds
        : [...currentTeacherIds, selectedAdditionalTeacher];
      await updateClass(classId, { teacherIds: newTeacherIds });
      refetch();
    } catch (err: any) {
      setAssignAdditionalTeacherError(
        err.message || "Failed to assign teacher"
      );
    } finally {
      setAssignAdditionalTeacherLoading(false);
    }
  };

  const handleAssignTeacher = async () => {
    if (!selectedTeacher || !classId) return;
    setAssignLoading(true);
    setAssignError("");
    try {
      await updateClass(classId, { mainTeacherId: selectedTeacher });
      // Optionally, refetch class details here
    } catch (err: any) {
      setAssignError(err.message || "Failed to assign teacher");
    } finally {
      setAssignLoading(false);
    }
  };

  const { data, isLoading, isError, refetch } = useGetClassById(classId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Class Management
          </h1>
          <p className="text-slate-600">Manage class details and assignments</p>
        </div>

        {/* Class Details Card */}
        <div className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
            <div className="flex items-center gap-6">
              <div className="h-20 w-20 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {data?.name?.charAt(0) || "C"}
                </span>
              </div>
              <div className="text-white">
                <h2 className="text-3xl font-bold mb-1">
                  {data?.name || "Unnamed Class"}
                </h2>
                <div className="flex items-center gap-4 text-blue-100">
                  <span>ID: {data?.id ?? "—"}</span>
                  <span>Nursery: {data?.nurseryId ?? "—"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-blue-50 p-4 rounded-xl">
                <h4 className="font-semibold text-blue-800 mb-1">
                  Main Teacher
                </h4>
                <p className="text-blue-600">
                  {data?.mainTeacherId ?? "Not assigned"}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-xl">
                <h4 className="font-semibold text-green-800 mb-1">Teachers</h4>
                <p className="text-green-600">
                  {data?.teacherIds?.length ?? 0}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-xl">
                <h4 className="font-semibold text-purple-800 mb-1">Children</h4>
                <p className="text-purple-600">{data?.childIds?.length ?? 0}</p>
              </div>
              <div className="bg-amber-50 p-4 rounded-xl">
                <h4 className="font-semibold text-amber-800 mb-1">Status</h4>
                <p className="text-amber-600">
                  {isLoading ? "Loading..." : isError ? "Error" : "Active"}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-200">
              <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-500">
                <div>
                  <span className="font-medium">Created:</span>{" "}
                  {data?.createdAt
                    ? new Date(data.createdAt).toLocaleDateString()
                    : "—"}
                </div>
                <div>
                  <span className="font-medium">Updated:</span>{" "}
                  {data?.updatedAt
                    ? new Date(data.updatedAt).toLocaleDateString()
                    : "—"}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Assignment Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Assign Children Section */}
          <div className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-purple-600 font-bold">👶</span>
              </div>
              <h2 className="text-xl font-bold text-slate-800">
                Assign Children
              </h2>
            </div>

            {/* Currently assigned children */}
            {data?.childIds && data.childIds.length > 0 && (
              <div className="mb-6">
                <h3 className="font-medium text-slate-700 mb-3">
                  Currently Assigned ({data.childIds.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {data.childIds.map((childId: string) => {
                    const child = childrenQuery.data?.data?.find(
                      (c: any) => c.id === childId
                    );
                    return (
                      <span
                        key={childId}
                        className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                      >
                        {child?.name || childId}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {childrenQuery.isLoading ? (
              <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                <div className="w-5 h-5 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                <span className="text-purple-700">Loading children...</span>
              </div>
            ) : childrenQuery.isError ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700">Failed to load children</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Select Children (Hold Ctrl/Cmd for multiple)
                  </label>
                  <select
                    multiple
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors min-h-[120px]"
                    value={selectedChildren}
                    onChange={(e) => {
                      const options = Array.from(e.target.selectedOptions);
                      setSelectedChildren(options.map((opt) => opt.value));
                    }}
                    disabled={assignChildLoading}
                  >
                    {childrenQuery.data?.data?.map((child: any) => (
                      <option key={child.id} value={child.id} className="py-2">
                        {child.name || child.id}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-500 mt-1">
                    {selectedChildren.length} children selected
                  </p>
                </div>

                <button
                  className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium rounded-xl hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                  onClick={handleAssignChild}
                  disabled={assignChildLoading || !selectedChildren.length}
                >
                  {assignChildLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Assigning...
                    </>
                  ) : (
                    <>👶 Assign {selectedChildren.length} Children</>
                  )}
                </button>

                {assignChildError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm">{assignChildError}</p>
                  </div>
                )}
              </div>
            )}
          </div>
          {/* Assign Main Teacher Section */}
          <div className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-blue-600 font-bold">👨‍🏫</span>
              </div>
              <h2 className="text-xl font-bold text-slate-800">
                Assign Main Teacher
              </h2>
            </div>

            {/* Currently assigned teachers */}
            {data?.teacherIds && data.teacherIds.length > 0 && (
              <div className="mb-6">
                <h3 className="font-medium text-slate-700 mb-3">
                  Currently Assigned Teachers ({data.teacherIds.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {data.teacherIds.map((teacherId: string) => {
                    const teacher = teachersQuery.data?.data?.find(
                      (t: any) => t.id === teacherId
                    );
                    return (
                      <span
                        key={teacherId}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {teacher?.name || teacherId}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Main teacher display */}
            {data?.mainTeacherId && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-1">Main Teacher</h3>
                <p className="text-blue-700">{data.mainTeacherId}</p>
              </div>
            )}

            {teachersQuery.isLoading ? (
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                <div className="w-5 h-5 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <span className="text-blue-700">Loading teachers...</span>
              </div>
            ) : teachersQuery.isError ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700">Failed to load teachers</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Select Main Teacher
                  </label>
                  <select
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={selectedTeacher}
                    onChange={(e) => setSelectedTeacher(e.target.value)}
                    disabled={assignLoading}
                  >
                    <option value="">Choose a teacher...</option>
                    {teachersQuery.data?.data?.map((teacher: any) => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.name || teacher.id}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                  onClick={handleAssignTeacher}
                  disabled={assignLoading || !selectedTeacher}
                >
                  {assignLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Assigning...
                    </>
                  ) : (
                    <>👨‍🏫 Assign Main Teacher</>
                  )}
                </button>

                {assignError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm">{assignError}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
