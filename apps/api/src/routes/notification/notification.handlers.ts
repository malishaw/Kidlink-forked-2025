import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import { db } from "@api/db";
import type { AppRouteHandler } from "@api/types";
import { notifications } from "@repo/database";

import type {
  CreateRoute,
  GetByIdRoute,
  GetByUserIdRoute,
  ListRoute,
  RemoveRoute,
  UpdateRoute,
} from "./notification.routes";

// 🔍 List all notifications
export const list: AppRouteHandler<ListRoute> = async (c) => {
  const results = await db.query.notifications.findMany({});
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

// Create new notification
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
    .insert(notifications)
    .values({
      ...body,
      organizationId: session.activeOrganizationId,
      createdAt: new Date(),
    })
    .returning();

  return c.json(inserted, HttpStatusCodes.CREATED);
};

// 🔍 Get a single notification
export const getOne: AppRouteHandler<GetByIdRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const notification = await db.query.notifications.findFirst({
    where: eq(notifications.id, String(id)),
  });

  if (!notification) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(notification, HttpStatusCodes.OK);
};

// Update notification
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
    .update(notifications)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(eq(notifications.id, String(id)))
    .returning();

  if (!updated) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(updated, HttpStatusCodes.OK);
};

//  Delete notification
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
    .delete(notifications)
    .where(eq(notifications.id, String(id)))
    .returning();

  if (!deleted) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.body(null, HttpStatusCodes.NO_CONTENT);
};

// Get notifications by receiverId
export const getByUserId: AppRouteHandler<GetByUserIdRoute> = async (c) => {
  const { receiverId } = c.req.valid("query");
  if (!receiverId) {
    // Return the expected error response type
    return c.json(
      { message: "Missing receiverId" },
      HttpStatusCodes.BAD_REQUEST
    );
  }
  // Find notifications where receiverId matches
  const results = await db.query.notifications.findMany({
    where: eq(notifications.receiverId, [receiverId]),
  });
  // Ensure createdAt and updatedAt are strings
  const serializedResults = results.map((notif) => ({
    ...notif,
    createdAt: notif.createdAt ? notif.createdAt.toISOString() : null,
    updatedAt: notif.updatedAt ? notif.updatedAt.toISOString() : null,
  }));
  // Return only the array, as expected by the route response type
  return c.json(serializedResults, HttpStatusCodes.OK);
};
