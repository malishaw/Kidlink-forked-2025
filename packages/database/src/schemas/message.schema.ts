import { sql } from "drizzle-orm";
import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { conversations } from "./conversation.schema";

export const messages = pgTable("messages", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  conversationId: text("conversation_id")
    .notNull()
    .references(() => conversations.id, { onDelete: "cascade" }),
  senderId: text("sender_id").notNull(),

  content: text("content"), // message text
  attachmentUrl: text("attachment_url"), // optional file/image

  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),

  // firstName: varchar("first_name", { length: 255 }).notNull(),
  // lastName: varchar("last_name", { length: 255 }),
  // currentPosition: varchar("current_position", { length: 255 }),
  // DOB: date("Date_of_birth"),
  // currentWorkplace: varchar("currentWorkplace", { length: 255 }),
  // description: text("description"),
  // additionalInfo: text("additional_info"),
  // tagline: varchar("tagline", { length: 255 }),
  // headline: varchar("headline", { length: 255 }),
  // about: text("about"),
  // location: varchar("location", { length: 255 }),
  // profilePhotoUrl: varchar("profile_photo_url", { length: 500 }),
  // bannerPhotoUrl: varchar("banner_photo_url", { length: 500 }),
  // website: varchar("website", { length: 255 }),
  // linkedinUrl: varchar("linkedin_url", { length: 255 }),
  // githubUrl: varchar("github_url", { length: 255 }),
  // portfolioUrl: varchar("portfolio_url", { length: 255 }),
});
