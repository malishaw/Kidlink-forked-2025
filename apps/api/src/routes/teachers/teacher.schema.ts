import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { teachers } from "@repo/database";

// Select schema for teachers
export const teacher = createSelectSchema(teachers);

// Insert schema (omit auto-generated fields)
export const teacherInsertSchema = createInsertSchema(teachers)
  .omit({
    id: true,
    updatedAt: true,
    createdAt: true,
    organizationId: true,
    userId: true,
  })
  .transform((data) => ({ ...data }));

// Update schema (partial, omit auto-generated fields)
export const teacherUpdateSchema = createInsertSchema(teachers)
  .omit({
    id: true,
    organizationId: true,
    createdAt: true,
    updatedAt: true,
    userId: true,
  })
  .partial();

// Types
export type teacherInsertType = z.output<typeof teacherInsertSchema>; // use z.output because of transform
export type teacherUpdateType = z.infer<typeof teacherUpdateSchema>;
export type teacher = z.infer<typeof teacher>;
