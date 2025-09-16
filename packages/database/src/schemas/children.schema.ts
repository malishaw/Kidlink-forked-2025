import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";

import { date } from "drizzle-orm/pg-core";
import { timestamps } from "../utils/helpers";
import { organization } from "./auth.schema";

export const childrens = pgTable("childrens", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  organizationId: text("organization_id").references(() => organization.id),
  nurseryId: text("nursery_id"),
  parentId: text("parent_id"),
  classId: text("class_id"),
  badgeId: text("badge_id").array(), // Comma-separated badge IDs
  dateOfBirth: date("dob"),
  /////
  gender: varchar("gender", { length: 10 }),
  emergencyContact: varchar("emergency_contact", { length: 255 }),
  medicalNotes: varchar("medical_notes", { length: 500 }),
  profileImageUrl: text("profile_image_url"),
  imagesUrl: text("images_url"),
  activities: text("activities"),

  ...timestamps,

  // childrenNumber: varchar("children_number", { length: 20 }).notNull(),
  // floorNumber: integer("floor_number"),
  // isAccessible: boolean("is_accessible").default(false),
  // lastCleanedAt: timestamp("last_cleaned_at"),

  // ...timestamps
});
