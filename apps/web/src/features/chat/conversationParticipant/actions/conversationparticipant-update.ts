import { getClient } from "@/lib/rpc/server";
import type { conversationParticipantUpdateType } from "../schemas/conversationParticipant.schema";

export async function updateConversationParticipant(
  id: string,
  data: conversationParticipantUpdateType
) {
  const rpcClient = await getClient();

  const response = await rpcClient.api["conversation-participant"][
    ":id"
  ].$patch({
    param: { id },
    json: data,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || "Failed to update conversation participant"
    );
  }

  const updatedParticipant = await response.json();
  return updatedParticipant;
}
