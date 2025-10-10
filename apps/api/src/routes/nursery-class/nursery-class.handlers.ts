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
  const session = c.get("session");

  console.log("Session:", session); // Debug log

  if (!session?.activeOrganizationId) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const organizationId = session.activeOrganizationId;

  console.log("Active Organization ID:", organizationId); // Debug log

  // Fetch nursery classes filtered by the active organization ID
  const results = await db.query.classes.findMany({
    where: eq(classes.organizationId, organizationId),
  });

  console.log("Query Results:", results); // Debug log

  const page = 1; // or from query params
  const limit = results.length; // or from query params
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

// ➕ Create new class
export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const body = c.req.valid("json");
  const session = c.get("session");

  if (!session) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  if (!session.activeOrganizationId) {
    return c.json(
      { message: "No active organization selected" },
      HttpStatusCodes.BAD_REQUEST
    );
  }

  // Normalize arrays if provided (dedupe and filter out null/undefined values)
  const teacherIds = Array.isArray(body.teacherIds)
    ? Array.from(
        new Set(body.teacherIds.filter((id) => id != null && id !== ""))
      )
    : [];

  const childIds = Array.isArray(body.childIds)
    ? Array.from(new Set(body.childIds.filter((id) => id != null && id !== "")))
    : [];

  const now = new Date();

  const [inserted] = await db
    .insert(classes)
    .values({
      nurseryId: body.nurseryId,
      organizationId: session.activeOrganizationId, // Add organizationId from session
      name: body.name,
      mainTeacherId: body.mainTeacherId || null,
      teacherIds,
      childIds,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  return c.json(inserted, HttpStatusCodes.CREATED);
};

// 🔎 Get one class
export const getOne: AppRouteHandler<GetByIdRoute> = async (c) => {
  const { id } = c.req.valid("param");

  // Fetch the class by ID
  const classItem = await db.query.classes.findFirst({
    where: eq(classes.id, String(id)),
  });

  // If the class is not found, return a 404 response
  if (!classItem) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(classItem, HttpStatusCodes.OK);
};

// ✏️ Update class
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
