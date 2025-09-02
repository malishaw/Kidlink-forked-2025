import { eq, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import { db } from "@api/db";
import type { AppRouteHandler } from "@api/types";
import { feedbacks } from "../../../../../packages/database/src/schemas/feedbacks.schema";

import type {
  CreateRoute,
  GetByIdRoute,
  ListRoute,
  RemoveRoute,
  UpdateRoute,
} from "./feedbacks.routes";

// 🔍 List all feedbacks
export const list: AppRouteHandler<ListRoute> = async (c) => {
  const {
    page = "1",
    limit = "10",
    sort = "desc",
    search,
  } = c.req.valid("query");

  const pageNumber = parseInt(page, 10);
  const pageSize = parseInt(limit, 10);
  const offset = (pageNumber - 1) * pageSize;

  // Build conditions
  let conditions = undefined;
  if (search) {
    conditions = sql`lower(${feedbacks.content}) like ${"%" + search.toLowerCase() + "%"}`;
  }

  // Get total count
  const totalCountResult = await db
    .select({ totalCount: sql<number>`count(*)`.as("totalCount") })
    .from(feedbacks)
    .where(conditions);

  const totalCount = totalCountResult[0]?.totalCount ?? 0;

  // Get feedbacks
  const data = await db
    .select()
    .from(feedbacks)
    .where(conditions)
    .orderBy(
      sort === "desc"
        ? sql`${feedbacks.createdAt} desc`
        : sql`${feedbacks.createdAt} asc`
    )
    .limit(pageSize)
    .offset(offset);

  const totalPages = Math.ceil(totalCount / pageSize);

  return c.json(
    {
      data,
      meta: {
        limit: pageSize,
        currentPage: pageNumber,
        totalCount,
        totalPages,
      },
    },
    HttpStatusCodes.OK
  );
};

// Create new feedback
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
    .insert(feedbacks)
    .values({
      ...body,
      organizationId: session.activeOrganizationId,
      teacherId: session.userId, // Teacher creating the feedback
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  return c.json(inserted, HttpStatusCodes.CREATED);
};

// 🔍 Get a single feedback
export const getOne: AppRouteHandler<GetByIdRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const feedback = await db.query.feedbacks.findFirst({
    where: eq(feedbacks.id, Number(id)),
  });

  if (!feedback) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(feedback, HttpStatusCodes.OK);
};

// Update feedback
export const patch: AppRouteHandler<UpdateRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const updates = c.req.valid("json");
  const session = c.get("session");

  if (!session) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const [updated] = await db
    .update(feedbacks)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(eq(feedbacks.id, Number(id)))
    .returning();

  if (!updated) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(updated, HttpStatusCodes.OK);
};

// Delete feedback
export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const session = c.get("session");

  if (!session) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const deleted = await db
    .delete(feedbacks)
    .where(eq(feedbacks.id, Number(id)))
    .returning();

  if (!deleted.length) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.body(null, HttpStatusCodes.NO_CONTENT);
};
