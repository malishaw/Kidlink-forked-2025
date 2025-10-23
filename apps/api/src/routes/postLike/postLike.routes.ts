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
  postLike,
  postLikeInsertSchema,
  postLikeUpdateSchema,
} from "./postLike.schema";

const tags: string[] = ["PostLike"];

// List route definition
export const list = createRoute({
  tags,
  summary: "List all postLike",
  path: "/",
  method: "get",
  request: {
    query: queryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(postLike)),
      "The list of postLike"
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
  summary: "Get postLike by ID",
  method: "get",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(postLike, "The postLike item"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "PostLike not found"
    ),
  },
});

// Create PostLike route definition
export const create = createRoute({
  tags,
  summary: "Create postLike",
  method: "post",
  path: "/",
  request: {
    body: jsonContentRequired(postLikeInsertSchema, "Create uploaded postLike"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(postLike, "The postLike created"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "PostLike not created"
    ),
  },
});

// Update postLike route definition
export const update = createRoute({
  tags,
  summary: "Update PostLike",
  method: "patch",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(
      postLikeUpdateSchema,
      "Update postLike details schema"
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      postLikeUpdateSchema,
      "The postLike item"
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
  tags: ["PostLike"],
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
