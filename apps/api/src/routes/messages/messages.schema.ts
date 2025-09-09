

// export const userProfileInsertSchema = createInsertSchema(userProfiles).omit({
//   id: true,
//   updatedAt: true,
//   createdAt: true,
//   organizationId: true,
//   userId: true,
// });

import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { message } from "@repo/database";

// Base schema
export const messageSchema = createSelectSchema(message);

// Insert schema
export const messageInsertSchema = createInsertSchema(message).omit({
  id: true,
  createdAt: true,
  deletedAt: true,
});

// Update schema (partial, cannot change id, chatId, or senderId)
export const messageUpdateSchema = createInsertSchema(message)
  .omit({
    id: true,
    chatId: true,
    senderId: true,
    createdAt: true,
  })
  .partial();

export type Message = z.infer<typeof messageSchema>;
export type MessageInsertType = z.infer<typeof messageInsertSchema>;
export type MessageUpdateType = z.infer<typeof messageUpdateSchema>;
