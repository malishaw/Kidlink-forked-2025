import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { feedbacks } from "@repo/database";

// Select schema for feedbacks
export const feedback = createSelectSchema(feedbacks);

// Insert schema (omit auto-generated fields)
export const feedbackInsertSchema = createInsertSchema(feedbacks)
  .omit({
    id: true,
    updatedAt: true,
    createdAt: true,
    organizationId: true,
  })
  .transform((data) => ({ ...data }));

// Update schema (partial, omit auto-generated fields)
export const feedbackUpdateSchema = createInsertSchema(feedbacks)
  .omit({
    id: true,
    organizationId: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();

// Types
export type feedbackInsertType = z.output<typeof feedbackInsertSchema>; // use z.output because of transform
export type feedbackUpdateType = z.infer<typeof feedbackUpdateSchema>;
export type feedback = z.infer<typeof feedback>;
