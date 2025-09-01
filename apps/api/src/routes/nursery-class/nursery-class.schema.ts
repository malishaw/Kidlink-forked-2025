import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { classes } from "@repo/database";

// Select schema (for reading)
export const classSchema = createSelectSchema(classes);

// Insert schema (for creating new rows)
export const classInsertSchema = createInsertSchema(classes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Update schema (for partial updates)
export const classUpdateSchema = createInsertSchema(classes)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();

// Types
export type Class = z.infer<typeof classSchema>;
export type ClassInsertType = z.infer<typeof classInsertSchema>;
export type ClassUpdateType = z.infer<typeof classUpdateSchema>;
