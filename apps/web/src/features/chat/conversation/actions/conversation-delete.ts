import { getClient } from "@/lib/rpc/server";

export async function deleteConversation(id: string) {
  const rpcClient = await getClient();

  const response = await rpcClient.api.conversation[":id"].$delete({
    param: { id },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete conversation");
  }

  return true;
}
