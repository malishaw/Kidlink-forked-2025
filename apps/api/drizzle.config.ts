import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://postgres:dilruwan@localhost:5432/kidlink?schema=public",
  },
});
