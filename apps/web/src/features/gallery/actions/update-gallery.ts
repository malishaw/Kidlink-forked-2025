"use server";

import { getClient } from "@/lib/rpc/server";
import type { galleryUpdateType } from "../schemas";

export async function updateGallery(id: string, data: galleryUpdateType) {
  try {
    const rpcClient = await getClient();

    const response = await rpcClient.api.gallery[":id"].$patch({
      param: { id },
      json: data,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update gallery");
    }

    const updatedGallery = await response.json();
    return updatedGallery;
  } catch (error) {
    console.error("Error updating gallery:", error);
    throw error;
  }
}
