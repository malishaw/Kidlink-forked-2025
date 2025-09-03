"use server";

import { getClient } from "@/lib/rpc/server";
import { revalidatePath } from "next/cache";

export async function deleteBadge(id: number) {
  const client = await getClient();

  const response = await client.api.badges[":id"].$delete({
    param: { id: String(id) }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`${errorData.message}`);
  }

  const badgeData = await response.json();

  // Revalidate the page to show the new badge
  revalidatePath("/");
}
