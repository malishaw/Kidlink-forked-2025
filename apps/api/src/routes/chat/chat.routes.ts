import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";

import {
  errorMessageSchema,
  getPaginatedSchema,
  stringIdParamSchema
} from "@api/lib/helpers";

import {
  chatListQuerySchema,
  chatWithParticipantsSchema,
  createDirectChatSchema,
  createGroupChatSchema,
  joinChatSchema,
  messageListQuerySchema,
  messageWithSenderSchema,
  sendMessageSchema,
  updateMessageSchema
} from "./chat.schema";

const tags = ["Chats"];

/**
 * ================================================================
 * Chat Management Routes
 * ================================================================
 */

// List user's chats
export const listChatsRoute = createRoute({
  tags,
  summary: "List user's chats",
  method: "get",
  path: "/",
  request: {
    query: chatListQuerySchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(chatWithParticipantsSchema)),
      "List of user's chats"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Internal server error"
    )
  }
});

// Get specific chat details
export const getChatRoute = createRoute({
  tags,
  summary: "Get chat details",
  method: "get",
  path: "/{id}",
  request: {
    params: stringIdParamSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      chatWithParticipantsSchema,
      "Chat details with participants"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Chat not found"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Internal server error"
    )
  }
});

// Create direct chat
export const createDirectChatRoute = createRoute({
  tags,
  summary: "Create a direct chat with another user",
  method: "post",
  path: "/direct",
  request: {
    body: jsonContentRequired(
      createDirectChatSchema,
      "Direct chat creation data"
    )
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      z.object({
        chatId: z.string(),
        message: z.string()
      }),
      "Direct chat created successfully"
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      errorMessageSchema,
      "Invalid request data"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "User not found"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Internal server error"
    )
  }
});

// Create group chat
export const createGroupChatRoute = createRoute({
  tags,
  summary: "Create a group chat",
  method: "post",
  path: "/group",
  request: {
    body: jsonContentRequired(createGroupChatSchema, "Group chat creation data")
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      z.object({
        chatId: z.string(),
        message: z.string()
      }),
      "Group chat created successfully"
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      errorMessageSchema,
      "Invalid request data"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Internal server error"
    )
  }
});

/**
 * ================================================================
 * Message Routes
 * ================================================================
 */

// Get messages for a chat
export const getMessagesRoute = createRoute({
  tags,
  summary: "Get messages for a chat",
  method: "get",
  path: "/{id}/messages",
  request: {
    params: stringIdParamSchema,
    query: messageListQuerySchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(messageWithSenderSchema)),
      "List of messages"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Chat not found"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Internal server error"
    )
  }
});

// Send message to chat
export const sendMessageRoute = createRoute({
  tags,
  summary: "Send a message to chat",
  method: "post",
  path: "/{id}/messages",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(sendMessageSchema, "Message content")
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      z.object({
        id: z.string(),
        message: z.string()
      }),
      "Message sent successfully"
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      errorMessageSchema,
      "Invalid message data"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Chat not found"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Internal server error"
    )
  }
});

/**
 * ================================================================
 * WebSocket Connection Routes
 * ================================================================
 */

// Join chat room (for WebSocket connection management)
export const joinChatRoute = createRoute({
  tags,
  summary: "Join a chat room",
  method: "post",
  path: "/join",
  request: {
    body: jsonContentRequired(joinChatSchema, "Chat join data")
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ message: z.string() }),
      "Joined chat room successfully"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Chat not found"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Internal server error"
    )
  }
});

// Leave chat room
export const leaveChatRoute = createRoute({
  tags,
  summary: "Leave a chat room",
  method: "post",
  path: "/leave",
  request: {
    body: jsonContentRequired(joinChatSchema, "Chat leave data")
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ message: z.string() }),
      "Left chat room successfully"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Internal server error"
    )
  }
});

/**
 * ================================================================
 * Message Management Routes
 * ================================================================
 */

// Update message
export const updateMessageRoute = createRoute({
  tags,
  summary: "Update/edit a message",
  method: "patch",
  path: "/messages/{id}",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(updateMessageSchema, "Updated message content")
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ message: z.string() }),
      "Message updated successfully"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Message not found"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Internal server error"
    )
  }
});

// Delete message
export const deleteMessageRoute = createRoute({
  tags,
  summary: "Delete a message",
  method: "delete",
  path: "/messages/{id}",
  request: {
    params: stringIdParamSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ message: z.string() }),
      "Message deleted successfully"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Message not found"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Internal server error"
    )
  }
});

/**
 * ================================================================
 * Route Type Exports
 * ================================================================
 */

export type ListChatsRoute = typeof listChatsRoute;
export type GetChatRoute = typeof getChatRoute;
export type CreateDirectChatRoute = typeof createDirectChatRoute;
export type CreateGroupChatRoute = typeof createGroupChatRoute;
export type GetMessagesRoute = typeof getMessagesRoute;
export type SendMessageRoute = typeof sendMessageRoute;
export type JoinChatRoute = typeof joinChatRoute;
export type LeaveChatRoute = typeof leaveChatRoute;
export type UpdateMessageRoute = typeof updateMessageRoute;
export type DeleteMessageRoute = typeof deleteMessageRoute;
