import { Hono } from "hono";

import { auth } from "@/lib/auth";

export const authController = new Hono().on(["POST", "GET"], "/**", (c) => {
  return auth.handler(c.req.raw);
});
