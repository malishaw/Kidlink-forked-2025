"use server";

import { getClient } from "@/lib/rpc/server";
import type { galleryInsertType } from "../schemas";

export async function createGallery(data: galleryInsertType) {
  try {
    const rpcClient = await getClient();

    const response = await rpcClient.api.gallery.$post({
      json: data,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || "Failed to create gallery");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating gallery:", error);
    throw error;
  }
}
