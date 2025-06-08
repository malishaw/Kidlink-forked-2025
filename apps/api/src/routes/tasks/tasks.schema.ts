import { boolean, integer, pgTable, text } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { timestamps } from "@/db/column.helpers";
import { z } from "zod";

export const tasks = pgTable("tasks", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  done: boolean("done").notNull().default(false),
  ...timestamps
});

export const selectTaskSchema = createSelectSchema(tasks);

export const insertTaskSchema = createInsertSchema(tasks);

export const updateTaskSchema = insertTaskSchema.partial();

// Type Definitions
export type Task = z.infer<typeof selectTaskSchema>;

export type InsertTask = z.infer<typeof insertTaskSchema>;
