import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";
import type { Chat, ChatListQuery } from "../types";

export const useListChats = (queryParams: ChatListQuery = {}) => {
  return useQuery({
    queryKey: ["chats", queryParams],
    queryFn: async () => {
      const client = await getClient();

      const response = await client.api.chat.$get({
        query: queryParams
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch chats");
      }

      const data = await response.json();
      return data as {
        data: Chat[];
        meta: {
          currentPage: number;
          limit: number;
          totalCount: number;
          totalPages: number;
        };
      };
    }
  });
};
