import { sql } from "drizzle-orm";
import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { nurseries } from "./nursery.schema";
import { teachers } from "./teacher.schema";

export const classes = pgTable("classes", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  nurseryId: text("nursery_id").references(() => nurseries.id, {
    onDelete: "set null",
  }),

  name: varchar("name", { length: 100 }).notNull(),

  mainTeacherId: text("main_teacher_id").references(() => teachers.id, {
    onDelete: "set null",
  }),

  teacherIds: text("teacher_ids")
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),

  childIds: text("child_ids")
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
