import { getClient } from "@/lib/rpc/client";
import type { notificationInsertType } from "../schemas";

export async function createNotification(data: notificationInsertType) {
  const rpcClient = await getClient();

  const response = await rpcClient.api.notification.$post({ json: data });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Unknown error");
  }

  const createdNotification = await response.json();
  return createdNotification;
}
