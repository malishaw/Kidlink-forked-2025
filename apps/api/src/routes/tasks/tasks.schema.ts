import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { tasks } from "@repo/database";

export const selectTaskSchema = createSelectSchema(tasks);

export const insertTaskSchema = createInsertSchema(tasks, {
  name: (val) => val.min(1).max(500)
})
  .required({
    done: true
  })
  .omit({
    createdAt: true,
    updatedAt: true
  });

export const updateTaskSchema = insertTaskSchema.partial();
