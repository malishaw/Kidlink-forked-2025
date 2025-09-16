import { getClient } from "@/lib/rpc/client";
import type { messageInsertType } from "../schemas/messages.schema";

export async function createMessageClient(data: messageInsertType) {
  const rpcClient = await getClient();

  const response = await rpcClient.api.messages.$post({
    json: data,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create message");
  }

  const createdMessage = await response.json();
  return createdMessage;
}
