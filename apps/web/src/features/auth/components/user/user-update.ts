"use server";

import { getClient } from "@/lib/rpc/server";
import type { userUpdateType } from "./user.schema"; // Ensure this type is correctly imported

export async function updateUser(id: string, data: userUpdateType) {
  const rpcClient = await getClient();

  const response = await rpcClient.api.user[":id"].$patch({
    param: { id },
    json: data,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Unknown error");
  }

  const updatedUser = await response.json();
  return updatedUser;
}
