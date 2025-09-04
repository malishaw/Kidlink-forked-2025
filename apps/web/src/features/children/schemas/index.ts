import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { childrens } from "@repo/database";

export const children = createSelectSchema(childrens);

export const childrenInsertSchema = createInsertSchema(childrens).omit({
  id: true,
  updatedAt: true,
  createdAt: true,
  organizationId: true,
});

export const childrenUpdateSchema = createInsertSchema(childrens)
  .omit({
    id: true,
    organizationId: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();

export type childrenUpdateType = z.infer<typeof childrenUpdateSchema>;
export type children = z.infer<typeof children>;
export type childrenInsertType = z.infer<typeof childrenInsertSchema>;

import { classes } from "@repo/database";

// Base select schema (from Drizzle)
export const classSchema = createSelectSchema(classes, {
  teacherIds: z.array(z.string()), // force teacherIds to be string[]
  nurseryId: z.string().nullable(),
  mainTeacherId: z.string().nullable(),
});

// Insert schema
export const classInsertSchema = createInsertSchema(classes, {
  teacherIds: z.array(z.string()).default([]),
  nurseryId: z.string().nullable(),
  mainTeacherId: z.string().nullable(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Update schema (partial for PATCH)
export const classUpdateSchema = classInsertSchema.partial();

// Types
export type Class = z.infer<typeof classSchema>;
export type ClassInsertType = z.infer<typeof classInsertSchema>;
export type ClassUpdateType = z.infer<typeof classUpdateSchema>;
