import { and, eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import { db } from "@api/db";
import type { AppRouteHandler } from "@api/types";
import { chatMember } from "@repo/database";

import type {
  ListRoute,
  GetByIdRoute,
  CreateRoute,
  UpdateRoute,
  RemoveRoute,
} from "./chatMembers.routes";

// 🔍 List chat members
export const list: AppRouteHandler<ListRoute> = async (c) => {
  const results = await db.query.chatMember.findMany({});
  const page = 1;
  const limit = results.length;
  const totalCount = results.length;
  const totalPages = Math.ceil(totalCount / (limit || 1));

  return c.json(
    { data: results, meta: { totalCount, limit, currentPage: page, totalPages } },
    HttpStatusCodes.OK
  );
};

// ➕ Create chat member
export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const session = c.get("session");

  if (!session) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  // ✅ Make sure TypeScript knows body includes userId
  const body = c.req.valid("json") as {
    chatId: string;
    userId: string;
    role?: string;
    isMuted?: boolean;
    isArchived?: boolean;
    lastReadMessageId?: string | null;
  };

  const [inserted] = await db.insert(chatMember).values(body).returning();

  return c.json(inserted, HttpStatusCodes.CREATED);
};

// 🔍 Get chat member
export const getOne: AppRouteHandler<GetByIdRoute> = async (c) => {
  const { chatId, userId } = c.req.valid("param");

  const found = await db.query.chatMember.findFirst({
    where: and(eq(chatMember.chatId, chatId), eq(chatMember.userId, userId)),
  });

  if (!found) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(found, HttpStatusCodes.OK);
};

// ✏️ Update chat member
export const patch: AppRouteHandler<UpdateRoute> = async (c) => {
  const { chatId, userId } = c.req.valid("param");
  const updates = c.req.valid("json");
  const session = c.get("session");

  if (!session) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const [updated] = await db
    .update(chatMember)
    .set(updates)
    .where(and(eq(chatMember.chatId, chatId), eq(chatMember.userId, userId)))
    .returning();

  if (!updated) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(updated, HttpStatusCodes.OK);
};

// 🗑 Delete chat member
export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
  const { chatId, userId } = c.req.valid("param");
  const session = c.get("session");

  if (!session) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const [deleted] = await db
    .delete(chatMember)
    .where(and(eq(chatMember.chatId, chatId), eq(chatMember.userId, userId)))
    .returning();

  if (!deleted) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.body(null, HttpStatusCodes.NO_CONTENT);
};
