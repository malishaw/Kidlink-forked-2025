

// export const userProfileInsertSchema = createInsertSchema(userProfiles).omit({
//   id: true,
//   updatedAt: true,
//   createdAt: true,
//   organizationId: true,
//   userId: true,
// });

import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { chat } from "@repo/database";

// Select schema (read)
export const chatSchema = createSelectSchema(chat);

// Insert schema (create)
export const chatInsertSchema = createInsertSchema(chat).omit({
  id: true, // generated externally
  createdAt: true,
});

// Update schema (partial updates allowed)
export const chatUpdateSchema = createInsertSchema(chat)
  .omit({
    id: true,
    createdAt: true,
    createdBy: true,
  })
  .partial();

export type Chat = z.infer<typeof chatSchema>;
export type ChatInsertType = z.infer<typeof chatInsertSchema>;
export type ChatUpdateType = z.infer<typeof chatUpdateSchema>;
