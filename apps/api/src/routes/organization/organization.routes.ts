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
  organizationInsertSchema,
  organizationSelectSchema,
  organizationUpdateSchema,
} from "./organization.schema";

const tags: string[] = ["Organization"];

// List route definition
export const list = createRoute({
  tags,
  summary: "List all organizations",
  path: "/",
  method: "get",
  request: {
    query: queryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(organizationSelectSchema)),
      "The list of organizations"
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
  summary: "Get organization by ID",
  method: "get",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      organizationSelectSchema,
      "The organization item"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Organization not found"
    ),
  },
});

// Create Organization route definition
export const create = createRoute({
  tags,
  summary: "Create organization",
  method: "post",
  path: "/",
  request: {
    body: jsonContentRequired(organizationInsertSchema, "Create organization"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      organizationSelectSchema,
      "The organization created"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      errorMessageSchema,
      "Organization not created"
    ),
  },
});

// Update organization route definition
export const update = createRoute({
  tags,
  summary: "Update Organization",
  method: "patch",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(
      organizationUpdateSchema,
      "Update organization details schema"
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      organizationSelectSchema,
      "The organization item"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Not found"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
  },
});

// Delete organization route schema
export const remove = createRoute({
  tags,
  summary: "Remove Organization",
  method: "delete",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ message: z.string() }),
      "The organization deleted"
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
export type CreateRoute = typeof create;
export type UpdateRoute = typeof update;
export type RemoveRoute = typeof remove;
