import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";
import type { Message, MessageListQuery } from "../types";

export const useGetMessages = (
  chatId: string,
  queryParams: MessageListQuery = {}
) => {
  return useQuery({
    queryKey: ["messages", chatId, queryParams],
    queryFn: async () => {
      const client = await getClient();

      const response = await client.api.chat[":id"].messages.$get({
        param: { id: chatId },
        query: queryParams
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch messages");
      }

      const data = await response.json();
      return data as {
        data: Message[];
        meta: {
          currentPage: number;
          limit: number;
          totalCount: number;
          totalPages: number;
        };
      };
    },
    enabled: !!chatId
  });
};
