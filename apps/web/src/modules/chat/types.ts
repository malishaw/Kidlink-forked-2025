import { z } from "zod";

// API Response types
export interface ChatParticipant {
  id: string;
  chatId: string;
  userId: string;
  joinedAt: string;
  isAdmin: boolean;
  isMuted: boolean;
  leftAt?: string;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  isOnline?: boolean;
}

export interface Chat {
  id: string;
  name?: string;
  description?: string;
  type: "direct" | "group";
  avatar?: string;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  participants: ChatParticipant[];
  lastMessage?: {
    id: string;
    content: string;
    senderId: string;
    senderName: string;
    createdAt: string;
    sender: {
      id: string;
      name: string;
      image?: string;
    };
  };
  unreadCount: number;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  messageType: string;
  replyToId?: string;
  isEdited: boolean;
  editedAt?: string;
  createdAt: string;
  updatedAt: string;
  sender: {
    id: string;
    name: string;
    image?: string;
  };
  replyTo?: {
    id: string;
    content: string;
    senderId: string;
    sender: {
      name: string;
    };
  };
}

// WebSocket message types
export interface WSMessage {
  type: string;
  data: Record<string, unknown>;
  timestamp: string;
  userId?: string;
  chatId?: string;
}

export interface WSChatMessage extends WSMessage {
  type: "chat_message";
  data: {
    id: string;
    chatId: string;
    senderId: string;
    senderName: string;
    senderAvatar?: string;
    content: string;
    messageType: string;
    replyToId?: string;
    createdAt: string;
  };
}

export interface WSTypingIndicator extends WSMessage {
  type: "typing_start" | "typing_stop";
  data: {
    chatId: string;
    userId: string;
    userName: string;
  };
}

export interface WSUserStatus extends WSMessage {
  type: "user_online" | "user_offline";
  data: {
    userId: string;
    userName: string;
    status: "online" | "offline";
  };
}

export interface WSAuthMessage extends WSMessage {
  type: "auth";
  data: {
    userId: string;
    sessionToken: string;
  };
}

export interface WSJoinChatMessage extends WSMessage {
  type: "join_chat";
  data: {
    userId: string;
    chatId: string;
  };
}

export interface WSLeaveChatMessage extends WSMessage {
  type: "leave_chat";
  data: {
    userId: string;
    chatId: string;
  };
}

// Form schemas
export const createDirectChatSchema = z.object({
  participantId: z.string().min(1, "Please select a user to chat with")
});

export const createGroupChatSchema = z.object({
  name: z
    .string()
    .min(1, "Group name is required")
    .max(100, "Group name is too long"),
  description: z.string().optional(),
  participantIds: z
    .array(z.string())
    .min(1, "At least one participant is required")
});

export const sendMessageSchema = z.object({
  content: z.string().min(1, "Message cannot be empty"),
  replyToId: z.string().optional()
});

export type CreateDirectChatForm = z.infer<typeof createDirectChatSchema>;
export type CreateGroupChatForm = z.infer<typeof createGroupChatSchema>;
export type SendMessageForm = z.infer<typeof sendMessageSchema>;

// Query parameters
export interface ChatListQuery {
  page?: string;
  limit?: string;
  search?: string;
}

export interface MessageListQuery {
  page?: string;
  limit?: string;
  before?: string;
  after?: string;
}
