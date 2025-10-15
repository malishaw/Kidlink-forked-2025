// add-payments.action.ts

"use server";

import { getClient } from "@/lib/rpc/server";
import { revalidatePath } from "next/cache";
import { type paymentsInsertType } from "../schemas";

export async function addPayment(data: paymentsInsertType) {
  try {
    const rpcClient = await getClient();

    // Type assertion to bypass TypeScript issues
    const response = await (rpcClient as any).api.payment.$post({
      json: data,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || "Failed to create payment");
    }

    const result = await response.json();

    // Revalidate pages that display payment data to reflect the new entry
    revalidatePath("/payment");

    return result;
  } catch (error) {
    console.error("Error creating payment:", error);
    throw error;
  }
}
