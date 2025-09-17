import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string | null;
  attachmentUrl: string | null;
  isRead: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export const useGetMessagesByConversationId = (conversationId: string) => {
  return useQuery({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      const rpcClient = await getClient();
      const response = await rpcClient.api.messages["/by-conversation"].$get({
        query: { conversationId },
      });
      if (!response.ok) throw new Error("Failed to fetch messages");
      const json = await response.json();
      return json.data as Message[];
    },
    enabled: !!conversationId,
  });
};

// Server action version for server-side usage
export async function getMessagesByConversationId(
  conversationId: string
): Promise<Message[]> {
  const rpcClient = await getClient();
  const response = await rpcClient.api.messages["/by-conversation"].$get({
    query: { conversationId },
  });
  if (!response.ok) throw new Error("Failed to fetch messages");
  const json = await response.json();
  return json.data as Message[];
}
