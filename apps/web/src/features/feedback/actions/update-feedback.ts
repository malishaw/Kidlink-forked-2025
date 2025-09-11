"use server";

import { getClient } from "@/lib/rpc/server";
import type { feedbackUpdateType } from "../schemas"; // make sure you have this type

export async function updateFeedback(id: string, data: feedbackUpdateType) {
  const rpcClient = await getClient();

  const response = await rpcClient.api.feedbacks[":id"].$patch({
    param: { id },
    json: data,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Unknown error");
  }

  const updatedFeedback = await response.json();
  return updatedFeedback;
}
