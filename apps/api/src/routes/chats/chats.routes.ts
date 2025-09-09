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
  chatSchema,
  chatInsertSchema,
  chatUpdateSchema,
} from "./chats.schema";

const tags = ["Chats"];

// List chats
export const list = createRoute({
  tags,
  summary: "List all chats",
  path: "/",
  method: "get",
  request: {
    query: queryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(chatSchema)),
      "The list of chats"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized"
    ),
  },
});

// Get chat by ID
export const getById = createRoute({
  tags,
  summary: "Get chat by ID",
  path: "/:id",
  method: "get",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(chatSchema, "Chat"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Not found"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized"
    ),
  },
});

// Create chat
export const create = createRoute({
  tags,
  summary: "Create a new chat",
  path: "/",
  method: "post",
  request: {
    body: jsonContentRequired(chatInsertSchema, "Chat create payload"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(chatSchema, "Chat created"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized"
    ),
  },
});

// Update chat
export const update = createRoute({
  tags,
  summary: "Update chat",
  path: "/:id",
  method: "patch",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(chatUpdateSchema, "Chat update payload"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(chatSchema, "Chat updated"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Not found"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized"
    ),
  },
});

// Delete chat
export const remove = createRoute({
  tags,
  summary: "Delete chat",
  path: "/:id",
  method: "delete",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    204: {
      description: "Deleted",
      content: {
        "application/json": { schema: z.null() },
      },
    },
    401: jsonContent(errorMessageSchema, "Unauthorized"),
    404: jsonContent(errorMessageSchema, "Not found"),
  },
});

// Export types
export type ListRoute = typeof list;
export type GetByIdRoute = typeof getById;
export type CreateRoute = typeof create;
export type UpdateRoute = typeof update;
export type RemoveRoute = typeof remove;
