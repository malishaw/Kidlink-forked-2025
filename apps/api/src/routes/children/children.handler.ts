import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import { db } from "@api/db";
import type { AppRouteHandler } from "@api/types";
import { childrens } from "@repo/database";

import type {
  CreateRoute,
  GetByIdRoute,
  ListRoute,
  RemoveRoute,
  UpdateRoute,
} from "./children.routes";
// 🔍 List all children
export const list: AppRouteHandler<ListRoute> = async (c) => {
  const session = c.get("session");

  if (!session?.activeOrganizationId) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const organizationId = session.activeOrganizationId;

  // Fetch children filtered by the current organization ID
  const results = await db.query.childrens.findMany({
    where: eq(childrens.organizationId, organizationId),
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

  const child = await db.query.childrens.findFirst({
    where: eq(childrens.id, String(id)),
  });

  if (!child) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(child, HttpStatusCodes.OK);
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

  return c.json({ message: "Deleted successfully" }, HttpStatusCodes.OK);
};

// import { eq } from "drizzle-orm";
// import * as HttpStatusCodes from "stoker/http-status-codes";
// import * as HttpStatusPhrases from "stoker/http-status-phrases";

// import { db } from "@api/db";
// import type { AppRouteHandler } from "@api/types";
// import { children } from "@repo/database";

// import type {
//   ListRoute,
//   CreateRoute,
//   GetByIdRoute,
//   UpdateRoute,
//   RemoveRoute,
// } from "./children.routes";

// // 📝 List all children
// export const list: AppRouteHandler<ListRoute> = async (c) => {
//   const results = await db.query.children.findMany({});
//   return c.json(
//     {
//       data: results,
//       total: results.length,
//     },
//     HttpStatusCodes.OK
//   );
// };

// // ➕ Create new children
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
//     .insert(children)
//     .values({
//       ...body,
//       organizationId: session.organizationId,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     })
//     .returning();

//   return c.json(inserted, HttpStatusCodes.CREATED);
// };

// // 🔍 Get a single children
// export const getOne: AppRouteHandler<GetByIdRoute> = async (c) => {
//   const { id } = c.req.valid("params");

//   const found = await db.query.children.findFirst({
//     where: eq(children.id, String(id)),
//   });

//   if (!found) {
//     return c.json(
//       { message: HttpStatusPhrases.NOT_FOUND },
//       HttpStatusCodes.NOT_FOUND
//     );
//   }

//   return c.json(found, HttpStatusCodes.OK);
// };

// // ✏️ Update children
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
//     .update(children)
//     .set({
//       ...updates,
//       updatedAt: new Date(),
//     })
//     .where(eq(children.id, String(id)))
//     .returning();

//   if (!updated) {
//     return c.json(
//       { message: HttpStatusPhrases.NOT_FOUND },
//       HttpStatusCodes.NOT_FOUND
//     );
//   }

//   return c.json(updated, HttpStatusCodes.OK);
// };

// // 🗑 Delete children
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
//     .delete(children)
//     .where(eq(children.id, String(id)))
//     .returning();

//   if (!deleted) {
//     return c.json(
//       { message: HttpStatusPhrases.NOT_FOUND },
//       HttpStatusCodes.NOT_FOUND
//     );
//   }

//   return c.json({ message: "Deleted successfully" }, HttpStatusCodes.OK);
// };
