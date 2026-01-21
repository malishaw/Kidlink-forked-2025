"use server";

import { getClient } from "@/lib/rpc/server";
import { revalidatePath } from "next/cache";

export async function deleteClass(id: string) {
  const client = await getClient();

  const response = await client.api.classes[":id"].$delete({
    param: { id },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`${(errorData as any).message || "Failed to delete class"}`);
  }

  // Revalidate the classes page
  revalidatePath("/account/manage/classes");
}
