"use server";

import { getClient } from "@/lib/rpc/server";
import { revalidatePath } from "next/cache";

/**
 * Schema for adding a lesson plan - matches the API insert schema
 */
export type AddLessonPlanSchema = {
  title: string;
  classId: string;
  content?: string | null;
};

type Options = {
  /** Which route to revalidate after creating a lesson plan */
  revalidate?: string;
};

export async function addLessonPlan(data: AddLessonPlanSchema, opts?: Options) {
  // Basic validation
  if (!data?.title) {
    throw new Error("Lesson plan title is required");
  }
  if (!data?.classId) {
    throw new Error("classId is required");
  }

  const client = await getClient();

  const response = await client.api["lesson-plans"].$post({
    json: {
      title: data.title,
      content: data.content ?? null,
      classId: data.classId,
    } as any, // Temporary workaround until API types regenerate
  });

  if (!response.ok) {
    // keep error surface similar to your task action
    try {
      const err = await response.json();
      throw new Error(err?.message ?? "Failed to create lesson plan");
    } catch {
      throw new Error("Failed to create lesson plan");
    }
  }

  const lessonPlan = await response.json();

  // Revalidate the page that lists / shows lesson plans
  revalidatePath(opts?.revalidate ?? "/lessonplans");

  return lessonPlan;
}
