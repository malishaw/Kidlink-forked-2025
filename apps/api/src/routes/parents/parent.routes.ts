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
  parent,
  parentInsertSchema,
  parentUpdateSchema,
} from "./parent.schema";

const tags: string[] = ["Parent"];

// List route definition
export const list = createRoute({
  tags,
  summary: "List all parent",
  path: "/",
  method: "get",
  request: {
    query: queryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(parent)),
      "The list of parent"
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
  summary: "Get parent by ID",
  method: "get",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(parent, "The parent item"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Parent not found"
    ),
  },
});

// Create Parent route definition
export const create = createRoute({
  tags,
  summary: "Create parent",
  method: "post",
  path: "/",
  request: {
    body: jsonContentRequired(parentInsertSchema, "Create uploaded parent"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(parent, "The parent created"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Parent not created"
    ),
  },
});

// Update parent route definition
export const update = createRoute({
  tags,
  summary: "Update Parent",
  method: "patch",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(
      parentUpdateSchema,
      "Update parent details schema"
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(parentUpdateSchema, "The parent item"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Not found"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
  },
});

// Delete parent route schema
export const remove = createRoute({
  tags,
  summary: "Remove Parent",
  method: "delete",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ message: z.string() }),
      "The parent item"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Not found"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
  },
});

// Filter parents by userId route definition
export const getByUserId = createRoute({
  tags,
  summary: "Get parents by userId",
  method: "get",
  path: "/user/:userId",
  request: {
    params: z.object({
      userId: z.string().min(1, "User ID is required"), // Changed from .uuid() to .min(1)
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(parent)),
      "The list of parents filtered by userId"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "No parents found for the given userId"
    ),
  },
});

// Export types
export type ListRoute = typeof list;
export type GetByIdRoute = typeof getById;
export type GetByUserIdRoute = typeof getByUserId;
export type CreateRoute = typeof create;
export type UpdateRoute = typeof update;
export type RemoveRoute = typeof remove;
