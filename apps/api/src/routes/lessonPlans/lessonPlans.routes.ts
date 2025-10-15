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
  lessonPlan,
  lessonPlanInsertSchema,
  lessonPlanUpdateSchema,
} from "./lessonPlans.schema";

const tags: string[] = ["LessonPlan"];

// List route definition
export const list = createRoute({
  tags,
  summary: "List all lessonPlan",
  path: "/",
  method: "get",
  request: {
    query: queryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(lessonPlan)),
      "The list of lessonPlan"
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
  summary: "Get lessonPlan by ID",
  method: "get",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(lessonPlan, "The lessonPlan item"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "LessonPlan not found"
    ),
  },
});

// Get lesson plans by class ID route definition
export const getByClassId = createRoute({
  tags,
  summary: "Get lesson plans by class ID",
  method: "get",
  path: "/class/:classId",
  request: {
    params: z.object({
      classId: z.string(),
    }),
    query: queryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(lessonPlan)),
      "The list of lesson plans for the class"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "No lesson plans found for this class"
    ),
  },
});

// Create LessonPlan route definition
export const create = createRoute({
  tags,
  summary: "Create lessonPlan",
  method: "post",
  path: "/",
  request: {
    body: jsonContentRequired(
      lessonPlanInsertSchema,
      "Create uploaded lessonPlan"
    ),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      lessonPlan,
      "The lessonPlan created"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "LessonPlan not created"
    ),
  },
});

// Update lessonPlan route definition
export const update = createRoute({
  tags,
  summary: "Update LessonPlan",
  method: "patch",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(
      lessonPlanUpdateSchema,
      "Update lessonPlan details schema"
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      lessonPlanUpdateSchema,
      "The lessonPlan item"
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
  tags: ["LessonPlan"],
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
export type GetByClassIdRoute = typeof getByClassId;
export type CreateRoute = typeof create;
export type UpdateRoute = typeof update;
export type RemoveRoute = typeof remove;
