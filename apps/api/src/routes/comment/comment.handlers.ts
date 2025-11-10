import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import { db } from "@api/db";
import type { AppRouteHandler } from "@api/types";
import { postComments } from "@repo/database";

import type {
  CreateRoute,
  GetByIdRoute,
  GetByPostIdRoute,
  ListRoute,
  RemoveRoute,
} from "./comment.routes";

// List all comments
export const list: AppRouteHandler<ListRoute> = async (c) => {
  const results = await db.query.postComments.findMany({});
  const page = 1;
  const limit = results.length;
  const totalCount = results.length;
  const totalPages = Math.ceil(totalCount / limit);

  return c.json(
    {
      data: results,
      meta: {
        totalCount,
        limit,
        currentPage: page,
        totalPages,
      },
    },
    HttpStatusCodes.OK
  );
};

// Create new comment
export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const body = c.req.valid("json");
  const session = c.get("session");

  if (!session) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const [inserted] = await db
    .insert(postComments)
    .values({
      ...body,
      organizationId: session.activeOrganizationId,
      userId: session.userId || session.user?.id,
      createdAt: new Date(),
    })
    .returning();

  return c.json(inserted, HttpStatusCodes.CREATED);
};

// Get a single comment
export const getOne: AppRouteHandler<GetByIdRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const found = await db.query.postComments.findFirst({
    where: eq(postComments.id, String(id)),
  });

  if (!found) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(found, HttpStatusCodes.OK);
};

// Get comments by post id
export const getByPostId: AppRouteHandler<GetByPostIdRoute> = async (c) => {
  const { postId } = c.req.valid("param");
  const session = c.get("session");

  if (!session) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const results = await db.query.postComments.findMany({
    where: eq(postComments.postId, String(postId)),
    orderBy: (pc, { desc }) => [desc(pc.createdAt)],
  });

  const page = 1;
  const limit = results.length;
  const totalCount = results.length;
  const totalPages = Math.ceil(totalCount / limit);

  return c.json(
    {
      data: results,
      meta: {
        totalCount,
        limit,
        currentPage: page,
        totalPages,
      },
    },
    HttpStatusCodes.OK
  );
};

// Delete comment
export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const session = c.get("user") as { organizationId?: string } | undefined;

  if (!session) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const [deleted] = await db
    .delete(postComments)
    .where(eq(postComments.id, String(id)))
    .returning();

  if (!deleted) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(
    { message: "Comment deleted successfully" },
    HttpStatusCodes.OK
  );
};
