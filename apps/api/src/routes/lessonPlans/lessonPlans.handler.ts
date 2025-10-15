import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import { db } from "@api/db";
import type { AppRouteHandler } from "@api/types";
import { lessonPlans } from "@repo/database";

import type {
  CreateRoute,
  GetByClassIdRoute,
  GetByIdRoute,
  ListRoute,
  RemoveRoute,
  UpdateRoute,
} from "./lessonPlans.routes";

// 🔍 List all lessonPlans
export const list: AppRouteHandler<ListRoute> = async (c) => {
  const results = await db.query.lessonPlans.findMany({});
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

// Create new lessonPlan
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
    .insert(lessonPlans)
    .values({
      ...body,
      organizationId: session.activeOrganizationId,
      createdAt: new Date(),
    })
    .returning();

  return c.json(inserted, HttpStatusCodes.CREATED);
};

// 🔍 Get a single lessonPlan
export const getOne: AppRouteHandler<GetByIdRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const lessonPlan = await db.query.lessonPlans.findFirst({
    where: eq(lessonPlans.id, String(id)),
  });

  if (!lessonPlan) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(lessonPlan, HttpStatusCodes.OK);
};

// 🔍 Get lesson plans by class ID
export const getByClassId: AppRouteHandler<GetByClassIdRoute> = async (c) => {
  const { classId } = c.req.valid("param");
  const {
    page = "1",
    limit = "10",
    sort = "desc",
    search = "",
  } = c.req.valid("query");

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const offset = (pageNum - 1) * limitNum;

  // Base query to find lesson plans by classId
  let query = db.query.lessonPlans.findMany({
    where: eq(lessonPlans.classId, String(classId)),
    limit: limitNum,
    offset: offset,
    orderBy:
      sort === "desc" ? [lessonPlans.createdAt] : [lessonPlans.createdAt],
  });

  // If search is provided, add search functionality (you might need to adjust this based on your database setup)
  const results = await query;

  // Get total count for pagination
  const totalResults = await db.query.lessonPlans.findMany({
    where: eq(lessonPlans.classId, String(classId)),
  });
  const totalCount = totalResults.length;
  const totalPages = Math.ceil(totalCount / limitNum);

  // Filter by search if provided
  let filteredResults = results;
  if (search) {
    filteredResults = results.filter(
      (lessonPlan) =>
        lessonPlan.title?.toLowerCase().includes(search.toLowerCase()) ||
        lessonPlan.content?.toLowerCase().includes(search.toLowerCase())
    );
  }

  return c.json(
    {
      data: filteredResults,
      meta: {
        totalCount: search ? filteredResults.length : totalCount,
        limit: limitNum,
        currentPage: pageNum,
        totalPages: search
          ? Math.ceil(filteredResults.length / limitNum)
          : totalPages,
      },
    },
    HttpStatusCodes.OK
  );
};

// Update lessonPlan
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
    .update(lessonPlans)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(eq(lessonPlans.id, String(id)))
    .returning();

  if (!updated) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(updated, HttpStatusCodes.OK);
};

//  Delete lessonPlan
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
    .delete(lessonPlans)
    .where(eq(lessonPlans.id, String(id)))
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
// import { lessonPlans } from "@repo/database";

// import type {
//   ListRoute,
//   CreateRoute,
//   GetByIdRoute,
//   UpdateRoute,
//   RemoveRoute,
// } from "./lessonPlan.routes";

// // 📝 List all lessonPlans
// export const list: AppRouteHandler<ListRoute> = async (c) => {
//   const results = await db.query.lessonPlans.findMany({});
//   return c.json(
//     {
//       data: results,
//       total: results.length,
//     },
//     HttpStatusCodes.OK
//   );
// };

// // ➕ Create new lessonPlan
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
//     .insert(lessonPlans)
//     .values({
//       ...body,
//       organizationId: session.organizationId,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     })
//     .returning();

//   return c.json(inserted, HttpStatusCodes.CREATED);
// };

// // 🔍 Get a single lessonPlan
// export const getOne: AppRouteHandler<GetByIdRoute> = async (c) => {
//   const { id } = c.req.valid("params");

//   const found = await db.query.lessonPlans.findFirst({
//     where: eq(lessonPlans.id, String(id)),
//   });

//   if (!found) {
//     return c.json(
//       { message: HttpStatusPhrases.NOT_FOUND },
//       HttpStatusCodes.NOT_FOUND
//     );
//   }

//   return c.json(found, HttpStatusCodes.OK);
// };

// // ✏️ Update lessonPlan
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
//     .update(lessonPlans)
//     .set({
//       ...updates,
//       updatedAt: new Date(),
//     })
//     .where(eq(lessonPlans.id, String(id)))
//     .returning();

//   if (!updated) {
//     return c.json(
//       { message: HttpStatusPhrases.NOT_FOUND },
//       HttpStatusCodes.NOT_FOUND
//     );
//   }

//   return c.json(updated, HttpStatusCodes.OK);
// };

// // 🗑 Delete lessonPlan
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
//     .delete(lessonPlans)
//     .where(eq(lessonPlans.id, String(id)))
//     .returning();

//   if (!deleted) {
//     return c.json(
//       { message: HttpStatusPhrases.NOT_FOUND },
//       HttpStatusCodes.NOT_FOUND
//     );
//   }

//   return c.json({ message: "Deleted successfully" }, HttpStatusCodes.OK);
// };
