import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import { db } from "@api/db";
import type { AppRouteHandler } from "@api/types";
import { badges } from "@repo/database";

import type { ListRoute } from "./badges.routes";

// 🔍 List all badges with filtering by organization ID
export const list: AppRouteHandler<ListRoute> = async (c) => {
  const session = c.get("session");

  if (!session?.activeOrganizationId) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const organizationId = session.activeOrganizationId;

  // Extract pagination parameters from query
  const page = parseInt(c.req.query("page") || "1", 10);
  const limit = parseInt(c.req.query("limit") || "5", 10); // Reduced default to 5 items per page
  const offset = (page - 1) * limit;

  // Fetch badges filtered by the current organization ID with pagination
  const results = await db.query.badges.findMany({
    where: eq(badges.organizationId, organizationId),
    limit,
    offset,
  });

  // Process results to exclude large iconUrl data if it's base64
  const processedResults = results.map((badge) => ({
    ...badge,
    iconUrl:
      badge.iconUrl && badge.iconUrl.length > 100
        ? `[Large image data - ${badge.iconUrl.length} characters]`
        : badge.iconUrl,
  }));

  // For now, we'll use the current page results count as total count
  // This is more efficient and prevents massive responses
  const totalCount = processedResults.length;
  const totalPages = totalCount < limit ? page : page + 1; // Estimate if there are more pages

  return c.json(
    {
      data: processedResults,
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

// Create new badges
export const create = async (c: any) => {
  const body = c.req.valid("json");
  const session = c.get("session");

  if (!session) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const [inserted] = await db
    .insert(badges)
    .values({
      ...body,
      organizationId: session.activeOrganizationId,
      teacherId: session.userId,
    })
    .returning();

  return c.json(inserted, HttpStatusCodes.CREATED);
};

// 🔍 Get a single badges
export const getOne = async (c: any) => {
  const { id } = c.req.valid("param");

  const badge = await db.query.badges.findFirst({
    where: eq(badges.id, id),
  });

  if (!badge) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(badge, HttpStatusCodes.OK);
};

// Update badges
export const patch = async (c: any) => {
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
    .update(badges)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(eq(badges.id, id))
    .returning();

  if (!updated) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(updated, HttpStatusCodes.OK);
};

//  Delete badges
export const remove = async (c: any) => {
  const { id } = c.req.valid("param");
  const session = c.get("user") as { organizationId?: string } | undefined;

  if (!session) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const [deleted] = await db
    .delete(badges)
    .where(eq(badges.id, id))
    .returning();

  if (!deleted) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(
    { message: "Badge deleted successfully" },
    HttpStatusCodes.NO_CONTENT
  );
};
