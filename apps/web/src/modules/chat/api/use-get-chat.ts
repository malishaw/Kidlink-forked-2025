import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";
import type { Chat } from "../types";

export const useGetChat = (chatId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const client = await getClient();

      const response = await client.api.chat[":id"].$get({
        param: { id: chatId }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fetch chat");
      }

      const data = await response.json();
      return data as Chat;
    },
    enabled
  });
};
