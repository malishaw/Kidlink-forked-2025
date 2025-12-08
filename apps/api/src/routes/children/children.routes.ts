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
  children,
  childrenInsertSchema,
  childrenUpdateSchema,
} from "./children.schema";

const tags: string[] = ["Children"];

// Extended query params schema to include childId filter
const extendedQueryParamsSchema = queryParamsSchema.extend({
  childId: z.string().optional(),
});

// List route definition with optional childId query parameter
export const list = createRoute({
  tags,
  summary: "List all children",
  path: "/",
  method: "get",
  request: {
    query: extendedQueryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(children)),
      "The list of children, optionally filtered by childId"
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
  summary: "Get children by ID",
  method: "get",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(children, "The children item"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Children not found"
    ),
  },
});

// Create Children route definition
export const create = createRoute({
  tags,
  summary: "Create children",
  method: "post",
  path: "/",
  request: {
    body: jsonContentRequired(childrenInsertSchema, "Create uploaded children"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(children, "The children created"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Children not created"
    ),
  },
});

// Update children route definition
export const update = createRoute({
  tags,
  summary: "Update Children",
  method: "patch",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(
      childrenUpdateSchema,
      "Update children details schema"
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      childrenUpdateSchema,
      "The children item"
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
  tags: ["Children"],
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

// Get children by parent ID route definition
export const getByParentId = createRoute({
  tags,
  summary: "Get children by parent ID",
  method: "get",
  path: "/parent/:parentId",
  request: {
    params: z.object({
      parentId: z.string(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(children)),
      "The list of children for the given parent ID"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "No children found for the given parent ID"
    ),
  },
});

// Update the listWithObjects route with enhanced nursery object
export const listWithObjects = createRoute({
  tags,
  summary: "List all children with populated objects",
  path: "/with-objects",
  method: "get",
  request: {
    query: extendedQueryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(
        z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            organizationId: z.string().nullable(),
            nursery: z
              .object({
                id: z.string(),
                name: z.string(),
                address: z.string().nullable(),
                phoneNumber: z.string().nullable(),
                email: z.string().nullable(),
                organizationId: z.string().nullable(),
                capacity: z.number().nullable(),
                description: z.string().nullable(),
                imageUrl: z.string().nullable(),
                operatingHours: z.string().nullable(),
                facilities: z.string().nullable(),
                ageRange: z.string().nullable(),
                createdAt: z.string().nullable(),
                updatedAt: z.string().nullable(),
              })
              .nullable(),
            parent: z
              .object({
                id: z.string(),
                name: z.string(),
                email: z.string(),
                phoneNumber: z.string(),
                address: z.string().nullable(),
                occupation: z.string().nullable(),
                emergencyContact: z.string().nullable(),
                createdAt: z.string().nullable(),
                updatedAt: z.string().nullable(),
              })
              .nullable(),
            class: z
              .object({
                id: z.string(),
                name: z.string(),
                teacherId: z.string().nullable(),
                teacherName: z.string().nullable(),
                capacity: z.number().nullable(),
                ageRange: z.string().nullable(),
                description: z.string().nullable(),
                schedule: z.string().nullable(),
                createdAt: z.string().nullable(),
                updatedAt: z.string().nullable(),
              })
              .nullable(),
            badges: z.array(
              z.object({
                id: z.string(),
                name: z.string(),
                description: z.string().nullable(),
                imageUrl: z.string().nullable(),
                category: z.string().nullable(),
                points: z.number().nullable(),
                requirements: z.string().nullable(),
                earnedAt: z.string().nullable(),
              })
            ),
            dateOfBirth: z.string().nullable(),
            gender: z.string().nullable(),
            emergencyContact: z.string().nullable(),
            medicalNotes: z.string().nullable(),
            profileImageUrl: z.string().nullable(),
            imagesUrl: z.string().nullable(),
            activities: z.string().nullable(),
            createdAt: z.string().nullable(),
            updatedAt: z.string().nullable(),
          })
        )
      ),
      "The list of children with populated objects including complete nursery details"
    ),
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
export type GetByParentIdRoute = typeof getByParentId;
export type ListWithObjectsRoute = typeof listWithObjects;
