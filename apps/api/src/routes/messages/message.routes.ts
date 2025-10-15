import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { z } from "zod";

import {
  errorMessageSchema,
  getPaginatedSchema,
  queryParamsSchema,
  stringIdParamSchema,
} from "@api/lib/helpers";
import {
  message,
  messageInsertSchema,
  messageUpdateSchema,
} from "./message.schema";

const tags: string[] = ["Message"];

// List route definition
export const list = createRoute({
  tags,
  summary: "List all message",
  path: "/",
  method: "get",
  request: {
    query: queryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(message)),
      "The list of message"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
  },
});

// Get by ID route definition
export const getById = createRoute({
  tags,
  summary: "Get message by ID",
  method: "get",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(message, "The message item"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Message not found"
    ),
  },
});

// Create Message route definition
export const create = createRoute({
  tags,
  summary: "Create message",
  method: "post",
  path: "/",
  request: {
    body: jsonContentRequired(messageInsertSchema, "Create uploaded message"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(message, "The message created"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Message not created"
    ),
  },
});

// Update message route definition
export const update = createRoute({
  tags,
  summary: "Update Message",
  method: "patch",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(
      messageUpdateSchema,
      "Update message details schema"
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(messageUpdateSchema, "The message item"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Not found"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
  },
});

export const remove = createRoute({
  method: "delete",
  path: "/:id",
  tags: ["Message"],
  summary: "Delete a user profile",
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    204: {
      description: "No Content",
      content: {
        "application/json": {
          schema: z.null(),
        },
      },
    },
    401: jsonContent(errorMessageSchema, "Unauthorized"),
    404: jsonContent(errorMessageSchema, "Not Found"),
  },
});

// Get messages by conversationId route definition
export const getByConversationId = createRoute({
  tags,
  summary: "Get messages by conversationId",
  method: "get",
  path: "/by-conversation",
  request: {
    query: z.object({
      conversationId: z.string(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(message)),
      "The list of messages for the conversation"
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      errorMessageSchema,
      "Invalid or missing conversationId"
    ),
  },
});

// Export types
export type ListRoute = typeof list;
export type GetByIdRoute = typeof getById;
export type CreateRoute = typeof create;
export type UpdateRoute = typeof update;
export type RemoveRoute = typeof remove;
export type GetByConversationIdRoute = typeof getByConversationId;
