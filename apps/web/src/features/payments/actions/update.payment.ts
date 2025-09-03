"use server";

import { getClient } from "@/lib/rpc/server";
import type { paymentUpdateType } from "../schemas";

export async function updatePayment(id: string, data: paymentUpdateType) {
  const rpcClient = await getClient();

  const response = await rpcClient.api.payment[":id"].$patch({
    param: { id },
    json: data,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Unknown error");
  }

  const updatedPayment = await response.json();
  return updatedPayment;
}
