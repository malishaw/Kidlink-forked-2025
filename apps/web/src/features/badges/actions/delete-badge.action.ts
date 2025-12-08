"use server";

import { getClient } from "@/lib/rpc/server";
import { revalidatePath } from "next/cache";

export async function deleteBadge(id: string) {
  const client = await getClient();

  const response = await client.api.badges[":id"].$delete({
    param: { id },
  });

  if (!response.ok) {
    let message = `Failed to delete badge (${response.status})`;
    try {
      const err = await response.json();
      if (err?.message) message = err.message;
    } catch {
      // ignore parse error on non-JSON error bodies
    }
    throw new Error(message);
  }

  // 204 No Content or non-JSON: don't try to parse
  if (response.status === 204) return;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return;

  // If server returns JSON on delete, you can parse it; otherwise just return
  try {
    await response.json();
  } catch {
    // ignore
  }

  revalidatePath("/");
}
