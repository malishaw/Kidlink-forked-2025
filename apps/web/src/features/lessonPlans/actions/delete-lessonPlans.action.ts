"use server";

import { getClient } from "@/lib/rpc/server";
import { revalidatePath } from "next/cache";

export async function deleteLessonPlan(id: string) {
  const client = await getClient();

  const response = await client.api["lesson-plans"][":id"].$delete({
    param: { id }
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to delete lesson plan");
  }

  // Revalidate the page to show the updated list
  revalidatePath("/lessonplans");
  revalidatePath("/");

  return true;
}
