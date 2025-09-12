// delete-payment.action.ts

"use server";

import { getClient } from "@/lib/rpc/server";
import { revalidatePath } from "next/cache";

export async function deletePayment(id: number) {
  const client = await getClient();

  const response = await (client as any).api.payment[":id"].$delete({
    param: { id: id.toString() },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete payment.");
  }

  // Revalidate pages that display payment data to remove the deleted entry
  revalidatePath("/payment");
  revalidatePath("/");
}
