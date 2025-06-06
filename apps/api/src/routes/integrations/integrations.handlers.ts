// import { desc, eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@/types";

import { db } from "@/db";
import { integration } from "./integrations.schema";

import type { CreateRoute } from "./integrations.routes";

// Create new task route handler
export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const newIntegration = c.req.valid("json");

  const user = c.get("user");

  if (!user) {
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  const [inserted] = await db
    .insert(integration)
    .values({
      userId: user.id,
      ...newIntegration
    })
    .returning();

  if (!inserted) {
    return c.json(
      { message: "Failed to create integration" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }

  return c.json(inserted, HttpStatusCodes.CREATED);
};
