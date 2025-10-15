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
  teacher,
  teacherInsertSchema,
  teacherUpdateSchema,
} from "./teacher.schema";

const tags: string[] = ["Teacher"];

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
      getPaginatedSchema(z.array(teacher)),
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
    [HttpStatusCodes.OK]: jsonContent(teacher, "The teacher item"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Teacher not found"
    ),
  },
});

// Create Teacher route definition
export const create = createRoute({
  tags,
  summary: "Create teacher",
  method: "post",
  path: "/",
  request: {
    body: jsonContentRequired(teacherInsertSchema, "Create uploaded teacher"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(teacher, "The teacher created"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Teacher not created"
    ),
  },
});

// Update teacher route definition
export const update = createRoute({
  tags,
  summary: "Update Teacher",
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
    [HttpStatusCodes.OK]: jsonContent(teacherUpdateSchema, "The teacher item"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Not found"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
  },
});

// Delete teacher route schema
export const remove = createRoute({
  tags,
  summary: "Remove Teacher",
  method: "delete",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ message: z.string() }),
      "The teacher item"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Not found"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
  },
});

// Get teachers by userId route definition
export const getByUserId = createRoute({
  tags,
  summary: "Get teachers by userId",
  method: "get",
  path: "/user/:userId",
  request: {
    params: z.object({
      userId: z.string().min(1, "Invalid user ID format"),
    }),
    query: queryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(teacher)),
      "The list of teachers filtered by userId"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "No teachers found for the given userId"
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
