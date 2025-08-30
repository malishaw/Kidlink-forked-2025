import { sql } from "drizzle-orm";
import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { organization } from "./auth.schema";
import { classes } from "./classes.schema";
import { children } from "./children.schema";
import { lessonPlans } from "./lessonPlans.schema";

//import { classes } from "./classes.schema"; // assuming you have a classes schema

export const teacher = pgTable("teacher", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  organizationId: text("organization_id").references(() => organization.id),
  childrenId: text("children_id").references(() => children.id),
  lessonPlansId: text("lesson_plans_id").references(() => lessonPlans.id),

  // parentId: text("parent_id")
  //   .references(() => user.id)
  //   .notNull(),

  classesId: text("class_id").references(() => classes.id),

  name: varchar("name", { length: 255 }).notNull(),

  updatedAt: timestamp("updated_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});
