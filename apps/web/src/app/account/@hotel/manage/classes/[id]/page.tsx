"use client";

import { ChildrensList } from "@/features/children/actions/get-children";
import { useGetClassById } from "@/features/classes/actions/get-class-by-id";
import { updateClass } from "@/features/classes/actions/update-class-action";
import { TeachersList } from "@/features/teachers/actions/get-teacher";
import { useParams } from "next/navigation";
import * as React from "react";

export default function ClassDetailPage() {
  // Children assignment state
  const [selectedChild, setSelectedChild] = React.useState<string>("");
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
    if (!selectedChild || !classId) return;
    setAssignChildLoading(true);
    setAssignChildError("");
    try {
      // Add childId to class.childIds (append to existing array)
      const currentChildIds = Array.isArray(data?.childIds)
        ? data.childIds
        : [];
      const newChildIds = currentChildIds.includes(selectedChild)
        ? currentChildIds
        : [...currentChildIds, selectedChild];
      await updateClass(classId, { childIds: newChildIds });
      refetch();
    } catch (err: any) {
      setAssignChildError(err.message || "Failed to assign child");
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
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-8">
      {/* Inline Class Details Card */}
      <div className="border rounded p-4 bg-white shadow w-full max-w-md mb-6">
        <div className="font-semibold text-lg mb-2">
          {data?.name || data?.id || "Unnamed class"}
        </div>
        <div className="text-xs text-muted-foreground mb-1">
          ID: {data?.id ?? "—"}
        </div>
        <div className="text-xs mb-1">
          Main Teacher: {data?.mainTeacherId ?? "—"}
        </div>
        <div className="text-xs mb-1">
          Teachers: {data?.teacherIds?.length ?? 0}
        </div>
        <div className="text-xs mb-1">
          Children: {data?.childIds?.length ?? 0}
        </div>
        <div className="text-xs mb-1">Nursery ID: {data?.nurseryId ?? "—"}</div>
        <div className="text-xs mb-1">
          Created:{" "}
          {data?.createdAt ? new Date(data.createdAt).toLocaleString() : "—"}
        </div>
        <div className="text-xs mb-1">
          Updated:{" "}
          {data?.updatedAt ? new Date(data.updatedAt).toLocaleString() : "—"}
        </div>
        {isLoading && (
          <div className="text-sm text-muted-foreground">Loading...</div>
        )}
        {isError && (
          <div className="text-sm text-destructive">Failed to load class.</div>
        )}
        {!data && !isLoading && !isError && (
          <div className="text-sm text-muted-foreground">No class found.</div>
        )}
        <button
          className="mt-2 px-2 py-1 border rounded"
          onClick={() => refetch()}
        >
          Refresh
        </button>
      </div>
      {/* Assign Main Teacher Section */}
      {/* Assign Children Section */}
      <section className="w-full max-w-md bg-white rounded shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Assign Children</h2>
        {childrenQuery.isLoading ? (
          <div className="text-sm text-muted-foreground">
            Loading children...
          </div>
        ) : childrenQuery.isError ? (
          <div className="text-sm text-destructive">
            Failed to load children.
          </div>
        ) : (
          <div className="flex gap-2 items-center">
            <select
              className="border rounded px-2 py-1 text-sm"
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
              disabled={assignChildLoading}
            >
              <option value="">Select child</option>
              {childrenQuery.data?.data?.map((child: any) => (
                <option key={child.id} value={child.id}>
                  {child.name || child.id}
                </option>
              ))}
            </select>
            <button
              className="bg-green-600 text-white px-4 py-1 rounded disabled:opacity-50"
              onClick={handleAssignChild}
              disabled={assignChildLoading || !selectedChild}
            >
              {assignChildLoading ? "Assigning..." : "Assign"}
            </button>
          </div>
        )}
        {assignChildError && (
          <div className="text-xs text-destructive mt-2">
            {assignChildError}
          </div>
        )}
      </section>
      <section className="w-full max-w-md bg-white rounded shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Assign Main Teacher</h2>
        {teachersQuery.isLoading ? (
          <div className="text-sm text-muted-foreground">
            Loading teachers...
          </div>
        ) : teachersQuery.isError ? (
          <div className="text-sm text-destructive">
            Failed to load teachers.
          </div>
        ) : (
          <div className="flex gap-2 items-center">
            <select
              className="border rounded px-2 py-1 text-sm"
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
              disabled={assignLoading}
            >
              <option value="">Select teacher</option>
              {teachersQuery.data?.data?.map((teacher: any) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name || teacher.id}
                </option>
              ))}
            </select>
            <button
              className="bg-blue-600 text-white px-4 py-1 rounded disabled:opacity-50"
              onClick={handleAssignTeacher}
              disabled={assignLoading || !selectedTeacher}
            >
              {assignLoading ? "Assigning..." : "Assign"}
            </button>
          </div>
        )}
        {assignError && (
          <div className="text-xs text-destructive mt-2">{assignError}</div>
        )}
      </section>
    </main>
  );
}
