import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { feedbacks } from "@repo/database";

// Full row from DB (for responses)
export const feedbacksSchema = createSelectSchema(feedbacks);

// Insert payload
export const feedbacksInsertSchema = createInsertSchema(feedbacks, {
content: z.string().min(2).max(1000).trim(),
images: z.array(z.string().url()).min(1).max(5),
reply: z.string().min(2).max(1000).trim().optional(),
}).omit({
  id: true,
  childId: true, // usually set by server from logged-in user
  organizationId: true,
  teacherId: true,
  createdAt: true,
  updatedAt: true,
});

// Update payload (all optional)
export const feedbacksUpdateSchema = createInsertSchema(feedbacks, {
  content: z.string().min(2).max(1000).trim().optional(),
  images: z.array(z.string().url()).min(1).max(5).optional(),
  reply: z.string().min(2).max(1000).trim().optional(),
})
  .omit({
    id: true,
    childId: true, // usually set by server from logged-in user
    organizationId: true,
    teacherId: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();

// Types
export type Child = z.infer<typeof feedbacksSchema>;
export type ChildInsert = z.infer<typeof feedbacksInsertSchema>;
export type ChildUpdate = z.infer<typeof feedbacksUpdateSchema>;
