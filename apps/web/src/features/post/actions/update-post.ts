"use server";

import { getClient } from "@/lib/rpc/server";
import type { postUpdateType } from "../schemas"; // make sure you have this type

export async function updatePost(id: string, data: postUpdateType) {
  const rpcClient = await getClient();

  const response = await rpcClient.api.post[":id"].$patch({
    param: { id },
    json: data,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Unknown error");
  }

  const updatedPost = await response.json();
  return updatedPost;
}
