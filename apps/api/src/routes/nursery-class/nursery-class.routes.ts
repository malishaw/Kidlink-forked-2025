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
  classInsertSchema,
  classSchema,
  classUpdateSchema,
} from "./nursery-class.schema";

const tags = ["Class"];

/**
 * List classes (scoped to current user's org/ownership in your handler)
 * Mounted under /classes — path is "/" here to match your router style.
 */
export const list = createRoute({
  tags,
  summary: "List classes",
  path: "/",
  method: "get",
  request: {
    query: queryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(classSchema)),
      "The list of classes"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
  },
});

/** Get a class by ID (owned by current user/org) */
export const getById = createRoute({
  tags,
  summary: "Get class by ID",
  method: "get",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(classSchema, "The class item"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Class not found"
    ),
  },
});

/** Create a new class (owned by current user/org)
 *  If nurseryId is omitted, the handler will auto-pick the user's sole nursery.
 */
export const create = createRoute({
  tags,
  summary: "Create class",
  method: "post",
  path: "/",
  request: {
    body: jsonContentRequired(classInsertSchema, "Create class payload"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(classSchema, "The created class"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      errorMessageSchema,
      "Invalid payload"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Parent nursery not found"
    ),
  },
});

/** Update an existing class */
export const update = createRoute({
  tags,
  summary: "Update class",
  method: "patch",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(classUpdateSchema, "Update class payload"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(classSchema, "The updated class"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Not found"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
  },
});

/** Delete a class */
export const remove = createRoute({
  tags,
  summary: "Delete class",
  method: "delete",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "No Content",
    },
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Not Found"),
  },
});

// Export types
export type ListRoute = typeof list;
export type GetByIdRoute = typeof getById;
export type CreateRoute = typeof create;
export type UpdateRoute = typeof update;
export type RemoveRoute = typeof remove;
