"use server";

import { getClient } from "@/lib/rpc/server";
import type { badgesUpdateType } from "../schemas";

export async function updateBadge(id: string, data: badgesUpdateType) {
  const rpcClient = await getClient();

  const response = await rpcClient.api.badges[":id"].$patch({
    param: { id },
    json: {
      ...data,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Unknown error");
  }

  const updatedBadge = await response.json();
  return updatedBadge;
}
