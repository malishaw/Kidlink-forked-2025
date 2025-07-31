import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@api/types";

import { db } from "@api/db";
import { toKebabCase } from "@api/lib/helpers";
import { propertyClasses } from "@repo/database";
import type {
  CreatePropertyClassRoute,
  ListPropertyClassesRoute,
  RemovePropertyClassRoute,
  UpdatePropertyClassRoute
} from "./property-classes.routes";

// List property classes route handler
export const listPropertyClassesHandler: AppRouteHandler<
  ListPropertyClassesRoute
> = async (c) => {
  const allPropertyClasses = await db.query.propertyClasses.findMany({});

  return c.json(allPropertyClasses, HttpStatusCodes.OK);
};

// Create proerty class route handler
export const createPropertyClassHandler: AppRouteHandler<
  CreatePropertyClassRoute
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
    .insert(propertyClasses)
    .values({ ...body, slug: toKebabCase(body.name) })
    .returning();

  if (!inserted) {
    return c.json(
      {
        message: "Could not create property class"
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }

  return c.json(inserted, HttpStatusCodes.CREATED);
};

// Update Property Class
export const updatePropertyClassHandler: AppRouteHandler<
  UpdatePropertyClassRoute
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
    .update(propertyClasses)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(propertyClasses.id, params.id))
    .returning();

  if (!updated) {
    return c.json(
      { message: "Property class not exists" },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(updated, HttpStatusCodes.OK);
};

// Delete Handler
export const removePropertyClassHandler: AppRouteHandler<
  RemovePropertyClassRoute
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
    .delete(propertyClasses)
    .where(eq(propertyClasses.id, params.id))
    .returning();

  if (!deleted) {
    return c.json(
      { message: "Property class not exists" },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(
    { message: "Property class deleted successfully" },
    HttpStatusCodes.OK
  );
};
