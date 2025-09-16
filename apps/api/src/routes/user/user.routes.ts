// user.routes.ts
import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { z } from "zod";

import {
  errorMessageSchema,
  getPaginatedSchema,
  queryParamsSchema,
  stringIdParamSchema,
} from "@api/lib/helpers";
import { userSelectSchema, userUpdateSchema } from "./user.schema";

const tags = ["User"];

// List current users
export const list = createRoute({
  tags,
  summary: "List users",
  path: "/",
  method: "get",
  request: { query: queryParamsSchema },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(userSelectSchema)),
      "The list of users"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
  },
});

// Get user by ID
export const getById = createRoute({
  tags,
  summary: "Get user by ID",
  method: "get",
  path: "/:id",
  request: { params: stringIdParamSchema },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(userSelectSchema, "The user item"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "User not found"
    ),
  },
});

// Get total user count
export const count = createRoute({
  tags,
  summary: "Get total user count",
  method: "get",
  path: "/count",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ count: z.number().int().nonnegative() }),
      "Total number of users"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
  },
});

// Update user by ID
export const updateUser = createRoute({
  tags,
  summary: "Update user by ID",
  method: "patch",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
    body: jsonContent(userUpdateSchema, "User update data"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      userSelectSchema,
      "The updated user item"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "User not found"
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      errorMessageSchema,
      "Invalid request data"
    ),
  },
});

// Export types
export type ListRoute = typeof list;
export type GetByIdRoute = typeof getById;
export type CountRoute = typeof count;
export type UpdateUserRoute = typeof updateUser;
