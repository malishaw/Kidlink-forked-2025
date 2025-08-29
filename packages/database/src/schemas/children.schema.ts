import { sql } from "drizzle-orm";
import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { organization } from "./auth.schema";
import { classes } from "./classes.schema";

//import { classes } from "./classes.schema"; // assuming you have a classes schema

export const children = pgTable("children", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  organizationId: text("organization_id").references(() => organization.id),

  // parentId: text("parent_id")
  //   .references(() => user.id)
  //   .notNull(),

  classesId: text("class_id").references(() => classes.id),

  name: varchar("name", { length: 255 }).notNull(),

  dateOfBirth: timestamp("dob"),

  updatedAt: timestamp("updated_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});
