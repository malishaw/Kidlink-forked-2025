import { sql } from "drizzle-orm";
import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { organization } from "./auth.schema";
import { nurseries } from "./nursery.schema";
import { teachers } from "./teacher.schema";

export const classes = pgTable("classes", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  nurseryId: text("nursery_id").references(() => nurseries.id, {
    onDelete: "cascade",
  }),

  organizationId: text("organization_id").references(() => organization.id),

  name: varchar("name", { length: 100 }).notNull(),

  mainTeacherId: text("main_teacher_id").references(() => teachers.id, {
    onDelete: "cascade",
  }),

  teacherIds: text("teacher_ids").array(),

  childIds: text("child_ids").array(),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),

  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});
