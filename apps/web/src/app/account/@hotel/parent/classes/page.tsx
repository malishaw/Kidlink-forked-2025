"use client";

import CreateClassForm from "@/features/classes/components/create-class-form";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // Fetch all classes
  const classesQuery = useQuery({
    queryKey: ["classes-list"],
    queryFn: async () => {
      const rpcClient = await import("@/lib/rpc/client").then((m) =>
        m.getClient()
      );
      const response = await rpcClient.api.classes.$get({});
      if (!response.ok) throw new Error("Failed to fetch classes");
      const json = await response.json();
      return Array.isArray(json.data) ? json.data : json;
    },
  });

  // Pre-fetch teacher data
  const teacherIds =
    classesQuery.data?.map((cls: any) => cls.mainTeacherId) || [];
  const uniqueTeacherIds = Array.from(new Set(teacherIds.filter(Boolean)));

  const teachersQuery = useQuery({
    queryKey: ["teachers", uniqueTeacherIds],
    queryFn: async () => {
      const rpcClient = await import("@/lib/rpc/client").then((m) =>
        m.getClient()
      );
      const teacherData = await Promise.all(
        uniqueTeacherIds.map(async (id) => {
          const response = await rpcClient.api.teacher[":id"].$get({
            param: { id },
          });
          if (!response.ok)
            throw new Error(`Failed to fetch teacher with ID: ${id}`);
          const json = await response.json();
          return { id, ...json };
        })
      );
      return teacherData.reduce(
        (acc, teacher) => {
          acc[teacher.id] = teacher;
          return acc;
        },
        {} as Record<string, { id: string; name: string }>
      );
    },
    enabled: uniqueTeacherIds.length > 0,
  });

  const handleCardClick = (id: string) => {
    router.push(`/account/manage/classes/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          {/* Left Side - Title and Description */}
          <div>
            <h1 className="text-4xl font-bold text-slate-800 mb-2">
              Class Management
            </h1>
            <p className="text-xl text-slate-600">
              Create and manage your classes
            </p>
          </div>

          {/* Right Side - Add Class Button */}
          <button
            onClick={() => setIsPanelOpen(true)}
            className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 inline-flex items-center gap-3"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add Class
          </button>
        </div>

        {/* Classes Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-800">All Classes</h2>
            <div className="text-sm text-slate-500">
              {classesQuery.data?.length || 0} classes total
            </div>
          </div>

          {classesQuery.isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="text-slate-600 font-medium">Loading classes...</p>
              </div>
            </div>
          ) : classesQuery.isError ? (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
                <div className="text-red-600 text-xl mb-2">⚠️</div>
                <h3 className="font-semibold text-red-800 mb-2">
                  Error Loading Classes
                </h3>
                <p className="text-red-600">
                  Failed to load classes. Please try again.
                </p>
              </div>
            </div>
          ) : classesQuery.data?.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 max-w-md mx-auto">
                <div className="text-slate-400 text-4xl mb-4">📚</div>
                <h3 className="font-semibold text-slate-800 mb-2">
                  No Classes Yet
                </h3>
                <p className="text-slate-600">
                  Create your first class to get started!
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {classesQuery.data.map((cls: any) => {
                const teacher = teachersQuery.data?.[cls.mainTeacherId];

                return (
                  <div
                    key={cls.id}
                    className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl p-6 cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
                    onClick={() => handleCardClick(cls.id)}
                  >
                    {/* Class Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-lg">
                          {cls.name?.charAt(0) || "C"}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-600 transition-colors">
                          {cls.name || `Class ${cls.id}`}
                        </h3>
                        {/* <p className="text-xs text-slate-500">ID: {cls.id}</p> */}
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="text-xs font-medium text-blue-600 mb-1">
                          Teachers
                        </div>
                        <div className="text-lg font-bold text-blue-800">
                          {cls.teacherIds?.length ?? 0}
                        </div>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <div className="text-xs font-medium text-purple-600 mb-1">
                          Children
                        </div>
                        <div className="text-lg font-bold text-purple-800">
                          {cls.childIds?.length ?? 0}
                        </div>
                      </div>
                    </div>

                    {/* Main Teacher */}
                    <div className="mb-4">
                      <div className="text-xs font-medium text-slate-600 mb-1">
                        Main Teacher
                      </div>
                      <div className="text-sm text-slate-800">
                        {teachersQuery.isLoading ? (
                          <span className="text-slate-400">Loading...</span>
                        ) : teacher ? (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                            {teacher.name}
                          </span>
                        ) : (
                          <span className="text-slate-400">Not assigned</span>
                        )}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-3 border-t border-slate-200">
                      <div className="text-xs text-slate-500">
                        Created{" "}
                        {cls.createdAt
                          ? new Date(cls.createdAt).toLocaleDateString()
                          : "—"}
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                          Active
                        </span>
                        <div className="text-blue-600 group-hover:text-blue-700 transition-colors">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Create Class Right Side Panel */}
        <CreateClassForm
          isOpen={isPanelOpen}
          onClose={() => setIsPanelOpen(false)}
          onSuccess={() => {
            setIsPanelOpen(false);
            classesQuery.refetch(); // Refresh the classes list
          }}
        />
      </div>
    </div>
  );
}
