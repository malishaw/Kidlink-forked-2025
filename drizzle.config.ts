import { defineConfig } from "drizzle-kit";

import { env } from "@/lib/env";

export default defineConfig({
  schema: "./modules/database/schema/index.ts",
  out: "./modules/database/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL
  }
});
