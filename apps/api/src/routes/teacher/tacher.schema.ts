import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { teacher } from "../../../../../packages/database/src/schemas/teacher.schema";

// Full row from DB (for responses)
export const teacherSchema = createSelectSchema(teacher);

// Insert payload
export const teacherInsertSchema = createInsertSchema(teacher, {}).omit({
  id: true,
  organizationId: true,
  createdAt: true,
  updatedAt: true,
  // Remove these omits so they can be included in requests or set by server
  // organizationId: true,
  // parentId: true,
});

// Update payload (all optional)
export const teacherUpdateSchema = createInsertSchema(teacher, {})
  .omit({
    id: true,
    organizationId: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();

// Types
export type Child = z.infer<typeof teacherSchema>;
export type ChildInsert = z.infer<typeof teacherInsertSchema>;
export type ChildUpdate = z.infer<typeof teacherUpdateSchema>;
