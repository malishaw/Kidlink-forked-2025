import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { nurseries } from "@repo/database";

// Select schema (for reading)
export const nursery = createSelectSchema(nurseries);

// Insert schema (for creating new rows)
export const nurseryInsertSchema = createInsertSchema(nurseries).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  organizationId: true,
});

// Update schema (for partial updates)
export const nurseryUpdateSchema = createInsertSchema(nurseries)
  .omit({
    id: true,
    organizationId: true,
    createdBy: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();

// Types
export type Nursery = z.infer<typeof nursery>;
export type NurseryInsertType = z.infer<typeof nurseryInsertSchema>;
export type NurseryUpdateType = z.infer<typeof nurseryUpdateSchema>;
