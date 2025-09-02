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
  paymentsInsertSchema,
  paymentsSchema,
  paymentsUpdateSchema,
} from "./payments.schema";

const tags: string[] = ["payments"];

// List route definition
export const list = createRoute({
  tags,
  summary: "List all payments",
  path: "/",
  method: "get",
  request: {
    query: queryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(paymentsSchema)),
      "The list of payments items"
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
  summary: "Get payments by ID",
  method: "get",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(paymentsSchema, "The payments item"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "payments not found"
    ),
  },
});

// Create payments route definition
export const create = createRoute({
  tags,
  summary: "Create payments",
  method: "post",
  path: "/",
  request: {
    body: jsonContentRequired(paymentsInsertSchema, "Create uploaded payments"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      paymentsSchema,
      "The payments created"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "payments not created"
    ),
  },
});

// Update payments route definition
export const update = createRoute({
  tags,
  summary: "Update payments",
  method: "patch",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(
      paymentsUpdateSchema,
      "Update payments details schema"
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      paymentsUpdateSchema,
      "The payments item"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Not found"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
  },
});

// Delete payments route definition
export const remove = createRoute({
  method: "delete",
  path: "/:id",
  tags: ["payments"],
  summary: "Delete a payments",
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
