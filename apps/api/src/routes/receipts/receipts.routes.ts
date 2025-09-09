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
  receiptSchema,
  receiptInsertSchema,
  receiptUpdateSchema,
} from "./receipts.schema";

const tags = ["Receipts"];

// List all receipts
export const list = createRoute({
  tags,
  summary: "List all receipts",
  path: "/",
  method: "get",
  request: {
    query: queryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(receiptSchema)),
      "List of receipts"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(errorMessageSchema, "Unauthorized"),
  },
});

// Get by composite key (messageId + userId)
export const getById = createRoute({
  tags,
  summary: "Get a receipt",
  path: "/:messageId/:userId",
  method: "get",
  request: {
    params: z.object({
      messageId: z.string(),
      userId: z.string(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(receiptSchema, "Receipt"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Not found"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(errorMessageSchema, "Unauthorized"),
  },
});

// Create receipt
export const create = createRoute({
  tags,
  summary: "Create a receipt",
  path: "/",
  method: "post",
  request: {
    body: jsonContentRequired(receiptInsertSchema, "Receipt payload"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(receiptSchema, "Receipt created"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(errorMessageSchema, "Unauthorized"),
  },
});

// Update receipt
export const update = createRoute({
  tags,
  summary: "Update a receipt",
  path: "/:messageId/:userId",
  method: "patch",
  request: {
    params: z.object({
      messageId: z.string(),
      userId: z.string(),
    }),
    body: jsonContentRequired(receiptUpdateSchema, "Update payload"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(receiptSchema, "Receipt updated"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Not found"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(errorMessageSchema, "Unauthorized"),
  },
});

// Delete receipt
export const remove = createRoute({
  tags,
  summary: "Delete a receipt",
  path: "/:messageId/:userId",
  method: "delete",
  request: {
    params: z.object({
      messageId: z.string(),
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
