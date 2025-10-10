"use server";

import { getClient } from "@/lib/rpc/server";
import { revalidatePath } from "next/cache";

export async function markAsCompleted(
  id: string,
  status: "completed" | "pending" = "completed"
) {
  try {
    const client = await getClient();

    const response = await (client as any).api.payment[":id"].$patch({
      json: { status },
      param: { id },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || "Failed to update payment status");
    }

    const paymentData = await response.json();

    // Revalidate the page to show the updated payment
    revalidatePath("/payment");
    revalidatePath("/");

    return paymentData;
  } catch (error) {
    console.error("Error updating payment status:", error);
    throw error;
  }
}
