"use server";

import { getClient } from "@/lib/rpc/server";
import { revalidatePath } from "next/cache";

export async function deleteFeedback(id: number) {
  const client = await getClient();

  const response = await client.api.feedbacks[":id"].$delete({
    param: { id: id.toString() },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`${errorData.message}`);
  }

  const feedbackData = await response.json();

  // Revalidate the page to show the new feedback
  revalidatePath("/");
}
