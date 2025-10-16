import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import { db } from "@api/db";
import type { AppRouteHandler } from "@api/types";
import { payments } from "@repo/database";

import type {
  CreateRoute,
  GetByIdRoute,
  ListRoute,
  RemoveRoute,
  UpdateRoute,
} from "./payments.routes";

// 🔍 List all payments
export const list: AppRouteHandler<ListRoute> = async (c) => {
  const results = await db.query.payments.findMany({});
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

// Create new payments
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
    .insert(payments)
    .values({
      id: randomUUID(),
      childId: body.childId,
      amount: body.amount,
      paymentMethod: body.paymentMethod,
      status: body.status,
      paidAt: body.paidAt || null,
      organizationId: null,
    })
    .returning();

  return c.json(inserted, HttpStatusCodes.CREATED);
};

// 🔍 Get a single payments
export const getOne: AppRouteHandler<GetByIdRoute> = async (c) => {
  const { id } = c.req.valid("param");

  const payment = await db.query.payments.findFirst({
    where: eq(payments.id, String(id)),
  });

  if (!payment) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(payment, HttpStatusCodes.OK);
};

// Update payments
export const patch: AppRouteHandler<UpdateRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const updates = c.req.valid("json");
  const session = c.get("session");

  if (!session) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  try {
    // First, get the existing payment record
    const existingPayment = await db.query.payments.findFirst({
      where: eq(payments.id, id),
    });

    if (!existingPayment) {
      return c.json(
        { message: HttpStatusPhrases.NOT_FOUND },
        HttpStatusCodes.NOT_FOUND
      );
    }

    // Build update data object with only the fields that are actually provided
    const updateData: any = {};

    // Check if the field exists in the updates object and has a valid value
    if (
      "amount" in updates &&
      updates.amount !== undefined &&
      updates.amount !== null &&
      updates.amount !== ""
    ) {
      updateData.amount = updates.amount;
    }
    if (
      "paymentMethod" in updates &&
      updates.paymentMethod !== undefined &&
      updates.paymentMethod !== null &&
      updates.paymentMethod !== ""
    ) {
      updateData.paymentMethod = updates.paymentMethod;
    }
    if ("slipUrl" in updates && updates.slipUrl !== undefined) {
      updateData.slipUrl = updates.slipUrl;
    }
    if (
      "status" in updates &&
      updates.status !== undefined &&
      updates.status !== null &&
      updates.status !== ""
    ) {
      updateData.status = updates.status;
    }
    if ("paidAt" in updates && updates.paidAt !== undefined) {
      updateData.paidAt = updates.paidAt ? new Date(updates.paidAt) : null;
    }

    // Always update the updatedAt field if there are changes
    if (Object.keys(updateData).length > 0) {
      updateData.updatedAt = new Date();
    } else {
      return c.json(existingPayment, HttpStatusCodes.OK); // No changes needed
    }

    console.log("Updating payment with data:", updateData);
    console.log("Payment ID:", id);
    console.log("Original updates received:", updates);

    const [updated] = await db
      .update(payments)
      .set(updateData)
      .where(eq(payments.id, id))
      .returning();

    if (!updated) {
      return c.json(
        { message: HttpStatusPhrases.NOT_FOUND },
        HttpStatusCodes.NOT_FOUND
      );
    }

    return c.json(updated, HttpStatusCodes.OK);
  } catch (error) {
    console.error("Update payment error:", error);
    console.error("Error details:", {
      id,
      updates,
      error: error instanceof Error ? error.message : error,
    });

    return c.json(
      {
        message: "Failed to update payment",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

//  Delete payments
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
    .delete(payments)
    .where(eq(payments.id, String(id)))
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
// import { payments } from "@repo/database";

// import type {
//   ListRoute,
//   CreateRoute,
//   GetByIdRoute,
//   UpdateRoute,
//   RemoveRoute,
// } from "./payments.routes";

// // 📝 List all payments
// export const list: AppRouteHandler<ListRoute> = async (c) => {
//   const results = await db.query.payments.findMany({});
//   return c.json(
//     {
//       data: results,
//       total: results.length,
//     },
//     HttpStatusCodes.OK
//   );
// };

// // ➕ Create new payments
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
//     .insert(payments)
//     .values({
//       ...body,
//       organizationId: session.organizationId,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     })
//     .returning();

//   return c.json(inserted, HttpStatusCodes.CREATED);
// };

// // 🔍 Get a single payments
// export const getOne: AppRouteHandler<GetByIdRoute> = async (c) => {
//   const { id } = c.req.valid("params");

//   const found = await db.query.payments.findFirst({
//     where: eq(payments.id, String(id)),
//   });

//   if (!found) {
//     return c.json(
//       { message: HttpStatusPhrases.NOT_FOUND },
//       HttpStatusCodes.NOT_FOUND
//     );
//   }

//   return c.json(found, HttpStatusCodes.OK);
// };

// // ✏️ Update payments
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
//     .update(payments)
//     .set({
//       ...updates,
//       updatedAt: new Date(),
//     })
//     .where(eq(payments.id, String(id)))
//     .returning();

//   if (!updated) {
//     return c.json(
//       { message: HttpStatusPhrases.NOT_FOUND },
//       HttpStatusCodes.NOT_FOUND
//     );
//   }

//   return c.json(updated, HttpStatusCodes.OK);
// };

// // 🗑 Delete payments
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
//     .delete(payments)
//     .where(eq(payments.id, String(id)))
//     .returning();

//   if (!deleted) {
//     return c.json(
//       { message: HttpStatusPhrases.NOT_FOUND },
//       HttpStatusCodes.NOT_FOUND
//     );
//   }

//   return c.json({ message: "Deleted successfully" }, HttpStatusCodes.OK);
// };
