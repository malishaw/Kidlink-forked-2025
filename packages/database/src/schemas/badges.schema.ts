import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { organization, user } from "./auth.schema";

// Import children table separately to avoid circular imports
import { children } from "./children.schema";

export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),

  organizationId: text("organization_id").references(() => organization.id),

  // children.id is serial (integer)
  childId: text("child_id").references(() => children.id),

  // user.id is text in your auth schema; use text here (change to integer if your users table uses int IDs)
  teacherId: text("teacher_id").references(() => user.id),

  title: varchar("title", { length: 255 }).notNull(),

  description: text("description"),

  awardedAt: timestamp("awarded_at").defaultNow(),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
