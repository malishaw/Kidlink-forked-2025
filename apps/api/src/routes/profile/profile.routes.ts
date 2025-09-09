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
  profileSchema,
  profileInsertSchema,
  profileUpdateSchema,
} from "./profile.schema";

const tags: string[] = ["Profile"];

// List route definition
export const list = createRoute({
  tags,
  summary: "List all profiles",
  path: "/",
  method: "get",
  request: {
    query: queryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(profileSchema)),
      "The list of profiles"
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
  summary: "Get profile by ID",
  method: "get",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(profileSchema, "The profile item"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Profile not found"
    ),
  },
});

// Create Profile route definition
export const create = createRoute({
  tags,
  summary: "Create profile",
  method: "post",
  path: "/",
  request: {
    body: jsonContentRequired(profileInsertSchema, "Create profile payload"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(profileSchema, "The profile created"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Profile not created"
    ),
  },
});

// Update profile route definition
export const update = createRoute({
  tags,
  summary: "Update profile",
  method: "patch",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(
      profileUpdateSchema,
      "Update profile details schema"
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(profileSchema, "The updated profile"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Not found"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
  },
});

// Delete profile route definition
export const remove = createRoute({
  method: "delete",
  path: "/:id",
  tags,
  summary: "Delete a profile",
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
