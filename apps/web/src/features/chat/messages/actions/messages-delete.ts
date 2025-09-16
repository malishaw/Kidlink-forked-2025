import { getClient } from "@/lib/rpc/server";

export async function deleteMessage(id: string) {
  const rpcClient = await getClient();

  const response = await rpcClient.api.messages[":id"].$delete({
    param: { id },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete message");
  }

  return true;
}
