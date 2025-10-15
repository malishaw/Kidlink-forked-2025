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
  nursery,
  nurseryInsertSchema,
  nurseryUpdateSchema,
} from "./nursery.schema";

const tags = ["Nursery"];

/**
 * List nurseries (scoped to current user's org/ownership in your handler)
 * Mounted under /nurseries — path is "/" here to match your router style.
 */
export const list = createRoute({
  tags,
  summary: "List nurseries",
  path: "/",
  method: "get",
  request: {
    query: queryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(nursery)),
      "The list of nurseries"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
  },
});

/** Get a nursery by ID (owned by current user/org) */
export const getById = createRoute({
  tags,
  summary: "Get nursery by ID",
  method: "get",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(nursery, "The nursery item"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Nursery not found"
    ),
  },
});

/** Create a new nursery (owned by current user/org) */
export const create = createRoute({
  tags,
  summary: "Create nursery",
  method: "post",
  path: "/",
  request: {
    body: jsonContentRequired(nurseryInsertSchema, "Create nursery payload"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(nursery, "The created nursery"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
  },
});

/** Update an existing nursery */
export const update = createRoute({
  tags,
  summary: "Update nursery",
  method: "patch",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(nurseryUpdateSchema, "Update nursery payload"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(nursery, "The updated nursery"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Not found"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
  },
});

/** Delete a nursery */
export const remove = createRoute({
  tags,
  summary: "Delete nursery",
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

export const getMyNursery = createRoute({
  tags,
  summary: "Get my nursery",
  method: "get",
  path: "/my",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(nursery, "The nursery"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(errorMessageSchema, "Unauthorized"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Nursery not found"),
  },
});

// Export types
export type ListRoute = typeof list;
export type GetByIdRoute = typeof getById;
export type CreateRoute = typeof create;
export type UpdateRoute = typeof update;
export type RemoveRoute = typeof remove;
export type GetMyNurseryRoute = typeof getMyNursery;
