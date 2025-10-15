import { and, eq, inArray } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import { db } from "@api/db";
import type { AppRouteHandler } from "@api/types";
import {
  badges,
  childrens,
  classes,
  nurseries,
  parents,
  teachers,
} from "@repo/database";

import type {
  CreateRoute,
  GetByIdRoute,
  GetByParentIdRoute,
  ListRoute,
  ListWithObjectsRoute,
  RemoveRoute,
  UpdateRoute,
} from "./children.routes";

// 🔍 List all childrens with optional childId filter
export const list: AppRouteHandler<ListRoute> = async (c) => {
  const session = c.get("session");
  const { childId } = c.req.valid("query");

  if (!session?.activeOrganizationId) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const organizationId = session.activeOrganizationId;

  // Build where conditions
  const whereConditions = [eq(childrens.organizationId, organizationId)];

  // Add childId filter if provided
  if (childId) {
    whereConditions.push(eq(childrens.id, childId));
  }

  // Fetch children filtered by the current organization ID and optionally by childId
  const results = await db.query.childrens.findMany({
    where:
      whereConditions.length > 1 ? and(...whereConditions) : whereConditions[0],
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

// Create new children
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
    .insert(childrens)
    .values({
      ...body,
      organizationId: session.activeOrganizationId,
      createdAt: new Date(),
    })
    .returning();

  return c.json(inserted, HttpStatusCodes.CREATED);
};

// 🔍 Get a single children
export const getOne: AppRouteHandler<GetByIdRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const children = await db.query.childrens.findFirst({
    where: eq(childrens.id, String(id)),
  });

  if (!children) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(children, HttpStatusCodes.OK);
};

// Update children
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
    .update(childrens)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(eq(childrens.id, String(id)))
    .returning();

  if (!updated) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(updated, HttpStatusCodes.OK);
};

//  Delete children
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
    .delete(childrens)
    .where(eq(childrens.id, String(id)))
    .returning();

  if (!deleted) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.body(null, HttpStatusCodes.NO_CONTENT);
};

