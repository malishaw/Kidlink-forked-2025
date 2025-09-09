import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { z } from "zod";

import {
  errorMessageSchema,
  getPaginatedSchema,
  queryParamsSchema,
} from "@api/lib/helpers";

import {
  chatMemberSchema,
  chatMemberInsertSchema,
  chatMemberUpdateSchema,
} from "./chatMembers.schema";

const tags = ["ChatMembers"];

// List all chat members (optionally by chatId)
export const list = createRoute({
  tags,
  summary: "List chat members",
  path: "/",
  method: "get",
  request: {
    query: queryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(chatMemberSchema)),
      "List of chat members"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized"
    ),
  },
});

// Get one chat member (by composite key)
export const getById = createRoute({
  tags,
  summary: "Get chat member by chatId and userId",
  path: "/:chatId/:userId",
  method: "get",
  request: {
    params: z.object({
      chatId: z.string(),
      userId: z.string(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(chatMemberSchema, "Chat member"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Not found"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized"
    ),
  },
});

// Create
export const create = createRoute({
  tags,
  summary: "Add user to chat",
  path: "/",
  method: "post",
  request: {
    body: jsonContentRequired(chatMemberInsertSchema, "Chat member payload"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      chatMemberSchema,
      "Chat member created"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized"
    ),
  },
});

// Update
export const update = createRoute({
  tags,
  summary: "Update chat member",
  path: "/:chatId/:userId",
  method: "patch",
  request: {
    params: z.object({
      chatId: z.string(),
      userId: z.string(),
    }),
    body: jsonContentRequired(chatMemberUpdateSchema, "Update payload"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(chatMemberSchema, "Chat member updated"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Not found"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized"
    ),
  },
});

// Remove
export const remove = createRoute({
  tags,
  summary: "Remove user from chat",
  path: "/:chatId/:userId",
  method: "delete",
  request: {
    params: z.object({
      chatId: z.string(),
      userId: z.string(),
    }),
  },
  responses: {
    204: {
      description: "Deleted",
      content: { "application/json": { schema: z.null() } },
    },
    401: jsonContent(errorMessageSchema, "Unauthorized"),
    404: jsonContent(errorMessageSchema, "Not found"),
  },
});

export type ListRoute = typeof list;
export type GetByIdRoute = typeof getById;
export type CreateRoute = typeof create;
export type UpdateRoute = typeof update;
export type RemoveRoute = typeof remove;
