// app/lessonplans/page.tsx
import { AddNewLessonPlan } from "@/features/lessonPlans/components/add-new-lessonPlans";
import { LessonPlanCard } from "@/features/lessonPlans/components/lessonPlans-card";
import { getClient } from "@/lib/rpc/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lesson Plans - Kidlink",
  description: "Manage and view lesson plans",
};

async function getLessonPlans() {
  try {
    const client = await getClient();
    const response = await client.api["lesson-plans"].$get({
      query: {},
    });

    if (!response.ok) {
      throw new Error("Failed to fetch lesson plans");
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("Error fetching lesson plans:", error);
    return [];
  }
}

export default async function LessonPlansPage() {
  const lessonPlans = await getLessonPlans();

  return (
    <main className="min-h-screen w-full bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Lesson Plans</h1>
            <p className="mt-2 text-gray-600">
              Manage and view all lesson plans
            </p>
          </div>
          <AddNewLessonPlan />
        </div>

        {/* Lesson Plans Grid */}
        {lessonPlans.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {lessonPlans.map((lesson: any) => (
              <LessonPlanCard key={lesson.id} lesson={lesson} />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No lesson plans yet
              </h3>
              <p className="text-gray-500 mb-4">
                Get started by creating your first lesson plan.
              </p>
              <AddNewLessonPlan />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
