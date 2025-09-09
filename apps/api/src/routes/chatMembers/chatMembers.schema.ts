// export const userProfileInsertSchema = createInsertSchema(userProfiles).omit({
//   id: true,
//   updatedAt: true,
//   createdAt: true,
//   organizationId: true,
//   userId: true,
// });

import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { chatMember } from "@repo/database";

// Select schema (read)
export const chatMemberSchema = createSelectSchema(chatMember).omit({
  userId: true, // omit userId to protect privacy
  role: true, // omit role to protect privacy
});

// Insert schema (create)
export const chatMemberInsertSchema = createInsertSchema(chatMember).omit({
 id: true, // id is auto-generated
});

// Update schema (partial, cannot change chatId or userId)
export const chatMemberUpdateSchema = createInsertSchema(chatMember)
  .omit({
    chatId: true,
    userId: true,
    id: true,
  })
  .partial();

export type ChatMember = z.infer<typeof chatMemberSchema>;
export type ChatMemberInsertType = z.infer<typeof chatMemberInsertSchema>;
export type ChatMemberUpdateType = z.infer<typeof chatMemberUpdateSchema>;
