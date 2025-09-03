"use server";

import { getClient } from "@/lib/rpc/server";
import type { lessonPlanUpdateType } from "../schemas"; // make sure you have this type

export async function updateLessonPlan(id: string, data: lessonPlanUpdateType) {
  const rpcClient = await getClient();

  const response = await rpcClient.api["lesson-plans"][":id"].$patch({
    param: { id },
    json: data,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Unknown error");
  }

  const updatedLessonPlan = await response.json();
  return updatedLessonPlan;
}
