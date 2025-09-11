import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import {
  chatParticipants,
  chats,
  messages,
  messageStatus,
  typingIndicators
} from "@repo/database";

// Base schemas from database tables
export const chatSchema = createSelectSchema(chats);
export const chatParticipantSchema = createSelectSchema(chatParticipants);
export const messageSchema = createSelectSchema(messages);
export const messageStatusSchema = createSelectSchema(messageStatus);
export const typingIndicatorSchema = createSelectSchema(typingIndicators);

// Insert schemas (for creating new records)
export const createChatSchema = createInsertSchema(chats).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const createChatParticipantSchema = createInsertSchema(
  chatParticipants
).omit({
  id: true,
  joinedAt: true
});

export const createMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  isEdited: true,
  editedAt: true
});

export const createMessageStatusSchema = createInsertSchema(messageStatus).omit(
  {
    id: true,
    timestamp: true
  }
);

// Update schemas
export const updateChatSchema = createChatSchema
  .partial()
  .omit({ createdBy: true });
export const updateMessageSchema = z.object({
  content: z.string().min(1)
});

// API request schemas
export const createDirectChatSchema = z.object({
  participantId: z.string().min(1, "Participant ID is required")
});

export const createGroupChatSchema = z.object({
  name: z.string().min(1, "Group name is required"),
  description: z.string().optional(),
  participantIds: z
    .array(z.string())
    .min(1, "At least one participant is required")
});

export const sendMessageSchema = z.object({
  content: z.string().min(1, "Message content is required"),
  messageType: z.string().default("text"),
  replyToId: z.string().optional()
});

export const joinChatSchema = z.object({
  chatId: z.string().min(1, "Chat ID is required")
});

// Query schemas
export const chatListQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional()
});

export const messageListQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  before: z.string().optional(), // message ID to fetch messages before
  after: z.string().optional() // message ID to fetch messages after
});

// Response schemas
export const chatWithParticipantsSchema = chatSchema.extend({
  participants: z.array(
    chatParticipantSchema.extend({
      user: z.object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
        image: z.string().nullable()
      })
    })
  ),
  lastMessage: messageSchema.optional(),
  unreadCount: z.number().default(0)
});

export const messageWithSenderSchema = messageSchema.extend({
  sender: z.object({
    id: z.string(),
    name: z.string(),
    image: z.string().nullable()
  }),
  replyTo: messageSchema
    .pick({
      id: true,
      content: true,
      senderId: true
    })
    .extend({
      sender: z.object({
        name: z.string()
      })
    })
    .optional()
});

// WebSocket message schemas
export const wsMessageSchema = z.object({
  type: z.string(),
  data: z.any(),
  timestamp: z.string(),
  userId: z.string().optional(),
  chatId: z.string().optional()
});

export const wsChatMessageSchema = wsMessageSchema.extend({
  type: z.literal("chat_message"),
  data: z.object({
    id: z.string(),
    chatId: z.string(),
    senderId: z.string(),
    senderName: z.string(),
    senderAvatar: z.string().optional(),
    content: z.string(),
    messageType: z.string(),
    replyToId: z.string().optional(),
    createdAt: z.string()
  })
});

export const wsTypingSchema = wsMessageSchema.extend({
  type: z.enum(["typing_start", "typing_stop"]),
  data: z.object({
    chatId: z.string(),
    userId: z.string(),
    userName: z.string()
  })
});

// Type exports
export type Chat = z.infer<typeof chatSchema>;
export type ChatParticipant = z.infer<typeof chatParticipantSchema>;
export type Message = z.infer<typeof messageSchema>;
export type MessageStatus = z.infer<typeof messageStatusSchema>;
export type TypingIndicator = z.infer<typeof typingIndicatorSchema>;

export type CreateChatType = z.infer<typeof createChatSchema>;
export type CreateDirectChatType = z.infer<typeof createDirectChatSchema>;
export type CreateGroupChatType = z.infer<typeof createGroupChatSchema>;
export type SendMessageType = z.infer<typeof sendMessageSchema>;

export type ChatWithParticipants = z.infer<typeof chatWithParticipantsSchema>;
export type MessageWithSender = z.infer<typeof messageWithSenderSchema>;

export type WSMessage = z.infer<typeof wsMessageSchema>;
export type WSChatMessage = z.infer<typeof wsChatMessageSchema>;
export type WSTyping = z.infer<typeof wsTypingSchema>;
