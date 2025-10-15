import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { notifications } from "@repo/database";

// Select schema for notifications
export const notification = createSelectSchema(notifications);

// Insert schema (omit auto-generated fields)
export const notificationInsertSchema = createInsertSchema(notifications)
  .omit({
    id: true,
    updatedAt: true,
    createdAt: true,
    organizationId: true,
  })
  .transform((data) => ({ ...data }));

// Update schema (partial, omit auto-generated fields)
export const notificationUpdateSchema = createInsertSchema(notifications)
  .omit({
    id: true,
    organizationId: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();

// Types
export type notificationInsertType = z.output<typeof notificationInsertSchema>; // use z.output because of transform
export type notificationUpdateType = z.infer<typeof notificationUpdateSchema>;
export type notification = z.infer<typeof notification>;
