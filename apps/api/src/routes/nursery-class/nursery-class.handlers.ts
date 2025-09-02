import { and, eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import { db } from "@api/db";
import type { AppRouteHandler } from "@api/types";
import { classes, nurseries } from "@repo/database";

import type {
  CreateRoute,
  GetByIdRoute,
  ListRoute,
  RemoveRoute,
  UpdateRoute,
} from "./nursery-class.routes";

// Session shape placed on ctx by your auth middleware
type Session = {
  userId: string;
  activeOrganizationId?: string | null;
};

// 🔍 List ONLY classes whose parent nursery belongs to the logged-in user (and org if present)
export const list: AppRouteHandler<ListRoute> = async (c) => {
  const session = c.get("session") as Session | undefined;

  if (!session?.userId) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  // Join classes -> nurseries to enforce ownership/org constraints
  const where = session.activeOrganizationId
    ? and(
        eq(nurseries.createdBy, session.userId),
        eq(nurseries.organizationId, session.activeOrganizationId)
      )
    : eq(nurseries.createdBy, session.userId);

  const rows = await db
    .select({
      id: classes.id,
      nurseryId: classes.nurseryId,
      name: classes.name,
      mainTeacherId: classes.mainTeacherId,
      teacherIds: classes.teacherIds,
      childIds: classes.childIds,
      createdAt: classes.createdAt,
      updatedAt: classes.updatedAt,
    })
    .from(classes)
    .innerJoin(nurseries, eq(nurseries.id, classes.nurseryId))
    .where(where);

  // TODO: wire real pagination using query params
  const page = 1;
  const limit = rows.length;
  const totalCount = rows.length;
  const totalPages = Math.ceil(totalCount / Math.max(limit, 1));

  return c.json(
    {
      data: rows,
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

// ➕ Create new class (auto-pick nursery if omitted; otherwise verify ownership)
export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const body = c.req.valid("json");
  const session = c.get("session") as Session | undefined;

  if (!session?.userId) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  // Resolve/validate nurseryId according to logged-in user + org
  let resolvedNurseryId: string | undefined = body.nurseryId ?? undefined;

  if (!resolvedNurseryId) {
    // Try to auto-pick the only nursery owned by this user (and org, if set)
    const ownershipWhere = session.activeOrganizationId
      ? and(
          eq(nurseries.createdBy, session.userId),
          eq(nurseries.organizationId, session.activeOrganizationId)
        )
      : eq(nurseries.createdBy, session.userId);

    const ownedNurseries = await db
      .select({ id: nurseries.id })
      .from(nurseries)
      .where(ownershipWhere);

    if (ownedNurseries.length === 0) {
      return c.json(
        { message: "Parent nursery not found" },
        HttpStatusCodes.NOT_FOUND
      );
    }
    if (ownedNurseries.length > 1) {
      return c.json(
        {
          message:
            "Multiple nurseries found for your account. Please specify nurseryId.",
        },
        HttpStatusCodes.BAD_REQUEST
      );
    }

    resolvedNurseryId = ownedNurseries[0]?.id as unknown as string;
  } else {
    // Validate provided nurseryId is owned by the user (and org, if set)
    const nurseryWhere = session.activeOrganizationId
      ? and(
          eq(nurseries.id, resolvedNurseryId),
          eq(nurseries.createdBy, session.userId),
          eq(nurseries.organizationId, session.activeOrganizationId)
        )
      : and(
          eq(nurseries.id, resolvedNurseryId),
          eq(nurseries.createdBy, session.userId)
        );

    const parent = await db.query.nurseries.findFirst({ where: nurseryWhere });
    if (!parent) {
      return c.json(
        { message: HttpStatusPhrases.NOT_FOUND },
        HttpStatusCodes.NOT_FOUND
      );
    }
  }

  const now = new Date();

  // Normalize arrays if provided (dedupe)
  const teacherIds = Array.isArray(body.teacherIds)
    ? Array.from(new Set(body.teacherIds))
    : undefined;
  const childIds = Array.isArray(body.childIds)
    ? Array.from(new Set(body.childIds))
    : undefined;

  const [inserted] = await db
    .insert(classes)
    .values({
      ...body,
      nurseryId: resolvedNurseryId!,
      teacherIds,
      childIds,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  return c.json(inserted, HttpStatusCodes.CREATED);
};

// 🔎 Get one class (must belong to a nursery owned by the logged-in user)
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
        eq(classes.id, String(id)),
        eq(nurseries.id, classes.nurseryId),
        eq(nurseries.createdBy, session.userId),
        eq(nurseries.organizationId, session.activeOrganizationId)
      )
    : and(
        eq(classes.id, String(id)),
        eq(nurseries.id, classes.nurseryId),
        eq(nurseries.createdBy, session.userId)
      );

  const row = await db
    .select({
      id: classes.id,
      nurseryId: classes.nurseryId,
      name: classes.name,
      mainTeacherId: classes.mainTeacherId,
      teacherIds: classes.teacherIds,
      childIds: classes.childIds,
      createdAt: classes.createdAt,
      updatedAt: classes.updatedAt,
    })
    .from(classes)
    .innerJoin(nurseries, eq(nurseries.id, classes.nurseryId))
    .where(where)
    .limit(1);

  const item = row[0];

  if (!item) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(item, HttpStatusCodes.OK);
};

// ✏️ Update (only if the class's parent nursery is owned by the user)
// If nurseryId is being changed, the new nursery must also be owned by the user.
export const patch: AppRouteHandler<UpdateRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const updates = c.req.valid("json");
  const session = c.get("session") as Session | undefined;

  if (!session?.userId) {
    throw new Error(HttpStatusPhrases.UNAUTHORIZED);
  }

  // Disallow clearing nurseryId to null; ownership checks rely on join
  if ("nurseryId" in updates && updates.nurseryId === null) {
    throw new Error("nurseryId cannot be set to null");
  }

  // First ensure the class is currently owned (via its parent nursery)
  const ownershipWhere = session.activeOrganizationId
    ? and(
        eq(classes.id, String(id)),
        eq(nurseries.id, classes.nurseryId),
        eq(nurseries.createdBy, session.userId),
        eq(nurseries.organizationId, session.activeOrganizationId)
      )
    : and(
        eq(classes.id, String(id)),
        eq(nurseries.id, classes.nurseryId),
        eq(nurseries.createdBy, session.userId)
      );

  const existing = await db
    .select({ classId: classes.id })
    .from(classes)
    .innerJoin(nurseries, eq(nurseries.id, classes.nurseryId))
    .where(ownershipWhere)
    .limit(1);

  if (!existing.length) {
    throw new Error(HttpStatusPhrases.NOT_FOUND);
  }

  // If changing nurseryId, validate the new parent is also owned
  if (updates.nurseryId) {
    const nurseryWhere = session.activeOrganizationId
      ? and(
          eq(nurseries.id, updates.nurseryId),
          eq(nurseries.createdBy, session.userId),
          eq(nurseries.organizationId, session.activeOrganizationId)
        )
      : and(
          eq(nurseries.id, updates.nurseryId),
          eq(nurseries.createdBy, session.userId)
        );

    const newParent = await db.query.nurseries.findFirst({
      where: nurseryWhere,
    });
    if (!newParent) {
      throw new Error("Target nursery not found");
    }
  }

  // Normalize arrays if present
  const teacherIds = Array.isArray(updates.teacherIds)
    ? Array.from(new Set(updates.teacherIds))
    : undefined;
  const childIds = Array.isArray(updates.childIds)
    ? Array.from(new Set(updates.childIds))
    : undefined;

  const [updated] = await db
    .update(classes)
    .set({
      ...updates,
      ...(teacherIds ? { teacherIds } : {}),
      ...(childIds ? { childIds } : {}),
      updatedAt: new Date(),
    })
    .where(eq(classes.id, String(id)))
    .returning();

  if (!updated) {
    throw new Error(HttpStatusPhrases.NOT_FOUND);
  }

  return c.json(updated, HttpStatusCodes.OK);
};

// 🗑️ Delete (only if the class's parent nursery is owned by the user)
export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const session = c.get("session") as Session | undefined;

  if (!session?.userId) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  // Confirm ownership via join
  const ownershipWhere = session.activeOrganizationId
    ? and(
        eq(classes.id, String(id)),
        eq(nurseries.id, classes.nurseryId),
        eq(nurseries.createdBy, session.userId),
        eq(nurseries.organizationId, session.activeOrganizationId)
      )
    : and(
        eq(classes.id, String(id)),
        eq(nurseries.id, classes.nurseryId),
        eq(nurseries.createdBy, session.userId)
      );

  const existing = await db
    .select({ classId: classes.id })
    .from(classes)
    .innerJoin(nurseries, eq(nurseries.id, classes.nurseryId))
    .where(ownershipWhere)
    .limit(1);

  if (!existing.length) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  const [deleted] = await db
    .delete(classes)
    .where(eq(classes.id, String(id)))
    .returning();

  if (!deleted) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.body(null, HttpStatusCodes.NO_CONTENT);
};
