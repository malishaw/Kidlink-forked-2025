import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { organization } from "./auth.schema"; // Assuming organization table exists
import { children } from "./children.schema"; // Assuming child schema will be created

export const parent = pgTable("parent", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  organizationId: text("organization_id")
    .references(() => organization.id)
    .notNull(),

  childId: text("child_id")
    .references(() => children.id)
    .notNull(),

  parentName: varchar("parent_name", { length: 255 }).notNull(),

  email: varchar("email", { length: 255 }).notNull(),

  phoneNumber: varchar("phone_number", { length: 20 }),

  address: text("address"),

  updatedAt: timestamp("updated_at").defaultNow(),

  createdAt: timestamp("created_at").defaultNow(),
});
