import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@/types";

import { db } from "@/db";
import { integration } from "@repo/database/schemas";

import type { GetOneRoute, UpdateRoute } from "./integrations.routes";

/**
 * Get integration details by ID
 * (Organization ID handled in better-auth session)
 * @param c - The context of the request
 * @returns JSON response with integration details or error
 */
export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const params = c.req.valid("param");
  const user = c.get("user");
  const session = c.get("session");

  if (!user) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  if (!session || !session.activeOrganizationId) {
    return c.json(
      { message: "No active integration found in your session !" },
      HttpStatusCodes.NOT_FOUND
    );
  }

  const integrationDetails = await db.query.integration.findFirst({
    where: (table, { eq }) => eq(table.id, params.id)
  });

  if (!integrationDetails) {
    return c.json(
      { message: "Integration details not found" },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(integrationDetails, HttpStatusCodes.OK);
};

/**
 * Update integration details by ID
 * @param c - The context of the request
 * @returns JSON response with updated integration details or error
 */
export const update: AppRouteHandler<UpdateRoute> = async (c) => {
  const params = c.req.valid("param");
  const body = c.req.valid("json");
  const user = c.get("user");
  const session = c.get("session");

  if (!user) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  if (!session || !session.activeOrganizationId) {
    return c.json(
      { message: "No active integration found in your session !" },
      HttpStatusCodes.NOT_FOUND
    );
  }

  const updatedIntegration = await db
    .update(integration)
    .set(body)
    .where(eq(integration.id, params.id))
    .returning();

  if (updatedIntegration.length === 0) {
    return c.json(
      { message: "Integration details not found" },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(updatedIntegration[0], HttpStatusCodes.OK);
};
