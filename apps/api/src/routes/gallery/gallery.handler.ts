import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import { db } from "@api/db";
import type { AppRouteHandler } from "@api/types";
import { galleries } from "@repo/database";

import type {
  CreateRoute,
  GetByIdRoute,
  ListRoute,
  RemoveRoute,
  UpdateRoute,
} from "./gallery.routes";

// 🔍 List all gallery
export const list: AppRouteHandler<ListRoute> = async (c) => {
  console.log("=== Gallery List API Called ===");
  const results = await db.select().from(galleries);
  console.log("Database results:", results);
  console.log("Number of galleries found:", results.length);

  const page = 1; // or from query params
  const limit = results.length; // or from query params
  const totalCount = results.length;
  const totalPages = Math.ceil(totalCount / limit);

  const response = {
    data: results,
    meta: {
      totalCount,
      limit,
      currentPage: page,
      totalPages,
    },
  };

  console.log("Sending response:", response);

  return c.json(response, HttpStatusCodes.OK);
};

// Create new gallery
export const create: AppRouteHandler<CreateRoute> = async (c) => {
  console.log("=== Gallery Create API Called ===");
  const body = c.req.valid("json");
  const session = c.get("session");
  const user = c.get("user");

  console.log("Request body:", body);
  console.log("Session:", session);
  console.log("User:", user);

  if (!session || !user) {
    console.log("Authentication failed - no session or user");
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const insertData = {
    id: randomUUID(),
    ...body,
    organizationId: session.activeOrganizationId, // Use activeOrganizationId from session (can be null)
    userId: session.userId, // User who added the photos
    createdBy: user.name || user.email || "Unknown User", // Use user's name instead of ID
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  console.log("Inserting data:", insertData);

  const [inserted] = await db.insert(galleries).values(insertData).returning();

  console.log("Successfully inserted gallery:", inserted);
  return c.json(inserted, HttpStatusCodes.CREATED);
};

// 🔍 Get a single gallery
export const getOne: AppRouteHandler<GetByIdRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const foundgallery = await db
    .select()
    .from(galleries)
    .where(eq(galleries.id, String(id)))
    .limit(1);

  if (!foundgallery || foundgallery.length === 0) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(foundgallery[0], HttpStatusCodes.OK);
};

// Update gallery
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
    .update(galleries)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(eq(galleries.id, String(id)))
    .returning();

  if (!updated) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(updated, HttpStatusCodes.OK);
};

//  Delete gallery
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
    .delete(galleries)
    .where(eq(galleries.id, String(id)))
    .returning();

  if (!deleted) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  // Return 204 No Content with null JSON as defined in route schema
  return new Response(JSON.stringify(null), {
    status: 204,
    headers: {
      "Content-Type": "application/json",
    },
  }) as any;
};
