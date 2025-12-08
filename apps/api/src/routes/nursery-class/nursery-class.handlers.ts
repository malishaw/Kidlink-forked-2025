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

// ✏️ Update class - Fixed version
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

  try {
    console.log("Received updates:", updates); // Debug log

    // First, get the existing class to preserve current values
    const existingClass = await db.query.classes.findFirst({
      where: eq(classes.id, String(id)),
    });

    if (!existingClass) {
      return c.json({ message: "Class not found" }, HttpStatusCodes.NOT_FOUND);
    }

    console.log("Existing class:", existingClass); // Debug log

    // Check ownership through organization
    if (
      session.activeOrganizationId &&
      existingClass.organizationId !== session.activeOrganizationId
    ) {
      return c.json(
        { message: HttpStatusPhrases.UNAUTHORIZED },
        HttpStatusCodes.UNAUTHORIZED
      );
    }

    // If nurseryId is being updated, validate the new nursery exists and belongs to user
    if (updates.nurseryId && updates.nurseryId !== existingClass.nurseryId) {
      const nurseryWhere = session.activeOrganizationId
        ? and(
            eq(nurseries.id, updates.nurseryId),
            eq(nurseries.organizationId, session.activeOrganizationId)
          )
        : eq(nurseries.id, updates.nurseryId);

      const newNursery = await db.query.nurseries.findFirst({
        where: nurseryWhere,
      });

      if (!newNursery) {
        return c.json(
          { message: "Target nursery not found or unauthorized" },
          HttpStatusCodes.NOT_FOUND
        );
      }
    }

    // Preserve existing arrays and merge with updates
    const currentTeacherIds = existingClass.teacherIds || [];
    const currentChildIds = existingClass.childIds || [];

    // Handle teacherIds: preserve existing if not provided in updates
    let finalTeacherIds = currentTeacherIds;
    if (updates.teacherIds !== undefined) {
      if (Array.isArray(updates.teacherIds)) {
        // Merge new teacherIds with existing ones, removing duplicates
        const newTeacherIds = updates.teacherIds.filter(
          (id) => id != null && id !== ""
        );
        finalTeacherIds = Array.from(
          new Set([...currentTeacherIds, ...newTeacherIds])
        );
      } else if (updates.teacherIds === null) {
        // Explicitly clear teacherIds
        finalTeacherIds = [];
      }
    }

    // Handle childIds: preserve existing if not provided in updates
    let finalChildIds = currentChildIds;
    if (updates.childIds !== undefined) {
      if (Array.isArray(updates.childIds)) {
        // Merge new childIds with existing ones, removing duplicates
        const newChildIds = updates.childIds.filter(
          (id) => id != null && id !== ""
        );
        finalChildIds = Array.from(
          new Set([...currentChildIds, ...newChildIds])
        );
      } else if (updates.childIds === null) {
        // Explicitly clear childIds
        finalChildIds = [];
      }
    }

    // Build update object - ONLY include fields that are actually being updated
    const updateData: any = {
      updatedAt: new Date(),
    };

    // Only update fields that are explicitly provided and valid
    if (
      updates.name !== undefined &&
      updates.name !== null &&
      updates.name !== ""
    ) {
      updateData.name = updates.name;
    }

    if (updates.mainTeacherId !== undefined) {
      updateData.mainTeacherId = updates.mainTeacherId;
    }

    // Only update nurseryId if it's provided and not empty
    if (
      updates.nurseryId !== undefined &&
      updates.nurseryId !== null &&
      updates.nurseryId !== ""
    ) {
      updateData.nurseryId = updates.nurseryId;
    }

    // Always update arrays (they're properly handled above)
    updateData.teacherIds = finalTeacherIds;
    updateData.childIds = finalChildIds;

    console.log("Final update data:", updateData); // Debug log

    const [updated] = await db
      .update(classes)
      .set(updateData)
      .where(eq(classes.id, String(id)))
      .returning();

    if (!updated) {
      return c.json(
        { message: "Failed to update class" },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      );
    }

    return c.json(updated, HttpStatusCodes.OK);
  } catch (error) {
    console.error("Error updating class:", error);
    return c.json(
      { message: "Internal server error", error: error.message },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
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
