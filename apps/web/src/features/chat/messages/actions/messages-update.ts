import { getClient } from "@/lib/rpc/server";
import type { messageUpdateType } from "../schemas/messages.schema";

export async function updateMessage(id: string, data: messageUpdateType) {
  const rpcClient = await getClient();

  const response = await rpcClient.api.messages[":id"].$patch({
    param: { id },
    json: data,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update message");
  }

  const updatedMessage = await response.json();
  return updatedMessage;
}
