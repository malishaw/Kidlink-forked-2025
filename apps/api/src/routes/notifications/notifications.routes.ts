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
  notificationsInsertSchema,
  notificationsSchema,
  notificationsUpdateSchema,
} from "./notifications.schema";

const tags: string[] = ["notifications"];

// List route definition
export const list = createRoute({
  tags,
  summary: "List all notifications",
  path: "/",
  method: "get",
  request: {
    query: queryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(notificationsSchema)),
      "The list of notifications items"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      errorMessageSchema,
      "Invalid request"
    ),
  },
});

// Get by ID route definition
export const getById = createRoute({
  tags,
  summary: "Get notifications by ID",
  method: "get",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      notificationsSchema,
      "The notifications item"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "notifications not found"
    ),
  },
});

// Create notifications route definition
export const create = createRoute({
  tags,
  summary: "Create notifications",
  method: "post",
  path: "/",
  request: {
    body: jsonContentRequired(
      notificationsInsertSchema,
      "Create uploaded notifications"
    ),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      notificationsSchema,
      "The notifications created"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "notifications not created"
    ),
  },
});

// Update notifications route definition
export const update = createRoute({
  tags,
  summary: "Update notifications",
  method: "patch",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(
      notificationsUpdateSchema,
      "Update notifications details schema"
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      notificationsUpdateSchema,
      "The notifications item"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Not found"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
  },
});

// Delete notifications route definition
export const remove = createRoute({
  method: "delete",
  path: "/:id",
  tags: ["notifications"],
  summary: "Delete a notifications",
  request: {
    params: stringIdParamSchema,
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
