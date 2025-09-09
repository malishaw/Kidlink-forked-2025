

// export const userProfileInsertSchema = createInsertSchema(userProfiles).omit({
//   id: true,
//   updatedAt: true,
//   createdAt: true,
//   organizationId: true,
//   userId: true,
// });

import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { call } from "@repo/database";

// Select schema
export const callSchema = createSelectSchema(call);

// Insert schema
export const callInsertSchema = createInsertSchema(call).omit({ id: true });

// Update schema (omit immutable id)
export const callUpdateSchema = createInsertSchema(call)
  .omit({ id: true })
  .partial();

export type Call = z.infer<typeof callSchema>;
export type CallInsertType = z.infer<typeof callInsertSchema>;
export type CallUpdateType = z.infer<typeof callUpdateSchema>;
