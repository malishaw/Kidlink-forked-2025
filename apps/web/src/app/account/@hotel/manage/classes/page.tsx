"use client";

import CreateClassForm from "@/features/classes/components/create-class-form";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

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
      // If your API returns { data: [...] }, adjust accordingly
      return Array.isArray(json.data) ? json.data : json;
    },
  });

  const handleCardClick = (id: string) => {
    router.push(`/account/manage/classes/${id}`);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 space-y-8">
      {/* Create Class Form Component */}
      <CreateClassForm />
      {/* List all classes */}
      <section className="w-full max-w-3xl mx-auto">
        <h2 className="text-xl font-bold mb-4">All Classes</h2>
        {classesQuery.isLoading ? (
          <div className="text-muted-foreground">Loading classes...</div>
        ) : classesQuery.isError ? (
          <div className="text-destructive">Failed to load classes.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {classesQuery.data?.map((cls: any) => (
              <div
                key={cls.id}
                className="border rounded p-4 bg-white shadow cursor-pointer hover:shadow-lg transition"
                onClick={() => handleCardClick(cls.id)}
              >
                <div className="font-semibold text-lg">
                  {cls.name || cls.id}
                </div>
                <div className="text-xs text-muted-foreground">
                  ID: {cls.id}
                </div>
                <div className="text-xs">
                  Main Teacher: {cls.mainTeacherId ?? "—"}
                </div>
                <div className="text-xs">
                  Teachers: {cls.teacherIds?.length ?? 0}
                </div>
                <div className="text-xs">
                  Children: {cls.childIds?.length ?? 0}
                </div>
                <div className="text-xs">
                  Created:{" "}
                  {cls.createdAt
                    ? new Date(cls.createdAt).toLocaleString()
                    : "—"}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
