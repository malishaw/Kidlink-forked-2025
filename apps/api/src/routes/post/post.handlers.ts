import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import { db } from "@api/db";
import type { AppRouteHandler } from "@api/types";
import { posts } from "@repo/database";

import type {
  CreateRoute,
  GetByIdRoute,
  ListRoute,
  RemoveRoute,
  UpdateRoute,
} from "./post.routes";

// 🔍 List all posts
export const list: AppRouteHandler<ListRoute> = async (c) => {
  const results = await db.query.posts.findMany({});
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

// Create new post
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
    .insert(posts)
    .values({
      ...body,
      organizationId: session.activeOrganizationId,
      createdAt: new Date(),
    })
    .returning();

  return c.json(inserted, HttpStatusCodes.CREATED);
};

// 🔍 Get a single post
export const getOne: AppRouteHandler<GetByIdRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const post = await db.query.posts.findFirst({
    where: eq(posts.id, String(id)),
  });

  if (!post) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(post, HttpStatusCodes.OK);
};

// Update post
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
    .update(posts)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(eq(posts.id, String(id)))
    .returning();

  if (!updated) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(updated, HttpStatusCodes.OK);
};

//  Delete post
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
    .delete(posts)
    .where(eq(posts.id, String(id)))
    .returning();

  if (!deleted) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.body(null, HttpStatusCodes.NO_CONTENT);
};

// import { eq } from "drizzle-orm";
// import * as HttpStatusCodes from "stoker/http-status-codes";
// import * as HttpStatusPhrases from "stoker/http-status-phrases";

// import { db } from "@api/db";
// import type { AppRouteHandler } from "@api/types";
// import { posts } from "@repo/database";

// import type {
//   ListRoute,
//   CreateRoute,
//   GetByIdRoute,
//   UpdateRoute,
//   RemoveRoute,
// } from "./post.routes";

// // 📝 List all posts
// export const list: AppRouteHandler<ListRoute> = async (c) => {
//   const results = await db.query.posts.findMany({});
//   return c.json(
//     {
//       data: results,
//       total: results.length,
//     },
//     HttpStatusCodes.OK
//   );
// };

// // ➕ Create new post
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
//     .insert(posts)
//     .values({
//       ...body,
//       organizationId: session.organizationId,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     })
//     .returning();

//   return c.json(inserted, HttpStatusCodes.CREATED);
// };

// // 🔍 Get a single post
// export const getOne: AppRouteHandler<GetByIdRoute> = async (c) => {
//   const { id } = c.req.valid("params");

//   const found = await db.query.posts.findFirst({
//     where: eq(posts.id, String(id)),
//   });

//   if (!found) {
//     return c.json(
//       { message: HttpStatusPhrases.NOT_FOUND },
//       HttpStatusCodes.NOT_FOUND
//     );
//   }

//   return c.json(found, HttpStatusCodes.OK);
// };

// // ✏️ Update post
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
//     .update(posts)
//     .set({
//       ...updates,
//       updatedAt: new Date(),
//     })
//     .where(eq(posts.id, String(id)))
//     .returning();

//   if (!updated) {
//     return c.json(
//       { message: HttpStatusPhrases.NOT_FOUND },
//       HttpStatusCodes.NOT_FOUND
//     );
//   }

//   return c.json(updated, HttpStatusCodes.OK);
// };

// // 🗑 Delete post
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
//     .delete(posts)
//     .where(eq(posts.id, String(id)))
//     .returning();

//   if (!deleted) {
//     return c.json(
//       { message: HttpStatusPhrases.NOT_FOUND },
//       HttpStatusCodes.NOT_FOUND
//     );
//   }

//   return c.json({ message: "Deleted successfully" }, HttpStatusCodes.OK);
// };
