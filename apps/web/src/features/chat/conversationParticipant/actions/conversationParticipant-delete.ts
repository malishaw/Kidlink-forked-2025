import { getClient } from "@/lib/rpc/server";

export async function deleteConversationParticipant(id: string) {
  const rpcClient = await getClient();

  const response = await rpcClient.api["conversation-participant"][
    ":id"
  ].$delete({
    param: { id },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || "Failed to delete conversation participant"
    );
  }

  return true;
}
