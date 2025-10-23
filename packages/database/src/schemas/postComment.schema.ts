import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./auth.schema";
import { posts } from "./post.schema";

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
// COMMENTS TABLE
export const postComments = pgTable("post_comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  postId: uuid("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// LIKES TABLE
