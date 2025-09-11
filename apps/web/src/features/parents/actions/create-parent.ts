"use server";

import { getClient } from "@/lib/rpc/server";
import type { parentInsertType } from "../schemas";

export async function createParent(data: parentInsertType) {
  try {
    const rpcClient = await getClient();

    const response = await rpcClient.api.parent.$post({
      json: data,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || "Failed to create parent");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating parent:", error);
    throw error;
  }
}
