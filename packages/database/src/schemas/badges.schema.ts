import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { organization, user } from "./auth.schema";

// Import children table separately to avoid circular imports
import { sql } from "drizzle-orm";
import { childrens } from "./children.schema";

export const statusTypeEnum = pgEnum("status_type", [
  "ee",
  "city",
  "garden",
  "mountain",
  "pool",
  "courtyard",
  "street",
  "interior",
]);

export const badges = pgTable("badges", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  organizationId: text("organization_id").references(() => organization.id),

  // children.id is serial (integer)
  childId: text("child_id").references(() => childrens.id),

  // user.id is text in your auth schema; use text here (change to integer if your users table uses int IDs)
  teacherId: text("teacher_id").references(() => user.id),

  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),

  // 🔹 Newly added fields
  status: varchar("status", { length: 50 }).default("active"), // e.g., active, revoked, archived
  badgeType: varchar("badge_type", { length: 100 }), // category/type
  iconUrl: text("icon_url"), // image/icon
  points: integer("points").default(0), // gamification points
  level: varchar("level", { length: 50 }), // e.g., bronze, silver, gold

  awardedAt: timestamp("awarded_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
