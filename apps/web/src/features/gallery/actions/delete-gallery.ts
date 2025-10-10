"use server";

import { getClient } from "@/lib/rpc/server";

export async function deleteGallery(id: string): Promise<void> {
  try {
    const rpcClient = await getClient();

    const response = await rpcClient.api.gallery[":id"].$delete({
      param: { id },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete gallery");
    }
  } catch (error) {
    console.error("Error deleting gallery:", error);
    throw error;
  }
}
