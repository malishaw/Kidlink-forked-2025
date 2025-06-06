import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";

import {
  selectIntegrationSchema,
  createIntegrationSchema,
  updateIntegrationSchema
} from "./integrations.schema";
import { notFoundSchema } from "@/lib/constants";
import { errorMessageSchema } from "@/lib/helpers";

const tags: string[] = ["Integrations"];

// List route definition
export const list = createRoute({
  tags,
  summary: "List all integrations",
  path: "/",
  method: "get",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectIntegrationSchema),
      "The list of integrations"
    )
  }
});

// Create route definition
export const create = createRoute({
  tags,
  summary: "Create a new integration",
  path: "/",
  method: "post",
  request: {
    body: jsonContentRequired(
      createIntegrationSchema,
      "The integration to create"
    )
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      selectIntegrationSchema,
      "The created integration"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized request, user not authenticated"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Internal server error"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(createIntegrationSchema),
      "The validation error(s)"
    )
  }
});

// Get single integration route definition
export const getOne = createRoute({
  tags,
  summary: "Get a single integration",
  method: "get",
  path: "/{id}",
  request: {
    params: IdParamsSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectIntegrationSchema,
      "Requested integration"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Integration not found"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid ID format"
    )
  }
});

// Patch route definition
export const patch = createRoute({
  tags,
  summary: "Update an integration",
  path: "/{id}",
  method: "patch",
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(
      updateIntegrationSchema,
      "The integration updates"
    )
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectIntegrationSchema,
      "The updated integration"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Integration not found"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(updateIntegrationSchema).or(
        createErrorSchema(IdParamsSchema)
      ),
      "The validation error(s)"
    )
  }
});

// Remove integration route definition
export const remove = createRoute({
  tags,
  summary: "Remove an integration",
  path: "/{id}",
  method: "delete",
  request: {
    params: IdParamsSchema
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "Integration deleted"
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Integration not found"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid ID format"
    )
  }
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
export type PatchRoute = typeof patch;
export type RemoveRoute = typeof remove;
