"use server";

import { getClient } from "@/lib/rpc/server";
import { revalidatePath } from "next/cache";
import type { lessonPlanUpdateType } from "../schemas";

export async function updateLessonPlan(id: string, data: lessonPlanUpdateType) {
  const client = await getClient();

  const response = await client.api["lesson-plans"][":id"].$patch({
    param: { id },
    json: data,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to update lesson plan");
  }

  // Revalidate the relevant paths
  revalidatePath("/lessonplans");
  revalidatePath("/");

  return await response.json();
}