// 🔍 Get children by parent ID
export const getByParentId: AppRouteHandler<GetByParentIdRoute> = async (c) => {
  const { parentId } = c.req.valid("param");

  // Fetch children filtered by parent ID
  const results = await db.query.childrens.findMany({
    where: eq(childrens.parentId, parentId),
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

// 🔍 List all children with populated objects and optional childId filter
export const listWithObjects: AppRouteHandler<ListWithObjectsRoute> = async (
  c
) => {
  const session = c.get("session");
  const { childId } = c.req.valid("query");

  if (!session?.activeOrganizationId) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const organizationId = session.activeOrganizationId;

  // Build where conditions
  const whereConditions = [eq(childrens.organizationId, organizationId)];

  // Add childId filter if provided
  if (childId) {
    whereConditions.push(eq(childrens.id, childId));
  }

  // Fetch children filtered by the current organization ID and optionally by childId
  const childrenResults = await db.query.childrens.findMany({
    where:
      whereConditions.length > 1 ? and(...whereConditions) : whereConditions[0],
  });

  // Get unique IDs for bulk fetching
  const nurseryIds = [
    ...new Set(childrenResults.map((child) => child.nurseryId).filter(Boolean)),
  ];
  const parentIds = [
    ...new Set(childrenResults.map((child) => child.parentId).filter(Boolean)),
  ];
  const classIds = [
    ...new Set(childrenResults.map((child) => child.classId).filter(Boolean)),
  ];
  const allBadgeIds = [
    ...new Set(
      childrenResults.flatMap((child) => child.badgeId || []).filter(Boolean)
    ),
  ];

  // First fetch classes to get teacherIds, then fetch teachers
  const classesData =
    classIds.length > 0
      ? await db.query.classes.findMany({
          where: inArray(classes.id, classIds),
        })
      : [];

  const teacherIds = [
    ...new Set(classesData.map((cls) => cls.teacherId).filter(Boolean)),
  ];

  // Bulk fetch related data
  const [nurseriesData, parentsData, badgesData, teachersData] =
    await Promise.all([
      nurseryIds.length > 0
        ? db.query.nurseries.findMany({
            where: inArray(nurseries.id, nurseryIds),
          })
        : [],
      parentIds.length > 0
        ? db.query.parents.findMany({
            where: inArray(parents.id, parentIds),
          })
        : [],
      allBadgeIds.length > 0
        ? db.query.badges.findMany({
            where: inArray(badges.id, allBadgeIds),
          })
        : [],
      teacherIds.length > 0
        ? db.query.teachers.findMany({
            where: inArray(teachers.id, teacherIds),
          })
        : [],
    ]);

  // Create lookup maps for better performance
  const nurseryMap = new Map(nurseriesData.map((n) => [n.id, n]));
  const parentMap = new Map(parentsData.map((p) => [p.id, p]));
  const classMap = new Map(classesData.map((c) => [c.id, c]));
  const badgeMap = new Map(badgesData.map((b) => [b.id, b]));
  const teacherMap = new Map(teachersData.map((t) => [t.id, t]));

  // Helper function to safely convert dates to ISO string
  const toISOStringSafe = (date: any): string | null => {
    if (!date) return null;
    if (date instanceof Date) return date.toISOString();
    if (typeof date === "string") {
      const parsed = new Date(date);
      return isNaN(parsed.getTime()) ? null : parsed.toISOString();
    }
    return null;
  };

  // Populate children with objects
  const populatedChildren = childrenResults.map((child) => ({
    id: child.id,
    name: child.name,
    organizationId: child.organizationId,

    // Enhanced nursery object with all available details
    nursery: child.nurseryId
      ? {
          id: child.nurseryId,
          name: nurseryMap.get(child.nurseryId)?.name || "Unknown Nursery",
          address: nurseryMap.get(child.nurseryId)?.address || null,
          phoneNumber: nurseryMap.get(child.nurseryId)?.phoneNumber || null,
          email: nurseryMap.get(child.nurseryId)?.email || null,
          organizationId:
            nurseryMap.get(child.nurseryId)?.organizationId || null,
          capacity: nurseryMap.get(child.nurseryId)?.capacity || null,
          description: nurseryMap.get(child.nurseryId)?.description || null,
          imageUrl: nurseryMap.get(child.nurseryId)?.imageUrl || null,
          operatingHours:
            nurseryMap.get(child.nurseryId)?.operatingHours || null,
          facilities: nurseryMap.get(child.nurseryId)?.facilities || null,
          ageRange: nurseryMap.get(child.nurseryId)?.ageRange || null,
          createdAt: toISOStringSafe(
            nurseryMap.get(child.nurseryId)?.createdAt
          ),
          updatedAt: toISOStringSafe(
            nurseryMap.get(child.nurseryId)?.updatedAt
          ),
        }
      : null,

    parent: child.parentId
      ? {
          id: child.parentId,
          name: parentMap.get(child.parentId)?.name || "Unknown Parent",
          email: parentMap.get(child.parentId)?.email || "",
          phoneNumber: parentMap.get(child.parentId)?.phoneNumber || "",
          address: parentMap.get(child.parentId)?.address || null,
          occupation: parentMap.get(child.parentId)?.occupation || null,
          emergencyContact:
            parentMap.get(child.parentId)?.emergencyContact || null,
          createdAt: toISOStringSafe(parentMap.get(child.parentId)?.createdAt),
          updatedAt: toISOStringSafe(parentMap.get(child.parentId)?.updatedAt),
        }
      : null,

    class: child.classId
      ? {
          id: child.classId,
          name: classMap.get(child.classId)?.name || "Unknown Class",
          teacherId: classMap.get(child.classId)?.teacherId || null,
          teacherName: classMap.get(child.classId)?.teacherId
            ? teacherMap.get(classMap.get(child.classId)!.teacherId!)?.name ||
              null
            : null,
          capacity: classMap.get(child.classId)?.capacity || null,
          ageRange: classMap.get(child.classId)?.ageRange || null,
          description: classMap.get(child.classId)?.description || null,
          schedule: classMap.get(child.classId)?.schedule || null,
          createdAt: toISOStringSafe(classMap.get(child.classId)?.createdAt),
          updatedAt: toISOStringSafe(classMap.get(child.classId)?.updatedAt),
        }
      : null,

    badges: (child.badgeId || []).map((badgeId) => {
      const badge = badgeMap.get(badgeId);
      return badge
        ? {
            id: badge.id,
            name: badge.name,
            description: badge.description || null,
            imageUrl: badge.imageUrl || null,
            category: badge.category || null,
            points: badge.points || null,
            requirements: badge.requirements || null,
            earnedAt: toISOStringSafe(badge.createdAt),
          }
        : {
            id: badgeId,
            name: "Unknown Badge",
            description: null,
            imageUrl: null,
            category: null,
            points: null,
            requirements: null,
            earnedAt: null,
          };
    }),

    dateOfBirth: toISOStringSafe(child.dateOfBirth),
    gender: child.gender,
    emergencyContact: child.emergencyContact,
    medicalNotes: child.medicalNotes,
    profileImageUrl: child.profileImageUrl,
    imagesUrl: child.imagesUrl,
    activities: child.activities,
    createdAt: toISOStringSafe(child.createdAt),
    updatedAt: toISOStringSafe(child.updatedAt),
  }));

  const page = 1; // or from query params
  const limit = populatedChildren.length; // or from query params
  const totalCount = populatedChildren.length;
  const totalPages = Math.ceil(totalCount / limit);

  return c.json(
    {
      data: populatedChildren,
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
