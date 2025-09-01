"use server";

import { getClient } from "@/lib/rpc/server";
import type { paymentInsertType } from "../schemas";

export async function createPayment(data: paymentInsertType) {
  try {
    const rpcClient = await getClient();

    const response = await rpcClient.api.payment.$post({
      json: data,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || "Failed to create payment");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating payment:", error);
    throw error;
  }
}
