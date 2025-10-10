import { sql } from "drizzle-orm";
import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { organization } from "./auth.schema";

// assuming you have a children schema
// import { classes } from "./classes.schema"; // uncomment if you have classes table
export const galleries = pgTable("galleries", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  organizationId: text("organization_id").references(() => organization.id),
  type: varchar("type", { length: 50 }).notNull(),
  // enum-like: 'event', 'child', 'class', 'occasion', 'general'

  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  images: text("images").array(), // Array of base64 image data

  childId: text("child_id"), // if specific to a child
  classId: text("class_id"), // if specific to a class
  eventId: text("event_id"), // if linked to event entity

  userId: text("user_id").notNull(), // reference to the user who added the photos
  createdBy: text("created_by").notNull(), // display name of who added the photos
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
