import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { organization, user } from "./auth.schema";
import { children } from "./children.schema";

export const feedbacks = pgTable("feedbacks", {
  id: serial("id").primaryKey(),

  organizationId: text("organization_id").references(() => organization.id),

  // children.id is serial (integer)
  childId: text("child_id").references(() => children.id),

  // user.id is text in your auth schema; use text here (change to integer if your users table uses int IDs)
  teacherId: text("teacher_id").references(() => user.id),

  content: text("content"),

  // store multiple image URLs/paths; Postgres text[]
  images: text("images").array(),

  reply: text("reply"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
