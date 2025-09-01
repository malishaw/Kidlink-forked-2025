"use server";

import { getClient } from "@/lib/rpc/server";
import type { childrenUpdateType } from "../schemas"; // make sure you have this type

export async function updateChildren(id: string, data: childrenUpdateType) {
  const rpcClient = await getClient();

  const response = await rpcClient.api.children[":id"].$patch({
    param: { id },
    json: data,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Unknown error");
  }

  const updatedChildren = await response.json();
  return updatedChildren;
}
