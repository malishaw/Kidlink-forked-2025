import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { conversations } from "@repo/database";

export const conversation = createSelectSchema(conversations);

export const conversationInsertSchema = createInsertSchema(conversations).omit({
  id: true,
  organizationId: true,
  updatedAt: true,
  createdAt: true,
});

export const conversationUpdateSchema = createInsertSchema(conversations)
  .omit({
    id: true,
    organizationId: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();

export type conversationUpdateType = z.infer<typeof conversationUpdateSchema>;
export type conversation = z.infer<typeof conversation>;
export type conversationInsertType = z.infer<typeof conversationInsertSchema>;
