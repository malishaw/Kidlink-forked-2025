"use server";

import { getClient } from "@/lib/rpc/server";
import { revalidatePath } from "next/cache";

export async function deletePostComment(id: number) {
  const client = await getClient();

  try {
    if (!client || !client.api) {
      throw new Error("RPC client not initialized");
    }

    const response = await client.api["comment"][":id"].$delete({
      param: { id: id.toString() },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete comment");
    }

    // Revalidate the page to show the updated comments
    revalidatePath("/");
    return true;
  } catch (error: any) {
    console.error("Error deleting comment:", error);
    throw new Error(error.message || "Failed to delete comment");
  }
}
