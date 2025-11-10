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
import { comment, commentInsertSchema } from "./comment.schema";

const tags: string[] = ["Comment"];

export const list = createRoute({
  tags,
  summary: "List all comments",
  path: "/",
  method: "get",
  request: {
    query: queryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(comment)),
      "The list of comments"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
  },
});

export const getById = createRoute({
  tags,
  summary: "Get comment by ID",
  method: "get",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(comment, "The comment item"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Comment not found"
    ),
  },
});

export const getByPostId = createRoute({
  tags,
  summary: "Get comments by post ID",
  method: "get",
  path: "/post/:postId",
  request: {
    params: z.object({ postId: z.string() }),
    query: queryParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(comment)),
      "The list of comments for the post"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Post not found"
    ),
  },
});

export const create = createRoute({
  tags,
  summary: "Create comment",
  method: "post",
  path: "/",
  request: {
    body: jsonContentRequired(commentInsertSchema, "Create comment"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(comment, "The comment created"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Comment not created"
    ),
  },
});

export const remove = createRoute({
  tags,
  summary: "Remove Comment",
  method: "delete",
  path: "/:id",
  request: {
    params: stringIdParamSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ message: z.string() }),
      "The comment item"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(errorMessageSchema, "Not found"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
  },
});

export type ListRoute = typeof list;
export type GetByIdRoute = typeof getById;
export type GetByPostIdRoute = typeof getByPostId;
export type CreateRoute = typeof create;
export type RemoveRoute = typeof remove;
