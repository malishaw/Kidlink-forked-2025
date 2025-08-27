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
  feedbacksInsertSchema,
  feedbacksSchema,
  feedbacksUpdateSchema,
} from "./feedbacks.schema";

const tags: string[] = ["feedbacks"];

// List route definition
export const list = createRoute({
  tags,
  summary: "List all feedbacks",
  path: "/",
  method: "get",
  request: {
    query: queryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(feedbacksSchema)),
      "The list of feedbacks"
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
  summary: "Get feedbacks by ID",
  method: "get",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(feedbacksSchema, "The feedbacks item"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "feedbacks not found"
    ),
  },
});

// Create feedbacks route definition
export const create = createRoute({
  tags,
  summary: "Create feedbacks",
  method: "post",
  path: "/",
  request: {
    body: jsonContentRequired(
      feedbacksInsertSchema,
      "Create uploaded feedbacks"
    ),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      feedbacksSchema,
      "The feedbacks created"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "feedbacks not created"
    ),
  },
});

// Update feedbacks route definition
export const update = createRoute({
  tags,
  summary: "Update feedbacks",
  method: "patch",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(
      feedbacksUpdateSchema,
      "Update feedbacks details schema"
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(feedbacksSchema, "The feedbacks item"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Not found"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
  },
});

// Delete feedbacks route definition
export const remove = createRoute({
  method: "delete",
  path: "/:id",
  tags: ["feedbacks"],
  summary: "Delete a feedbacks by ID",
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
