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
  badgesInsertSchema,
  badgesSchema,
  badgesUpdateSchema,
} from "./badges.schema";

const tags: string[] = ["badges"];

// List route definition
export const list = createRoute({
  tags,
  summary: "List all badges",
  path: "/",
  method: "get",
  request: {
    query: queryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(badgesSchema)),
      "The list of badges"
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
  summary: "Get badges by ID",
  method: "get",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(badgesSchema, "The badges item"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "badges not found"
    ),
  },
});

// Create badges route definition
export const create = createRoute({
  tags,
  summary: "Create badges",
  method: "post",
  path: "/",
  request: {
    body: jsonContentRequired(badgesInsertSchema, "Create uploaded badges"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(badgesSchema, "The badges created"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "badges not created"
    ),
  },
});

// Update badges route definition
export const update = createRoute({
  tags,
  summary: "Update badges",
  method: "patch",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(
      badgesUpdateSchema,
      "Update badges details schema"
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(badgesUpdateSchema, "The badges item"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Not found"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
  },
});

// Remove badges route definition
export const remove = createRoute({
  method: "delete",
  path: "/:id",
  tags: ["badges"],
  summary: "Delete a badges",
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: jsonContent(
      z.object({ message: z.literal("Badge deleted successfully") }),
      "Badge deleted successfully"
    ),
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
