"use server";

import { getClient } from "@/lib/rpc/server";
import { revalidatePath } from "next/cache";

export async function deleteNotification(id: number) {
  const client = await getClient();

  const response = await client.api.notification[":id"].$delete({
    param: { id: id.toString() },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`${errorData.message}`);
  }

  const notificationData = await response.json();

  // Revalidate the page to show the new notification
  revalidatePath("/");
}
