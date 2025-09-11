// user.handlers.ts
import { eq, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import { db } from "@api/db";
import type { AppRouteHandler } from "@api/types";
import { user } from "@repo/database";

import type {
  CountRoute,
  GetByIdRoute,
  ListRoute,
  UpdateUserRoute,
} from "./user.routes";

// List all users
export const list: AppRouteHandler<ListRoute> = async (c) => {
  const results = await db.query.user.findMany();

  // Simple meta scaffold; wire real pagination later
  const page = 1;
  const limit = results.length || 1;
  const totalCount = results.length;
  const totalPages = Math.ceil(totalCount / Math.max(limit, 1));

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

// Get user by ID
export const getOne: AppRouteHandler<GetByIdRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const userRow = await db.query.user.findFirst({
    where: eq(user.id, String(id)),
  });
  if (!userRow) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }
  return c.json(userRow, HttpStatusCodes.OK);
};

// Get total user count
export const count: AppRouteHandler<CountRoute> = async (c) => {
  // drizzle-orm count(*)
  const [{ count } = { count: 0 }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(user);

  return c.json({ count: Number(count ?? 0) }, HttpStatusCodes.OK);
};

// Update user by ID
export const updateUser: AppRouteHandler<UpdateUserRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const updateData = c.req.valid("body");

  const updatedUser = await db
    .update(user)
    .set(updateData)
    .where(eq(user.id, String(id)))
    .returning();

  if (!updatedUser.length) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(updatedUser[0], HttpStatusCodes.OK);
};
