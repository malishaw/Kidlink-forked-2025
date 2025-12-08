import { and, eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import { db } from "@api/db";
import type { AppRouteHandler } from "@api/types";
import { nurseries } from "@repo/database";

import type {
  CreateRoute,
  GetByIdRoute,
  GetMyNurseryRoute,
  ListRoute,
  RemoveRoute,
  UpdateRoute,
} from "./nursery.routes";

// Session shape placed on ctx by your auth middleware
type Session = {
  userId: string;
  activeOrganizationId?: string | null;
};

// 🔍 List ONLY nurseries created by the logged-in user (optionally scoped by org)
export const list: AppRouteHandler<ListRoute> = async (c) => {
  const session = c.get("session") as Session | undefined;

  if (!session?.userId) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const where = session.activeOrganizationId
    ? and(eq(nurseries.organizationId, session.activeOrganizationId))
    : eq(nurseries.createdBy, session.userId);

  const results = await db.query.nurseries.findMany({ where });

  // TODO: wire real pagination using query params
  const page = 1;
  const limit = results.length;
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

// ➕ Create new nursery (owned by current user/org)
export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const body = c.req.valid("json");
  const session = c.get("session") as Session | undefined;

  if (!session?.userId) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const now = new Date();

  const [inserted] = await db
    .insert(nurseries)
    .values({
      ...body,
      organizationId: session.activeOrganizationId ?? "",
      createdBy: session.userId,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  return c.json(inserted, HttpStatusCodes.CREATED);
};

// 🔎 Get one nursery (must belong to the logged-in user)
export const getOne: AppRouteHandler<GetByIdRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const session = c.get("session") as Session | undefined;

  if (!session?.userId) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const where = session.activeOrganizationId
    ? and(
        eq(nurseries.id, String(id)),
        eq(nurseries.createdBy, session.userId),
        eq(nurseries.organizationId, session.activeOrganizationId)
      )
    : and(
        eq(nurseries.id, String(id)),
        eq(nurseries.createdBy, session.userId)
      );

  const item = await db.query.nurseries.findFirst({ where });

  if (!item) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(item, HttpStatusCodes.OK);
};

// ✏️ Update (only your own row)
export const patch: AppRouteHandler<UpdateRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const updates = c.req.valid("json");
  const session = c.get("session") as Session | undefined;

  if (!session?.userId) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const where = session.activeOrganizationId
    ? and(
        eq(nurseries.id, String(id)),
        eq(nurseries.createdBy, session.userId),
        eq(nurseries.organizationId, session.activeOrganizationId)
      )
    : and(
        eq(nurseries.id, String(id)),
        eq(nurseries.createdBy, session.userId)
      );

  const [updated] = await db
    .update(nurseries)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(where)
    .returning();

  if (!updated) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(updated, HttpStatusCodes.OK);
};

// 🗑️ Delete (only your own row)
export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const session = c.get("session") as Session | undefined;

  if (!session?.userId) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const where = session.activeOrganizationId
    ? and(
        eq(nurseries.id, String(id)),
        eq(nurseries.createdBy, session.userId),
        eq(nurseries.organizationId, session.activeOrganizationId)
      )
    : and(
        eq(nurseries.id, String(id)),
        eq(nurseries.createdBy, session.userId)
      );

  const [deleted] = await db.delete(nurseries).where(where).returning();

  if (!deleted) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.body(null, HttpStatusCodes.NO_CONTENT);
};

export const getMyNursery: AppRouteHandler<GetMyNurseryRoute> = async (c) => {
  const session = c.get("session") as Session | undefined;

  if (!session?.userId || !session.activeOrganizationId) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  // Get nursery by organization only (not requiring createdBy match)
  const nursery = await db.query.nurseries.findFirst({
    where: eq(nurseries.organizationId, session.activeOrganizationId),
  });

  if (!nursery) {
    return c.json(
      {
        message: "No nursery found for your organization.",
        organizationId: session.activeOrganizationId,
      },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(nursery, HttpStatusCodes.OK);
};
