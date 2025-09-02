import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import { db } from "@api/db";
import type { AppRouteHandler } from "@api/types";
import { notifications } from "@repo/database";

import type {
  CreateRoute,
  GetByIdRoute,
  ListRoute,
  RemoveRoute,
  UpdateRoute,
} from "./notifications.routes";

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

// Create new notifications
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
      title: body.title,
      message: body.message,
      metadata: body.metadata,
      notificationType: body.notificationType as "pending" | "approved",
      recipientType: body.recipientType,
      readAt: body.readAt,
      organizationId: session.activeOrganizationId,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  return c.json(inserted, HttpStatusCodes.CREATED);
};

// 🔍 Get a single notifications
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

// Update notifications
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
      ...(updates.title && { title: updates.title }),
      ...(updates.message && { message: updates.message }),
      ...(updates.metadata && { metadata: updates.metadata }),
      ...(updates.notificationType && {
        notificationType: updates.notificationType as "pending" | "approved",
      }),
      ...(updates.recipientType && { recipientType: updates.recipientType }),
      ...(updates.readAt !== undefined && { readAt: updates.readAt }),
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

//  Delete notifications
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

  return c.json({ message: "Deleted successfully" }, HttpStatusCodes.OK);
};

// import { eq } from "drizzle-orm";
// import * as HttpStatusCodes from "stoker/http-status-codes";
// import * as HttpStatusPhrases from "stoker/http-status-phrases";

// import { db } from "@api/db";
// import type { AppRouteHandler } from "@api/types";
// import { notifications } from "@repo/database";

// import type {
//   ListRoute,
//   CreateRoute,
//   GetByIdRoute,
//   UpdateRoute,
//   RemoveRoute,
// } from "./notifications.routes";

// // 📝 List all notifications
// export const list: AppRouteHandler<ListRoute> = async (c) => {
//   const results = await db.query.notifications.findMany({});
//   return c.json(
//     {
//       data: results,
//       total: results.length,
//     },
//     HttpStatusCodes.OK
//   );
// };

// // ➕ Create new notifications
// export const create: AppRouteHandler<CreateRoute> = async (c) => {
//   const body = c.req.valid("json");
//   const session = c.get("user") as { organizationId?: string } | undefined;

//   if (!session?.organizationId) {
//     return c.json(
//       { message: HttpStatusPhrases.UNAUTHORIZED },
//       HttpStatusCodes.UNAUTHORIZED
//     );
//   }

//   const [inserted] = await db
//     .insert(notifications)
//     .values({
//       ...body,
//       organizationId: session.organizationId,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     })
//     .returning();

//   return c.json(inserted, HttpStatusCodes.CREATED);
// };

// // 🔍 Get a single notifications
// export const getOne: AppRouteHandler<GetByIdRoute> = async (c) => {
//   const { id } = c.req.valid("params");

//   const found = await db.query.notifications.findFirst({
//     where: eq(notifications.id, String(id)),
//   });

//   if (!found) {
//     return c.json(
//       { message: HttpStatusPhrases.NOT_FOUND },
//       HttpStatusCodes.NOT_FOUND
//     );
//   }

//   return c.json(found, HttpStatusCodes.OK);
// };

// // ✏️ Update notifications
// export const patch: AppRouteHandler<UpdateRoute> = async (c) => {
//   const { id } = c.req.valid("params");
//   const updates = c.req.valid("json");
//   const session = c.get("user") as { organizationId?: string } | undefined;

//   if (!session?.organizationId) {
//     return c.json(
//       { message: HttpStatusPhrases.UNAUTHORIZED },
//       HttpStatusCodes.UNAUTHORIZED
//     );
//   }

//   const [updated] = await db
//     .update(notifications)
//     .set({
//       ...updates,
//       updatedAt: new Date(),
//     })
//     .where(eq(notifications.id, String(id)))
//     .returning();

//   if (!updated) {
//     return c.json(
//       { message: HttpStatusPhrases.NOT_FOUND },
//       HttpStatusCodes.NOT_FOUND
//     );
//   }

//   return c.json(updated, HttpStatusCodes.OK);
// };

// // 🗑 Delete notifications
// export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
//   const { id } = c.req.valid("params");
//   const session = c.get("user") as { organizationId?: string } | undefined;

//   if (!session?.organizationId) {
//     return c.json(
//       { message: HttpStatusPhrases.UNAUTHORIZED },
//       HttpStatusCodes.UNAUTHORIZED
//     );
//   }

//   const [deleted] = await db
//     .delete(notifications)
//     .where(eq(notifications.id, String(id)))
//     .returning();

//   if (!deleted) {
//     return c.json(
//       { message: HttpStatusPhrases.NOT_FOUND },
//       HttpStatusCodes.NOT_FOUND
//     );
//   }

//   return c.json({ message: "Deleted successfully" }, HttpStatusCodes.OK);
// };
