"use server";

import { getClient } from "@/lib/rpc/server";
import type { notificationUpdateType } from "../schemas"; // make sure you have this type

export async function updateNotification(
  id: string,
  data: notificationUpdateType
) {
  const rpcClient = await getClient();

  const response = await rpcClient.api.notification[":id"].$patch({
    param: { id },
    json: data,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Unknown error");
  }

  const updatedNotification = await response.json();
  return updatedNotification;
}
