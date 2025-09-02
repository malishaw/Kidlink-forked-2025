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
  notification,
  notificationInsertSchema,
  notificationUpdateSchema,
} from "./notification.schema";

const tags: string[] = ["Notification"];

// List route definition
export const list = createRoute({
  tags,
  summary: "List all notification",
  path: "/",
  method: "get",
  request: {
    query: queryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(notification)),
      "The list of notification"
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
  summary: "Get notification by ID",
  method: "get",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(notification, "The notification item"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Notification not found"
    ),
  },
});

// Create Notification route definition
export const create = createRoute({
  tags,
  summary: "Create notification",
  method: "post",
  path: "/",
  request: {
    body: jsonContentRequired(
      notificationInsertSchema,
      "Create uploaded notification"
    ),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      notification,
      "The notification created"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Notification not created"
    ),
  },
});

// Update notification route definition
export const update = createRoute({
  tags,
  summary: "Update Notification",
  method: "patch",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(
      notificationUpdateSchema,
      "Update notification details schema"
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      notificationUpdateSchema,
      "The notification item"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Not found"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
  },
});

// Delete notification route schema
export const remove = createRoute({
  tags,
  summary: "Remove Notification",
  method: "delete",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ message: z.string() }),
      "The notification item"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Not found"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
  },
});

// Get notifications by userId route definition
export const getByUserId = createRoute({
  tags,
  summary: "Get notifications by userId",
  method: "get",
  path: "/by-user",
  request: {
    query: z.object({ receiverId: z.string().min(1) }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(notification),
      "Notifications for user"
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      errorMessageSchema,
      "Missing userId"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
  },
});

// Export types
export type ListRoute = typeof list;
export type GetByIdRoute = typeof getById;
export type CreateRoute = typeof create;
export type UpdateRoute = typeof update;
export type RemoveRoute = typeof remove;
export type GetByUserIdRoute = typeof getByUserId;
