"use server";

import { getClient } from "@/lib/rpc/server";
import type { parentUpdateType } from "../schemas"; // make sure you have this type

export async function updateParent(id: string, data: parentUpdateType) {
  const rpcClient = await getClient();

  const response = await rpcClient.api.parent[":id"].$patch({
    param: { id },
    json: {
      ...data,
      childId: data.childId, // Ensure the field is sent as an array
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Unknown error");
  }

  const updatedParent = await response.json();
  return updatedParent;
}
