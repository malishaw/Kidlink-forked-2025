"use server";

import { getClient } from "@/lib/rpc/server";
import { revalidatePath } from "next/cache";

export async function deleteLessonPlan(id: number) {
  const client = await getClient();

  const response = await client.api["lesson-plans"][":id"].$delete({
    param: { id: String(id) }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`${errorData.message}`);
  }

  const lessonPlanData = await response.json();

  // Revalidate the page to show the new lessonPlan
  revalidatePath("/");
}
