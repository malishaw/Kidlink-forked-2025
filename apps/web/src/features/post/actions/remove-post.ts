"use server";

import { getClient } from "@/lib/rpc/server";
import { revalidatePath } from "next/cache";

export async function deletePost(id: number) {
  const client = await getClient();

  const response = await client.api.post[":id"].$delete({
    param: { id: id.toString() },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`${errorData.message}`);
  }

  const postData = await response.json();

  // Revalidate the page to show the new post
  revalidatePath("/");
}
