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

<<<<<<< HEAD
  // main teacher (single)
=======
>>>>>>> origin/feature/nursery
  mainTeacherId: text("main_teacher_id").references(() => teachers.id, {
    onDelete: "set null",
  }),

<<<<<<< HEAD
  // all teachers (array of teacher IDs)
  teacherIds: text("teacher_ids")
    .array()
    .default(sql`ARRAY[]::text[]`)
    .notNull(),
=======
  teacherIds: text("teacher_ids")
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),

  childIds: text("child_ids")
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),
>>>>>>> origin/feature/nursery

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
