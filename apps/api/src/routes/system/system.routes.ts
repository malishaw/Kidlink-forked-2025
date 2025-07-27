import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";

import { errorMessageSchema } from "@api/lib/helpers";
import { checkUserTypeSchema } from "./system.schema";

const tags: string[] = ["System"];

// List route definition
export const checkUserType = createRoute({
  tags,
  summary: "Check user type",
  path: "/check-user-type",
  method: "get",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(checkUserTypeSchema, "The user type"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    )
  }
});

export type CheckUserTypeRoute = typeof checkUserType;
