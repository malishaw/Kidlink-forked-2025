import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { notifications } from "@repo/database";

export const notification = createSelectSchema(notifications);

export const notificationInsertSchema = createInsertSchema(notifications).omit({
  id: true,
  updatedAt: true,
  createdAt: true,
  organizationId: true,
});

export const notificationUpdateSchema = createInsertSchema(notifications)
  .omit({
    id: true,
    organizationId: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();

export type notificationUpdateType = z.infer<typeof notificationUpdateSchema>;
export type notification = z.infer<typeof notification>;
export type notificationInsertType = z.infer<typeof notificationInsertSchema>;
