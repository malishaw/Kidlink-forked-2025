import { and, eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import { db } from "@api/db";
import type { AppRouteHandler } from "@api/types";
import { receipt } from "@repo/database";

import type {
  ListRoute,
  GetByIdRoute,
  CreateRoute,
  UpdateRoute,
  RemoveRoute,
} from "./receipts.routes";

// List
export const list: AppRouteHandler<ListRoute> = async (c) => {
  const results = await db.query.receipt.findMany({});
  const page = 1;
  const limit = results.length;
  const totalCount = results.length;
  const totalPages = Math.ceil(totalCount / (limit || 1));

  return c.json(
    { data: results, meta: { totalCount, limit, currentPage: page, totalPages } },
    HttpStatusCodes.OK
  );
};

// Create
export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const body = c.req.valid("json");
  const session = c.get("session");

  if (!session) {
    return c.json({ message: HttpStatusPhrases.UNAUTHORIZED }, HttpStatusCodes.UNAUTHORIZED);
  }

  const [inserted] = await db.insert(receipt).values(body).returning();

  return c.json(inserted, HttpStatusCodes.CREATED);
};

// Get one
export const getOne: AppRouteHandler<GetByIdRoute> = async (c) => {
  const { messageId, userId } = c.req.valid("param");

  const found = await db.query.receipt.findFirst({
    where: and(eq(receipt.messageId, messageId), eq(receipt.userId, userId)),
  });

  if (!found) {
    return c.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
  }

  return c.json(found, HttpStatusCodes.OK);
};

// Update
export const patch: AppRouteHandler<UpdateRoute> = async (c) => {
  const { messageId, userId } = c.req.valid("param");
  const updates = c.req.valid("json");
  const session = c.get("session");

  if (!session) {
    return c.json({ message: HttpStatusPhrases.UNAUTHORIZED }, HttpStatusCodes.UNAUTHORIZED);
  }

  const [updated] = await db
    .update(receipt)
    .set(updates)
    .where(and(eq(receipt.messageId, messageId), eq(receipt.userId, userId)))
    .returning();

  if (!updated) {
    return c.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
  }

  return c.json(updated, HttpStatusCodes.OK);
};

// Delete
export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
  const { messageId, userId } = c.req.valid("param");
  const session = c.get("session");

  if (!session) {
    return c.json({ message: HttpStatusPhrases.UNAUTHORIZED }, HttpStatusCodes.UNAUTHORIZED);
  }

  const [deleted] = await db
    .delete(receipt)
    .where(and(eq(receipt.messageId, messageId), eq(receipt.userId, userId)))
    .returning();

  if (!deleted) {
    return c.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
  }

  return c.body(null, HttpStatusCodes.NO_CONTENT);
};
