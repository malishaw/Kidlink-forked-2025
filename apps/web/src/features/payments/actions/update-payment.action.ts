// update-payment.action.ts

"use server";

import { getClient } from "@/lib/rpc/server";
import { revalidatePath } from "next/cache";
import { type paymentsUpdateType } from "../schemas";

export async function updatePayment(id: number, data: paymentsUpdateType) {
  const client = await getClient();

  const response = await (client as any).api.payment[":id"].$patch({
    param: { id: id.toString() },
    json: data,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update payment.");
  }

  const updatedPayment = await response.json();

  // Revalidate pages to reflect the updated data
  revalidatePath("/payment");
  // Also revalidate the specific payment's page if one exists
  revalidatePath(`/payment/${id}`);

  return updatedPayment;
}
