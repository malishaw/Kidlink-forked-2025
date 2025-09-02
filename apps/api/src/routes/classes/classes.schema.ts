import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";


import { classes } from "@repo/database";

export const classesSchema = createSelectSchema(classes);
export const classesInsertSchema = createInsertSchema(classes).omit({
  id: true,
  updatedAt: true,
  createdAt: true,
  organizationId: true,
  teacherId: true,

});

export const classesUpdateSchema = createInsertSchema(classes)
  .omit({
    id: true,
    organizationId: true,
    teacherId: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();

export type classesUpdateType = z.infer<typeof classesUpdateSchema>;
export type classes = z.infer<typeof classesSchema>;
export type classesInsertType = z.infer<typeof classesInsertSchema>;
