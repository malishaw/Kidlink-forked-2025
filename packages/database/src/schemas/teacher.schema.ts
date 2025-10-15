import { sql } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { organization } from "./auth.schema";

export const teachers = pgTable("teacher", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  classId: text("class_id"),
  organizationId: text("organization_id").references(() => organization.id),
  userId: text("user_id"),
  name: text("name").notNull(),
  phoneNumber: text("phone_number").notNull(),
  email: text("email").notNull(),
  address: text("address").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});
