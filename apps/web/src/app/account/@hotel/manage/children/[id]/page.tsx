"use client";
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
import { useParams } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const params = useParams();
  const id = params?.id as string;
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

  if (isLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }
  if (error) {
    return (
      <div className="p-8 text-center text-red-600">Error: {error.message}</div>
    );
  }
  if (!children) {
    return <div className="p-8 text-center">No details found.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <Card className="max-w-lg w-full bg-white/80 rounded-3xl shadow-xl p-8 mb-8">
        <CardHeader className="flex items-center gap-4">
          <Avatar className="h-20 w-20 shadow-lg ring-4 ring-white">
            <AvatarImage src={children.avatar || "/placeholder.svg"} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold text-lg">
              {children.name
                .split(" ")
                .map((n: string) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              {children.name}
            </CardTitle>
            <p className="text-sm text-gray-600">{children.email}</p>
            <p className="text-sm text-gray-600">{children.phoneNumber}</p>
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
        <CardContent className="mt-4">
          <h4 className="font-semibold mb-2">Details</h4>
          <ul className="space-y-1 text-gray-700">
            <li>Date of Birth: {children.dateOfBirth}</li>
            <li>Gender: {children.gender}</li>
            <li>Emergency Contact: {children.emergencyContact}</li>
            <li>Medical Notes: {children.medicalNotes}</li>
            <li>Activities: {children.activities}</li>
          </ul>
        </CardContent>
      </Card>

      {/* Assign Class Section */}
      <Card className="max-w-lg w-full bg-white/80 rounded-3xl shadow-xl p-8 mb-8">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800">
            Assign Class
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isClassesLoading ? (
            <div>Loading classes...</div>
          ) : classesError ? (
            <div className="text-red-600">Error loading classes</div>
          ) : (
            <>
              <select
                className="w-full border border-gray-300 rounded-xl px-4 py-2 mb-4"
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
              >
                <option value="">Select a class</option>
                {classes.map((cls: any) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                onClick={handleAssignClass}
                disabled={assignLoading || !selectedClassId}
              >
                {assignLoading ? "Assigning..." : "Assign Class"}
              </button>
              {assignError && (
                <div className="text-red-600 mt-2">{assignError}</div>
              )}
              {assignSuccess && (
                <div className="text-green-600 mt-2">
                  Class assigned successfully!
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Assign Parent Section */}
      <Card className="max-w-lg w-full bg-white/80 rounded-3xl shadow-xl p-8">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800">
            Assign Parent
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isParentsLoading ? (
            <div>Loading parents...</div>
          ) : parentsError ? (
            <div className="text-red-600">Error loading parents</div>
          ) : (
            <>
              <select
                className="w-full border border-gray-300 rounded-xl px-4 py-2 mb-4"
                value={selectedParentId}
                onChange={(e) => setSelectedParentId(e.target.value)}
              >
                <option value="">Select a parent</option>
                {parents.map((parent: any) => (
                  <option key={parent.id} value={parent.id}>
                    {parent.name}
                  </option>
                ))}
              </select>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
                onClick={handleAssignParent}
                disabled={assignParentLoading || !selectedParentId}
              >
                {assignParentLoading ? "Assigning..." : "Assign Parent"}
              </button>
              {assignParentError && (
                <div className="text-red-600 mt-2">{assignParentError}</div>
              )}
              {assignParentSuccess && (
                <div className="text-green-600 mt-2">
                  Parent assigned successfully!
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
