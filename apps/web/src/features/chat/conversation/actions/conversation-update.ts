import { getClient } from "@/lib/rpc/server";
import type { conversationUpdateType } from "../schemas/conversation.schema";

export async function updateConversation(
  id: string,
  data: conversationUpdateType
) {
  const rpcClient = await getClient();

  const response = await rpcClient.api.conversation[":id"].$patch({
    param: { id },
    json: data,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update conversation");
  }

  const updatedConversation = await response.json();
  return updatedConversation;
}
