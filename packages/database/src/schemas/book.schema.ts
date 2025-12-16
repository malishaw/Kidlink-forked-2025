import { sql } from "drizzle-orm";
import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { organization, user } from "./auth.schema";

// POSTS TABLE
export const books = pgTable("books", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  organizationId: text("organization_id").references(() => organization.id),

  authorId: text("author_id")
    .notNull()
    .references(() => user.id),
  title: varchar("title", { length: 255 }),
  description: text("description"),
  mediaUrls: text("media_urls").array(), // Array of URLs
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// RELATIONS
