import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import { db } from "@api/db";
import type { AppRouteHandler } from "@api/types";
import { teachers } from "@repo/database";

import type {
  CreateRoute,
  GetByIdRoute,
  GetByUserIdRoute,
  ListRoute,
  RemoveRoute,
  UpdateRoute,
} from "./teacher.routes";

// 🔍 List all teachers with filtering by organization ID
export const list: AppRouteHandler<ListRoute> = async (c) => {
  const session = c.get("session");

  if (!session?.activeOrganizationId) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const organizationId = session.activeOrganizationId;

  // Fetch teachers filtered by the current organization ID
  const results = await db.query.teachers.findMany({
    where: eq(teachers.organizationId, organizationId),
  });

  const page = 1; // or from query params
  const limit = results.length; // or from query params
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

// Create new teacher
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
    .insert(teachers)
    .values({
      ...body,
      organizationId: session.activeOrganizationId,
      userId: session.userId,
      createdAt: new Date(),
    })
    .returning();

  return c.json(inserted, HttpStatusCodes.CREATED);
};

// 🔍 Get a single teacher
export const getOne: AppRouteHandler<GetByIdRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const teacher = await db.query.teachers.findFirst({
    where: eq(teachers.id, String(id)),
  });

  if (!teacher) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(teacher, HttpStatusCodes.OK);
};

// Update teacher
export const patch: AppRouteHandler<UpdateRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const updates = c.req.valid("json");
  const session = c.get("user");

  if (!session) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const [updated] = await db
    .update(teachers)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(eq(teachers.id, String(id)))
    .returning();

  if (!updated) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(updated, HttpStatusCodes.OK);
};

//  Delete teacher
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
    .delete(teachers)
    .where(eq(teachers.id, String(id)))
    .returning();

  if (!deleted) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.body(null, HttpStatusCodes.NO_CONTENT);
};

// 🔍 Get teachers by userId
export const getByUserId: AppRouteHandler<GetByUserIdRoute> = async (c) => {
  const { userId } = c.req.valid("param");

  // Fetch teachers filtered by userId
  const results = await db.query.teachers.findMany({
    where: eq(teachers.userId, userId),
  });

  // if (results.length === 0) {
  //   return c.json(
  //     { message: HttpStatusPhrases.NOT_FOUND },
  //     HttpStatusCodes.NOT_FOUND
  //   );
  // }

  const page = 1; // or from query params
  const limit = results.length; // or from query params
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
