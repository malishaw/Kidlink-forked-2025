import { getClient } from "@/lib/rpc/server";

export async function getAllMessages(query: {
  page?: number;
  limit?: number;
  sort?: "asc" | "desc";
  search?: string;
}) {
  const rpcClient = await getClient();

  const response = await rpcClient.api.messages.$get({
    query,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch messages");
  }

  const messages = await response.json();
  return messages;
}
