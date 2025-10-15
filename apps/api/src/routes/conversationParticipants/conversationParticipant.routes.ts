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
  conversationParticipant,
  conversationParticipantInsertSchema,
  conversationParticipantUpdateSchema,
} from "./conversationParticipant.schema";

const tags: string[] = ["ConversationParticipant"];

// List route definition
export const list = createRoute({
  tags,
  summary: "List all conversationParticipant",
  path: "/",
  method: "get",
  request: {
    query: queryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(conversationParticipant)),
      "The list of conversationParticipant"
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
  summary: "Get conversationParticipant by ID",
  method: "get",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      conversationParticipant,
      "The conversationParticipant item"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "ConversationParticipant not found"
    ),
  },
});

// Create ConversationParticipant route definition
export const create = createRoute({
  tags,
  summary: "Create conversationParticipant",
  method: "post",
  path: "/",
  request: {
    body: jsonContentRequired(
      conversationParticipantInsertSchema,
      "Create uploaded conversationParticipant"
    ),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      conversationParticipant,
      "The conversationParticipant created"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "ConversationParticipant not created"
    ),
  },
});

// Update conversationParticipant route definition
export const update = createRoute({
  tags,
  summary: "Update ConversationParticipant",
  method: "patch",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(
      conversationParticipantUpdateSchema,
      "Update conversationParticipant details schema"
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      conversationParticipantUpdateSchema,
      "The conversationParticipant item"
    ),
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
  tags: ["ConversationParticipant"],
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

// Export types
export type ListRoute = typeof list;
export type GetByIdRoute = typeof getById;
export type CreateRoute = typeof create;
export type UpdateRoute = typeof update;
export type RemoveRoute = typeof remove;
