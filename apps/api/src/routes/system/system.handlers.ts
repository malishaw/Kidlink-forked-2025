import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@api/types";

import { db } from "@api/db";

import { auth } from "@api/lib/auth";
import type { CheckUserTypeRoute } from "./system.routes";

// check User type handler
export const checkUserTypeHandler: AppRouteHandler<CheckUserTypeRoute> = async (
  c
) => {
  const session = c.get("session");
  const user = c.get("user");

  if (!session || !user) {
    return c.json(
      { message: "Unauthorized access" },
      HttpStatusCodes.UNAUTHORIZED
    );
  }

  if (user.role === "admin") {
    return c.json({ userType: "systemAdmin" as const }, HttpStatusCodes.OK);
  }

  if (session.activeOrganizationId) {
    return c.json({ userType: "hotelOwner" as const }, HttpStatusCodes.OK);
  }

  // Check user id exists as member in member table
  const memberExists = await db.query.member.findFirst({
    where: (fields, { eq }) => eq(fields.userId, user.id)
  });

  if (
    memberExists &&
    (memberExists.role === "owner" || memberExists.role === "admin")
  ) {
    // Set active organization as created organization
    await auth.api.setActiveOrganization({
      body: {
        organizationId: memberExists.organizationId
      }
    });

    return c.json({ userType: "hotelOwner" as const }, HttpStatusCodes.OK);
  }

  return c.json({ userType: "user" as const }, HttpStatusCodes.OK);
};
