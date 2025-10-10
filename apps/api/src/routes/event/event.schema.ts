import { event } from "@repo/database";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const eventSelectSchema = createSelectSchema(event);

export const eventInsertSchema = createInsertSchema(event).omit({
  id: true,
  organizationId: true,
  updatedAt: true,
  createdAt: true,
});

export const eventUpdateSchema = createInsertSchema(event)
  .omit({
    id: true,
    organizationId: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();

export type EventUpdateType = z.infer<typeof eventUpdateSchema>;
export type EventType = z.infer<typeof eventSelectSchema>;
export type EventInsertType = z.infer<typeof eventInsertSchema>;
