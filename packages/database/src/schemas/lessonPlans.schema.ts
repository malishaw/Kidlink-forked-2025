import { sql } from "drizzle-orm";
import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { organization, user } from "./auth.schema";
import { childrens } from "./children.schema";
import { classes } from "./classes.schema";

// assuming you have a children schema
// import { classes } from "./classes.schema"; // uncomment if you have classes table
export const lessonPlans = pgTable("lesson_plans", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  organizationId: text("organization_id").references(() => organization.id),

  title: varchar("title", { length: 255 }).notNull(),

  content: text("content"),

  teacherId: text("teacher_id").references(() => user.id),

<<<<<<< HEAD
  childId: text("child_id").references(() => childrens.id),
=======
  childId: text("child_id")
    .references(() => childrens.id)
    .notNull(),
>>>>>>> origin/origin/tharusha

  classId: text("class_id").references(() => classes.id),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
