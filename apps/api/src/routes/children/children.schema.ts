import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { children } from "../../../../../packages/database/src/schemas/children.schema";

// Full row from DB (for responses)
export const childrenSchema = createSelectSchema(children);

// Insert payload
export const childrenInsertSchema = createInsertSchema(children, {
  dateOfBirth: z.coerce.date().nullable().optional(),
}).omit({
  id: true,
  organizationId: true,
  // parentId: true,
  createdAt: true,
  updatedAt: true,
  // Remove these omits so they can be included in requests or set by server
  // organizationId: true,
  // parentId: true,
});

// Update payload (all optional)
export const childrenUpdateSchema = createInsertSchema(children, {
  dateOfBirth: z.coerce.date().nullable().optional(),
})
  .omit({
    id: true,
    organizationId: true,
    // parentId: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();

// Types
export type Child = z.infer<typeof childrenSchema>;
export type ChildInsert = z.infer<typeof childrenInsertSchema>;
export type ChildUpdate = z.infer<typeof childrenUpdateSchema>;
