import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, bearer, openAPI } from "better-auth/plugins";
import * as schema from "@/modules/database/schema";

import { db } from "@/modules/database";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema
  }),
  emailAndPassword: {
    enabled: true
  },
  // Better Auth Plugins
  plugins: [admin(), bearer(), openAPI()]
});
