import { getClient } from "@/lib/rpc/client";

export async function getAllConversationsClient(query: {
  page?: number;
  limit?: number;
  sort?: "asc" | "desc";
  search?: string;
}) {
  const rpcClient = await getClient();

  const response = await rpcClient.api.conversation.$get({
    query,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch conversations");
  }

  const conversations = await response.json();
  return conversations;
}
