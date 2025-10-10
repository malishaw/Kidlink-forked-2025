import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { messages } from "@repo/database";

export const message = createSelectSchema(messages);

export const messageInsertSchema = createInsertSchema(messages).omit({
  id: true,
  updatedAt: true,
  createdAt: true,
});

export const messageUpdateSchema = createInsertSchema(messages)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();

export type messageUpdateType = z.infer<typeof messageUpdateSchema>;
export type message = z.infer<typeof message>;
export type messageInsertType = z.infer<typeof messageInsertSchema>;
