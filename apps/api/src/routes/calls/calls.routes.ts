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
  callSchema,
  callInsertSchema,
  callUpdateSchema,
} from "./calls.schema";

const tags = ["Calls"];

// List all calls
export const list = createRoute({
  tags,
  summary: "List all calls",
  path: "/",
  method: "get",
  request: { query: queryParamsSchema },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(callSchema)),
      "List of calls"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(errorMessageSchema, "Unauthorized"),
  },
});

// Get one call
export const getById = createRoute({
  tags,
  summary: "Get a call by ID",
  path: "/:id",
  method: "get",
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(callSchema, "Call"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Not found"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(errorMessageSchema, "Unauthorized"),
  },
});

// Create call
export const create = createRoute({
  tags,
  summary: "Create a new call",
  path: "/",
  method: "post",
  request: {
    body: jsonContentRequired(callInsertSchema, "Call payload"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(callSchema, "Call created"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(errorMessageSchema, "Unauthorized"),
  },
});

// Update call
export const update = createRoute({
  tags,
  summary: "Update a call",
  path: "/:id",
  method: "patch",
  request: {
    params: z.object({ id: z.string() }),
    body: jsonContentRequired(callUpdateSchema, "Update payload"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(callSchema, "Call updated"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Not found"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(errorMessageSchema, "Unauthorized"),
  },
});

// Delete call
export const remove = createRoute({
  tags,
  summary: "Delete a call",
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
