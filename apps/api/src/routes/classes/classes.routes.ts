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
  classesInsertSchema,
  classesSchema,
  classesUpdateSchema,
} from "./classes.schema";

const tags: string[] = ["classes"];

// List route definition
export const list = createRoute({
  tags,
  summary: "List all classes",
  path: "/",
  method: "get",
  request: {
    query: queryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(classesSchema)),
      "The list of classes"
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
  summary: "Get classes by ID",
  method: "get",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(classesSchema, "The classes item"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "classes not found"
    ),
  },
});

// Create classes route definition
export const create = createRoute({
  tags,
  summary: "Create classes",
  method: "post",
  path: "/",
  request: {
    body: jsonContentRequired(classesInsertSchema, "Create uploaded classes"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      classesSchema,
      "The classes created"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "classes not created"
    ),
  },
});

// Update classes route definition
export const update = createRoute({
  tags,
  summary: "Update classes",
  method: "patch",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(
      classesUpdateSchema,
      "Update classes details schema"
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(classesUpdateSchema, "The classes item"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Not found"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
  },
});

// Delete classes route definition
export const remove = createRoute({
  method: "delete",
  path: "/:id",
  tags: ["classes"],
  summary: "Delete a classes",
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
