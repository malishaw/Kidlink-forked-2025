import { getClient } from "@/lib/rpc/client";
import type { conversationInsertType } from "../schemas/conversation.schema";

export async function createConversationClient(data: conversationInsertType) {
  const rpcClient = await getClient();

  const response = await rpcClient.api.conversation.$post({
    json: data,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create conversation");
  }

  const createdConversation = await response.json();
  return createdConversation;
}
