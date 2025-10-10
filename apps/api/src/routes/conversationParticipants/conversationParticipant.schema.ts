import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { conversationParticipants } from "@repo/database";

export const conversationParticipant = createSelectSchema(
  conversationParticipants
);

export const conversationParticipantInsertSchema = createInsertSchema(
  conversationParticipants
).omit({
  id: true,

  updatedAt: true,
  createdAt: true,
});

export const conversationParticipantUpdateSchema = createInsertSchema(
  conversationParticipants
)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();

export type conversationParticipantUpdateType = z.infer<
  typeof conversationParticipantUpdateSchema
>;
export type conversationParticipant = z.infer<typeof conversationParticipant>;
export type conversationParticipantInsertType = z.infer<
  typeof conversationParticipantInsertSchema
>;
