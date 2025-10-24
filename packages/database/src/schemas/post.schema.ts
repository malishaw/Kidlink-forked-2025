import { sql } from "drizzle-orm";
import { pgEnum, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { organization, user } from "./auth.schema";
import { nurseries } from "./nursery.schema";

export const postTypeEnum = pgEnum("post_type", [
  "activity",
  "announcement",
  "event",
]);

// POSTS TABLE
export const posts = pgTable("posts", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  organizationId: text("organization_id").references(() => organization.id),

  nurseryId: text("nursery_id")
    .notNull()
    .references(() => nurseries.id),
  authorId: text("author_id")
    .notNull()
    .references(() => user.id),
  postType: postTypeEnum("post_type").notNull(),
  title: varchar("title", { length: 255 }),
  description: text("description"),
  mediaUrls: text("media_urls").array(), // Array of URLs
  mediaType: varchar("media_type", { length: 20 }),
  place: varchar("place", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// RELATIONS
