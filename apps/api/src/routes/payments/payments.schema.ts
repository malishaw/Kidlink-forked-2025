import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { payments } from "@repo/database";

export const paymentsSchema = createSelectSchema(payments);

export const paymentsInsertSchema = createInsertSchema(payments, {
  paidAt: z.coerce.date().nullable().optional(),
}).omit({
  id: true,
  updatedAt: true,
  createdAt: true,
  organizationId: true,
});

export const paymentsUpdateSchema = createInsertSchema(payments)
  .omit({
    id: true,
    organizationId: true,
    childId: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();

export type paymentsUpdateType = z.infer<typeof paymentsUpdateSchema>;
export type payments = z.infer<typeof paymentsSchema>;
export type paymentsInsertType = z.infer<typeof paymentsInsertSchema>;
