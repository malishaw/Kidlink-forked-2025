import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { notifications } from "@repo/database";

export const notificationsSchema = createSelectSchema(notifications);

export const notificationsInsertSchema = createInsertSchema(notifications).omit(
  {
    id: true,
    updatedAt: true,
    createdAt: true,
    organizationId: true,
    recipientId: true,
  }
);

export const notificationsUpdateSchema = createInsertSchema(notifications)
  .omit({
    id: true,
    organizationId: true,
    createdAt: true,
    updatedAt: true,
    recipientId: true,
  })
  .partial();

export type notificationsUpdateType = z.infer<typeof notificationsUpdateSchema>;
export type notifications = z.infer<typeof notificationsSchema>;
export type notificationsInsertType = z.infer<typeof notificationsInsertSchema>;
