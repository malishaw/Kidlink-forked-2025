import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@api/types";

import { db } from "@api/db";
import { toKebabCase } from "@api/lib/helpers";
import { hotelTypes } from "@repo/database";
import type {
  CreateHotelTypeRoute,
  ListHotelTypesRoute,
  RemoveHotelTypeRoute,
  UpdateHotelTypeRoute
} from "./hotel.routes";

/**
 * ================================================================
 * Hotel Types Handlers
 * ================================================================
 */
// List hotel types route handler
export const listHotelTypesHandler: AppRouteHandler<
  ListHotelTypesRoute
> = async (c) => {
  const allHotelTypes = await db.query.hotelTypes.findMany({});

  return c.json(allHotelTypes, HttpStatusCodes.OK);
};

// Create hotel type route handler
export const createHotelTypeHandler: AppRouteHandler<
  CreateHotelTypeRoute
> = async (c) => {
  const body = c.req.valid("json");
  const session = c.get("session");
  const user = c.get("user");

  if (!session || !user) {
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED
      },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  if (user.role !== "admin") {
    return c.json(
      {
        message: HttpStatusPhrases.FORBIDDEN
      },
      HttpStatusCodes.FORBIDDEN
    );
  }

  const [inserted] = await db
    .insert(hotelTypes)
    .values({ ...body, slug: toKebabCase(body.name) })
    .returning();

  if (!inserted) {
    return c.json(
      {
        message: "Could not create hotel type"
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }

  return c.json(inserted, HttpStatusCodes.CREATED);
};

// Update hotel type route handler
export const updateHotelTypeHandler: AppRouteHandler<
  UpdateHotelTypeRoute
> = async (c) => {
  const params = c.req.valid("param");
  const body = c.req.valid("json");
  const session = c.get("session");
  const user = c.get("user");

  if (!session || !user) {
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED
      },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  if (user.role !== "admin") {
    return c.json(
      {
        message: HttpStatusPhrases.FORBIDDEN
      },
      HttpStatusCodes.FORBIDDEN
    );
  }

  const [updated] = await db
    .update(hotelTypes)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(hotelTypes.id, params.id))
    .returning();

  if (!updated) {
    return c.json(
      { message: "Hotel type does not exists" },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(updated, HttpStatusCodes.OK);
};

// Delete hotel type Handler
export const removeHotelTypeHandler: AppRouteHandler<
  RemoveHotelTypeRoute
> = async (c) => {
  const params = c.req.valid("param");
  const session = c.get("session");
  const user = c.get("user");

  if (!session || !user) {
    return c.json(
      {
        message: HttpStatusPhrases.UNAUTHORIZED
      },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  if (user.role !== "admin") {
    return c.json(
      {
        message: HttpStatusPhrases.FORBIDDEN
      },
      HttpStatusCodes.FORBIDDEN
    );
  }

  const [deleted] = await db
    .delete(hotelTypes)
    .where(eq(hotelTypes.id, params.id))
    .returning();

  if (!deleted) {
    return c.json(
      { message: "Hotel type does not exists" },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(
    { message: "Hotel type deleted successfully" },
    HttpStatusCodes.OK
  );
};
