import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { classes } from "@repo/database";

// Base select schema (from Drizzle)
export const classSchema = createSelectSchema(classes, {
  teacherIds: z.array(z.string()).default([]).optional(), // force teacherIds to be string[]
  childIds: z.array(z.string()).default([]).optional(), // force childIds to be string[]
  nurseryId: z.string(),
  mainTeacherId: z.string().nullable().optional(),
});

// Insert schema
export const classInsertSchema = createInsertSchema(classes, {
  teacherIds: z.array(z.string()).default([]).optional(),
  childIds: z.array(z.string()).default([]).optional(),
  nurseryId: z.string(),
  mainTeacherId: z.string().nullable().optional(),
}).omit({
  id: true,
  organizationId: true,
  createdAt: true,
  updatedAt: true,
});

// Update schema (partial for PATCH)
export const classUpdateSchema = classInsertSchema.partial();

// Types
export type Class = z.infer<typeof classSchema>;
export type ClassInsertType = z.infer<typeof classInsertSchema>;
export type ClassUpdateType = z.infer<typeof classUpdateSchema>;
