"use server";

import { getClient } from "@/lib/rpc/server";
import type { childrenInsertType } from "../schemas";

export async function createChildren(data: childrenInsertType) {
  try {
    const rpcClient = await getClient();

    const response = await rpcClient.api.children.$post({
      json: data,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || "Failed to create children");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating children:", error);
    throw error;
  }
}
