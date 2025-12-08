// update-payment.action.ts

"use server";

import { getClient } from "@/lib/rpc/server";
import type { paymentsUpdateType } from "../schemas";

export async function updatePayment(id: string, data: paymentsUpdateType) {
  const rpcClient = await getClient();

  // Make the PATCH request to update the payment
  const response = await rpcClient.api.payment[":id"].$patch({
    param: { id },
    json: data,
  });

  // Handle errors
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update payment");
  }

  // Return the updated payment
  const updatedPayment = await response.json();
  return updatedPayment;
}
