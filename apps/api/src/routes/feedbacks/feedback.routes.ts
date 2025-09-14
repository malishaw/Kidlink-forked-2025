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
  feedback,
  feedbackInsertSchema,
  feedbackUpdateSchema,
} from "./feedback.schema";

const tags: string[] = ["Feedback"];

// List route definition
export const list = createRoute({
  tags,
  summary: "List all feedback",
  path: "/",
  method: "get",
  request: {
    query: queryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(feedback)),
      "The list of feedback"
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
  summary: "Get feedback by ID",
  method: "get",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(feedback, "The feedback item"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Feedback not found"
    ),
  },
});

// Get feedbacks by child ID route definition
export const getByChildId = createRoute({
  tags,
  summary: "Get feedbacks by child ID",
  method: "get",
  path: "/child/:childId",
  request: {
    params: z.object({ childId: z.string() }),
    query: queryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(feedback)),
      "The list of feedbacks for the child"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Child not found"
    ),
  },
});

// Create Feedback route definition
export const create = createRoute({
  tags,
  summary: "Create feedback",
  method: "post",
  path: "/",
  request: {
    body: jsonContentRequired(feedbackInsertSchema, "Create uploaded feedback"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(feedback, "The feedback created"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Feedback not created"
    ),
  },
});

// Update feedback route definition
export const update = createRoute({
  tags,
  summary: "Update Feedback",
  method: "patch",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(
      feedbackUpdateSchema,
      "Update feedback details schema"
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      feedbackUpdateSchema,
      "The feedback item"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Not found"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
  },
});

// Delete feedback route schema
export const remove = createRoute({
  tags,
  summary: "Remove Feedback",
  method: "delete",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ message: z.string() }),
      "The feedback item"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Not found"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
  },
});

// Export types
export type ListRoute = typeof list;
export type GetByIdRoute = typeof getById;
export type GetByChildIdRoute = typeof getByChildId;
export type CreateRoute = typeof create;
export type UpdateRoute = typeof update;
export type RemoveRoute = typeof remove;
