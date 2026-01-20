"use server";

import { getClient } from "@/lib/rpc/server";

export async function deleteChildren(id: string) {
  const rpcClient = await getClient();

  const response = await rpcClient.api.children[":id"].$delete({
    param: { id },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Unknown error");
  }

  // The API returns 204 No Content on successful delete. Don't attempt to parse JSON for empty responses.
  if (response.status === 204) {
    return null;
  }

  const deleted = await response.json();
  return deleted;
}
