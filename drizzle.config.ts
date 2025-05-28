import { defineConfig } from "drizzle-kit";

import { env } from "@/lib/env";

export default defineConfig({
  schema: "./src/modules/database/schema/index.ts",
  out: "./src/modules/database/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL
  }
});
