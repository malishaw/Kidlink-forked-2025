import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { z } from "zod";
// import { teacher } from "@repo/database";

import {
  errorMessageSchema,
  getPaginatedSchema,
  queryParamsSchema,
  stringIdParamSchema,
} from "@api/lib/helpers";
import {
  teacherInsertSchema,
  teacherSchema,
  teacherUpdateSchema,
} from "./tacher.schema";

const tags: string[] = ["teacher"];

// List route definition
export const list = createRoute({
  tags,
  summary: "List all teacher",
  path: "/",
  method: "get",
  request: {
    query: queryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(teacherSchema)),
      "The list of teacher"
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
  summary: "Get teacher by ID",
  method: "get",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(teacherSchema, "The teacher item"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "teacher not found"
    ),
  },
});

// Create teacher route definition
export const create = createRoute({
  tags,
  summary: "Create teacher",
  method: "post",
  path: "/",
  request: {
    body: jsonContentRequired(teacherInsertSchema, "Create uploaded teacher"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      teacherSchema,
      "The teacher created"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "teacher not created"
    ),
  },
});

// Update teacher route definition
export const update = createRoute({
  tags,
  summary: "Update teacher",
  method: "patch",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(
      teacherUpdateSchema,
      "Update teacher details schema"
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      teacherUpdateSchema,
      "The teacher item"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Not found"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
  },
});

// Delete teacher route definition
export const remove = createRoute({
  method: "delete",
  path: "/:id",
  tags: ["teacher"],
  summary: "Delete a teacher",
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
