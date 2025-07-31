import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { z } from "zod";

import {
  errorMessageSchema,
  queryParamsSchema,
  stringIdParamSchema
} from "@api/lib/helpers";
import {
  hotelTypeInsertSchema,
  hotelTypeSchema,
  hotelTypeUpdateSchema
} from "./hotel.schema";

const tags: string[] = ["Hotels"];

/**
 * ================================================================
 * Hotel Types Routes
 * ================================================================
 */
// List all hotel types route definition
export const listAllHotelTypesRoute = createRoute({
  tags,
  summary: "List all hotel types",
  path: "/types",
  method: "get",
  request: {
    query: queryParamsSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(hotelTypeSchema),
      "The list of hotel types"
    )
  }
});

// Create new hotel type route Definition
export const createNewHotelTypeRoute = createRoute({
  tags,
  summary: "Create new hotel type",
  method: "post",
  path: "/types",
  request: {
    body: jsonContentRequired(hotelTypeInsertSchema, "Hotel type insert data")
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      hotelTypeSchema,
      "Created new hotel type"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      errorMessageSchema,
      "Forbidden access"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Could not create hotel type"
    )
  }
});

// Update existing hotel type route Definition
export const updateHotelTypeRoute = createRoute({
  tags,
  summary: "Update existing hotel type",
  method: "patch",
  path: "/types/:id",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(hotelTypeUpdateSchema, "Hotel type update data")
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      hotelTypeSchema,
      "The updated hotel type"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Not found"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      errorMessageSchema,
      "Forbidden access"
    )
  }
});

// Delete existing hotel type route schema
export const removeHotelTypeRoute = createRoute({
  tags,
  summary: "Remove hotel type",
  method: "delete",
  path: "/types/:id",
  request: {
    params: stringIdParamSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ message: z.string() }),
      "The hotel type deleted"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Not found"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      errorMessageSchema,
      "Forbidden access"
    )
  }
});

// Export Hotel types route Types
export type ListHotelTypesRoute = typeof listAllHotelTypesRoute;
export type CreateHotelTypeRoute = typeof createNewHotelTypeRoute;
export type UpdateHotelTypeRoute = typeof updateHotelTypeRoute;
export type RemoveHotelTypeRoute = typeof removeHotelTypeRoute;
