"use client";

import { ChildrensList } from "@/features/children/actions/get-children";
import { useGetClassById } from "@/features/classes/actions/get-class-by-id";
import { updateClass } from "@/features/classes/actions/update-class-action";
import { useGetLessonPlansByClassId } from "@/features/lessonPlans/actions/get-lessonPlans-by-class-id";
import { AddNewLessonPlan } from "@/features/lessonPlans/components/add-new-lessonPlans";
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
  const [selectedAdditionalTeachers, setSelectedAdditionalTeachers] =
    React.useState<string[]>([]);
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
    if (!selectedAdditionalTeachers.length || !classId) return;
    setAssignAdditionalTeacherLoading(true);
    setAssignAdditionalTeacherError("");
    try {
      const currentTeacherIds = Array.isArray(data?.teacherIds)
        ? data.teacherIds
        : [];
      const newTeacherIds = Array.from(
        new Set([...currentTeacherIds, ...selectedAdditionalTeachers])
      );
      await updateClass(classId, { teacherIds: newTeacherIds });
      refetch();
      setSelectedAdditionalTeachers([]);
    } catch (err: any) {
      setAssignAdditionalTeacherError(
        err.message || "Failed to assign teachers"
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
      refetch();
      setSelectedTeacher("");
    } catch (err: any) {
      setAssignError(err.message || "Failed to assign teacher");
    } finally {
      setAssignLoading(false);
    }
  };

  const { data, isLoading, isError, refetch } = useGetClassById(classId);

  // Lesson plans query for this specific class
  const lessonPlansQuery = useGetLessonPlansByClassId(classId, {
    page: 1,
    limit: 20,
    search: "",
    sort: "desc",
  });

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
                {/* <div className="flex items-center gap-4 text-blue-100">
                  <span>ID: {data?.id ?? "—"}</span>
                  <span>Nursery: {data?.nurseryId ?? "—"}</span>
                </div> */}
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
        <div className="grid md:grid-cols-3 gap-8">
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

            {/* Main teacher display */}
            {data?.mainTeacherId && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-1">Main Teacher</h3>
                <p className="text-blue-700">
                  {teachersQuery.data?.data?.find(
                    (teacher: any) => teacher.id === data?.mainTeacherId
                  )?.name || "Not assigned"}
                </p>
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

          {/* Assign Multiple Teachers Section */}
          <div className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-green-600 font-bold">👩‍🏫</span>
              </div>
              <h2 className="text-xl font-bold text-slate-800">
                Assign Additional Teachers
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
                        className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                      >
                        {teacher?.name || teacherId}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {teachersQuery.isLoading ? (
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                <div className="w-5 h-5 border-2 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
                <span className="text-green-700">Loading teachers...</span>
              </div>
            ) : teachersQuery.isError ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700">Failed to load teachers</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Select Teachers (Hold Ctrl/Cmd for multiple)
                  </label>
                  <select
                    multiple
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors min-h-[120px]"
                    value={selectedAdditionalTeachers}
                    onChange={(e) => {
                      const options = Array.from(e.target.selectedOptions);
                      setSelectedAdditionalTeachers(
                        options.map((opt) => opt.value)
                      );
                    }}
                    disabled={assignAdditionalTeacherLoading}
                  >
                    {teachersQuery.data?.data?.map((teacher: any) => (
                      <option
                        key={teacher.id}
                        value={teacher.id}
                        className="py-2"
                      >
                        {teacher.name || teacher.id}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-500 mt-1">
                    {selectedAdditionalTeachers.length} teachers selected
                  </p>
                </div>

                <button
                  className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-xl hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                  onClick={handleAssignAdditionalTeacher}
                  disabled={
                    assignAdditionalTeacherLoading ||
                    !selectedAdditionalTeachers.length
                  }
                >
                  {assignAdditionalTeacherLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Assigning...
                    </>
                  ) : (
                    <>👩‍🏫 Assign {selectedAdditionalTeachers.length} Teachers</>
                  )}
                </button>

                {assignAdditionalTeacherError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm">
                      {assignAdditionalTeacherError}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Lesson Plans Section */}
        <div className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <span className="text-orange-600 font-bold text-lg">📚</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">
                    Lesson Plans
                  </h2>
                  <p className="text-slate-600">
                    Manage lesson plans for this class
                  </p>
                </div>
              </div>
              <AddNewLessonPlan />
            </div>
          </div>

          <div className="p-6">
            {lessonPlansQuery.isLoading ? (
              <div className="flex items-center justify-center gap-3 p-8 bg-orange-50 rounded-lg">
                <div className="w-6 h-6 border-2 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
                <span className="text-orange-700 font-medium">
                  Loading lesson plans...
                </span>
              </div>
            ) : lessonPlansQuery.isError ? (
              <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 flex items-center gap-2">
                  <span className="text-red-500">⚠️</span>
                  Error loading lesson plans: {lessonPlansQuery.error?.message}
                </p>
              </div>
            ) : !lessonPlansQuery.data?.data ||
              lessonPlansQuery.data.data.length === 0 ? (
              <div className="text-center p-12 bg-slate-50 rounded-lg">
                <span className="text-6xl mb-4 block">📚</span>
                <h3 className="text-lg font-semibold text-slate-600 mb-2">
                  No Lesson Plans Yet
                </h3>
                <p className="text-slate-500 mb-4">
                  No lesson plans have been created for this class yet.
                </p>
                <AddNewLessonPlan />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-slate-600">
                    Showing {lessonPlansQuery.data.data.length} of{" "}
                    {lessonPlansQuery.data.meta?.totalCount || 0} lesson plans
                  </p>
                </div>

                <div className="grid gap-4">
                  {lessonPlansQuery.data.data.map((lessonPlan: any) => (
                    <div
                      key={lessonPlan.id}
                      className="p-6 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-orange-100 rounded-full">
                            <span className="text-orange-600 font-bold">
                              📖
                            </span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-800 text-lg">
                              {lessonPlan.title}
                            </h4>
                            <p className="text-sm text-slate-500 flex items-center gap-2">
                              <span>🕒</span>
                              {lessonPlan.createdAt
                                ? new Date(
                                    lessonPlan.createdAt
                                  ).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })
                                : "Date not available"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          {lessonPlan.teacherId && (
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                              👨‍🏫 Teacher: {lessonPlan.teacherId}
                            </span>
                          )}
                          {/* {lessonPlan.classId && (
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                              🏫 Class: {lessonPlan.classId}
                            </span>
                          )} */}
                        </div>
                      </div>

                      {lessonPlan.content && (
                        <div className="mt-4 p-4 bg-white rounded-lg border border-slate-200">
                          <h5 className="font-medium text-slate-700 mb-2 flex items-center gap-2">
                            <span>📝</span>
                            Content:
                          </h5>
                          <p className="text-slate-600 leading-relaxed">
                            {lessonPlan.content}
                          </p>
                        </div>
                      )}

                      <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                        <div className="flex items-center gap-4">
                          <span>ID: {lessonPlan.id}</span>
                          {/* {lessonPlan.organizationId && (
                            <span>Org: {lessonPlan.organizationId}</span>
                          )} */}
                        </div>
                        {lessonPlan.updatedAt &&
                          lessonPlan.updatedAt !== lessonPlan.createdAt && (
                            <span>
                              Updated:{" "}
                              {new Date(
                                lessonPlan.updatedAt
                              ).toLocaleDateString()}
                            </span>
                          )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination info */}
                {lessonPlansQuery.data.meta &&
                  lessonPlansQuery.data.meta.totalCount >
                    lessonPlansQuery.data.data.length && (
                    <div className="text-center py-4 text-slate-500">
                      <p>
                        Showing {lessonPlansQuery.data.data.length} of{" "}
                        {lessonPlansQuery.data.meta.totalCount} lesson plans
                      </p>
                      <button className="mt-2 px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg transition-colors">
                        Load More
                      </button>
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
