"use server";

import { getClient } from "@/lib/rpc/server";
import type { badgesInsertType } from "../schemas";

export async function createBadge(data: badgesInsertType) {
  try {
    const rpcClient = await getClient();

    const response = await rpcClient.api.badges.$post({
      json: data,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || "Failed to create badge");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating badge:", error);
    throw error;
  }
}
