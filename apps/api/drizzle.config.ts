import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {

    url: "postgres://donext:donext123@127.0.0.1:5432/kidlink?schema=public",

  },
});
