import { getClient } from "@/lib/rpc/client";
import type { conversationParticipantInsertType } from "../schemas/conversationParticipant.schema";

export async function createConversationParticipantClient(
  data: conversationParticipantInsertType
) {
  const rpcClient = await getClient();

  const response = await rpcClient.api["conversation-participant"].$post({
    json: data,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || "Failed to create conversation participant"
    );
  }

  const createdParticipant = await response.json();
  return createdParticipant;
}
