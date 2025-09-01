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

// 🔍 List ONLY classes whose parent nursery belongs to the logged-in user
export const list: AppRouteHandler<ListRoute> = async (c) => {
  const session = c.get("session") as Session | undefined;
  if (!session?.userId) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

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
      createdAt: classes.createdAt,
      updatedAt: classes.updatedAt,
    })
    .from(classes)
    .innerJoin(nurseries, eq(nurseries.id, classes.nurseryId))
    .where(where);

  const page = 1;
  const limit = rows.length;
  const totalCount = rows.length;
  const totalPages = Math.ceil(totalCount / Math.max(limit, 1));

  return c.json(
    {
      data: rows,
      meta: { totalCount, limit, currentPage: page, totalPages },
    },
    HttpStatusCodes.OK
  );
};

// ➕ Create new class
export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const body = c.req.valid("json");
  const session = c.get("session") as Session | undefined;

  if (!session?.userId) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  let resolvedNurseryId: string | undefined = body.nurseryId ?? undefined;

  if (!resolvedNurseryId) {
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

    resolvedNurseryId = ownedNurseries[0]?.id as string;
  } else {
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

  const [inserted] = await db
    .insert(classes)
    .values({
      ...body,
      nurseryId: resolvedNurseryId!,
      teacherIds: body.teacherIds ?? [],
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  return c.json(inserted, HttpStatusCodes.CREATED);
};

// 🔎 Get one class
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

// ✏️ Update class
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
      return c.json(
        { message: "Target nursery not found" },
        HttpStatusCodes.NOT_FOUND
      );
    }
  }

  const [updated] = await db
    .update(classes)
    .set({
      ...updates,
      teacherIds: updates.teacherIds ?? [],
      updatedAt: new Date(),
    })
    .where(eq(classes.id, String(id)))
    .returning();

  if (!updated) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(updated, HttpStatusCodes.OK);
};

// 🗑️ Delete class
export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const session = c.get("session") as Session | undefined;

  if (!session?.userId) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

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
