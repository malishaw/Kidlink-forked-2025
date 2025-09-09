

// export const userProfileInsertSchema = createInsertSchema(userProfiles).omit({
//   id: true,
//   updatedAt: true,
//   createdAt: true,
//   organizationId: true,
//   userId: true,
// });

import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { receipt } from "@repo/database";

// Select schema
export const receiptSchema = createSelectSchema(receipt);

// Insert schema (both messageId + userId required)
export const receiptInsertSchema = createInsertSchema(receipt);

// Update schema (cannot change messageId/userId, only timestamps)
export const receiptUpdateSchema = createInsertSchema(receipt)
  .omit({
    messageId: true,
    userId: true,
  })
  .partial();

export type Receipt = z.infer<typeof receiptSchema>;
export type ReceiptInsertType = z.infer<typeof receiptInsertSchema>;
export type ReceiptUpdateType = z.infer<typeof receiptUpdateSchema>;

