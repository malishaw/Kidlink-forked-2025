import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { payments } from "@repo/database";

// Select schema for payments
export const payment = createSelectSchema(payments);

// Insert schema (omit auto-generated fields)
export const paymentInsertSchema = createInsertSchema(payments)
  .omit({
    id: true,
    updatedAt: true,
    createdAt: true,
    organizationId: true,
  })
  .transform((data) => ({ ...data }));

// Update schema (partial, omit auto-generated fields)
export const paymentUpdateSchema = createInsertSchema(payments)
  .omit({
    id: true,
    organizationId: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();

// Types
export type paymentInsertType = z.output<typeof paymentInsertSchema>; // use z.output because of transform
export type paymentUpdateType = z.infer<typeof paymentUpdateSchema>;
export type payment = z.infer<typeof payment>;
