import { sql } from "drizzle-orm";
import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { organization, user } from "./auth.schema";
import { nurseries } from "./nursery.schema";

export const classes = pgTable("classes", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 100 }).notNull(),
  nurseryId: text("nursery_id").references(() => nurseries.id), // assuming nursery is an organization
  teacherId: text("teacher_id").references(() => user.id), // assuming teacher is a user
  organizationId: text("organization_id").references(() => organization.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
