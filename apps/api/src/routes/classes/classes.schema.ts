import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";


import { classes } from "@repo/database";

export const classesSchema = createSelectSchema(classes, {
  teacherIds: z.array(z.string()).nullable(),
  childIds: z.array(z.string()).nullable(),
});

export const classesInsertSchema = createInsertSchema(classes, {
  teacherIds: z.array(z.string()).default([]),
  childIds: z.array(z.string()).default([]),
}).omit({
  id: true,
  updatedAt: true,
  createdAt: true,
  organizationId: true,
});

export const classesUpdateSchema = z.object({
  name: z.string().optional(),
  nurseryId: z.string().nullable().optional(),
  mainTeacherId: z.string().nullable().optional(),
  teacherIds: z.array(z.string()).optional(),
  childIds: z.array(z.string()).optional(),
});

export type classesUpdateType = z.infer<typeof classesUpdateSchema>;
export type classes = z.infer<typeof classesSchema>;
export type classesInsertType = z.infer<typeof classesInsertSchema>;
