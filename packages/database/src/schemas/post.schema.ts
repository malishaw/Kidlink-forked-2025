import { sql } from "drizzle-orm";
import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { organization, user } from "./auth.schema";
import { nurseries } from "./nursery.schema";

//   id: text("id")
//     .primaryKey()
//     .default(sql`gen_random_uuid()`),
//   organizationId: text("organization_id").references(() => organization.id),

//   userId: text("user_id")
//     .references(() => user.id)
//     .notNull(),
//   firstName: varchar("first_name", { length: 255 }).notNull(),
//   lastName: varchar("last_name", { length: 255 }),
//   currentPosition: varchar("current_position", { length: 255 }),
//   DOB: date("Date_of_birth"),
//   currentWorkplace: varchar("currentWorkplace", { length: 255 }),
//   description: text("description"),
//   additionalInfo: text("additional_info"),
//   tagline: varchar("tagline", { length: 255 }),
//   headline: varchar("headline", { length: 255 }),
//   about: text("about"),
//   location: varchar("location", { length: 255 }),
//   profilePhotoUrl: varchar("profile_photo_url", { length: 500 }),
//   bannerPhotoUrl: varchar("banner_photo_url", { length: 500 }),
//   website: varchar("website", { length: 255 }),
//   linkedinUrl: varchar("linkedin_url", { length: 255 }),
//   githubUrl: varchar("github_url", { length: 255 }),
//   portfolioUrl: varchar("portfolio_url", { length: 255 }),
//   updatedAt: timestamp("updated_at").defaultNow(),
//   createdAt: timestamp("created_at").defaultNow(),
// });
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

  nurseryId: uuid("nursery_id")
    .notNull()
    .references(() => nurseries.id),
  authorId: uuid("author_id")
    .notNull()
    .references(() => user.id),
  postType: postTypeEnum("post_type").notNull(),
  title: varchar("title", { length: 255 }),
  description: text("description"),
  mediaUrls: text("media_urls").array(), // Array of URLs
  mediaType: varchar("media_type", { length: 20 }),
  place: varchar("place", { length: 255 }),
  dateTime: timestamp("date_time", { mode: "string" }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// RELATIONS
