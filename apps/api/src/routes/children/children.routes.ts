import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { z } from "zod";
// import { children } from "@repo/database";

import {
  errorMessageSchema,
  getPaginatedSchema,
  queryParamsSchema,
  stringIdParamSchema,
} from "@api/lib/helpers";
import {
  childrenInsertSchema,
  childrenSchema,
  childrenUpdateSchema,
} from "./children.schema";

const tags: string[] = ["children"];

// List route definition
export const list = createRoute({
  tags,
  summary: "List all children",
  path: "/",
  method: "get",
  request: {
    query: queryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(childrenSchema)),
      "The list of children"
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
  summary: "Get children by ID",
  method: "get",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(childrenSchema, "The children item"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "children not found"
    ),
  },
});

// Create children route definition
export const create = createRoute({
  tags,
  summary: "Create children",
  method: "post",
  path: "/",
  request: {
    body: jsonContentRequired(childrenInsertSchema, "Create uploaded children"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      childrenSchema,
      "The children created"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "children not created"
    ),
  },
});

// Update children route definition
export const update = createRoute({
  tags,
  summary: "Update children",
  method: "patch",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(
      childrenUpdateSchema,
      "Update children details schema"
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      childrenUpdateSchema,
      "The children item"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Not found"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
  },
});

// Delete children route definition
export const remove = createRoute({
  method: "delete",
  path: "/:id",
  tags: ["children"],
  summary: "Delete a children",
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    204: {
      description: "No Content",
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
