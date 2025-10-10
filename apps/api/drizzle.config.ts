import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://postgres:Tharu@2023@localhost:5432/kidlink?schema=public",
  },
});
