import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { parents } from "@repo/database";

// Select schema for parents
export const parent = createSelectSchema(parents);

// Insert schema (omit auto-generated fields)
export const parentInsertSchema = createInsertSchema(parents)
  .omit({
    id: true,
    updatedAt: true,
    createdAt: true,
    organizationId: true,
  })
  .transform((data) => ({ ...data }));

// Update schema (partial, omit auto-generated fields)
export const parentUpdateSchema = createInsertSchema(parents)
  .omit({
    id: true,
    organizationId: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();

// Types
export type parentInsertType = z.output<typeof parentInsertSchema>; // use z.output because of transform
export type parentUpdateType = z.infer<typeof parentUpdateSchema>;
export type parent = z.infer<typeof parent>;
