"use server";

import { getClient } from "@/lib/rpc/server";
import type { lessonPlanInsertType } from "../schemas";

export async function createLessonPlan(data: lessonPlanInsertType) {
  try {
    const rpcClient = await getClient();

    const response = await rpcClient.api["lesson-plans"].$post({
      json: data,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || "Failed to create lessonPlan");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating lessonPlan:", error);
    throw error;
  }
}
