import { getClient } from "@/lib/rpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  CreateDirectChatForm,
  CreateGroupChatForm,
  SendMessageForm
} from "../types";

export const useCreateDirectChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateDirectChatForm) => {
      const client = await getClient();

      const response = await client.api.chat.direct.$post({
        json: data
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create chat");
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    }
  });
};

export const useCreateGroupChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateGroupChatForm) => {
      const client = await getClient();

      const response = await client.api.chat.group.$post({
        json: data
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create group chat");
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    }
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      chatId,
      ...data
    }: SendMessageForm & { chatId: string }) => {
      const client = await getClient();

      const response = await client.api.chat[":id"].messages.$post({
        param: { id: chatId },
        json: data
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to send message");
      }

      return await response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["messages", variables.chatId]
      });
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    }
  });
};

export const useJoinChat = () => {
  return useMutation({
    mutationFn: async (chatId: string) => {
      const client = await getClient();

      const response = await client.api.chat.join.$post({
        json: { chatId }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to join chat");
      }

      return await response.json();
    }
  });
};

export const useLeaveChat = () => {
  return useMutation({
    mutationFn: async (chatId: string) => {
      const client = await getClient();

      const response = await client.api.chat.leave.$post({
        json: { chatId }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to leave chat");
      }

      return await response.json();
    }
  });
};
