"use server";

import { getClient } from "@/lib/rpc/server";
import type { ClassUpdateType } from "../schemas";

export async function updateClass(id: string, data: ClassUpdateType) {
  const rpcClient = await getClient();

  const response = await rpcClient.api.classes[":id"].$patch({
    param: { id },
    json: data,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Unknown error");
  }

  const updatedClass = await response.json();
  return updatedClass;
}
