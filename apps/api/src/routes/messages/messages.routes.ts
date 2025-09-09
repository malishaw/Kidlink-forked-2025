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
  messageSchema,
  messageInsertSchema,
  messageUpdateSchema,
} from "./messages.schema";

const tags = ["Messages"];

// List messages (with pagination, maybe by chatId in query later)
export const list = createRoute({
  tags,
  summary: "List messages",
  path: "/",
  method: "get",
  request: {
    query: queryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(messageSchema)),
      "List of messages"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized"
    ),
  },
});

// Get by ID
export const getById = createRoute({
  tags,
  summary: "Get message by ID",
  path: "/:id",
  method: "get",
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(messageSchema, "Message"),
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
  summary: "Send a new message",
  path: "/",
  method: "post",
  request: {
    body: jsonContentRequired(messageInsertSchema, "Message payload"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(messageSchema, "Message created"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized"
    ),
  },
});

// Update
export const update = createRoute({
  tags,
  summary: "Update a message",
  path: "/:id",
  method: "patch",
  request: {
    params: z.object({ id: z.string() }),
    body: jsonContentRequired(messageUpdateSchema, "Update payload"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(messageSchema, "Message updated"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Not found"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized"
    ),
  },
});

// Delete
export const remove = createRoute({
  tags,
  summary: "Delete a message",
  path: "/:id",
  method: "delete",
  request: {
    params: z.object({ id: z.string() }),
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
