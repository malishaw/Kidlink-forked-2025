import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";

import { errorMessageSchema, stringIdParamSchema } from "@/lib/helpers";
import {
  selectIntegrationSchema,
  updateIntegrationSchema
} from "./integrations.schema";

const tags: string[] = ["Integration Details"];

/**
 * Integrations are Subsidary element of Organization
 * - Therefore, Get Integration by Organization ID is Enough.
 */
export const getOne = createRoute({
  tags,
  summary: "Get Integration Details by ID",
  method: "get",
  path: "/{id}",
  request: {
    params: stringIdParamSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectIntegrationSchema,
      "Requested integration"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized error"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Passed Integration ID is not found"
    )
  }
});

// Update Integration Details by ID
export const update = createRoute({
  tags,
  summary: "Update Integration Details by ID",
  path: "/{id}",
  method: "patch",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(
      updateIntegrationSchema,
      "Integration details to update"
    )
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectIntegrationSchema,
      "Requested integration"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized error"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Passed Integration ID is not found"
    )
  }
});

export type GetOneRoute = typeof getOne;
export type UpdateRoute = typeof update;
