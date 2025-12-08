import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { postComments } from "@repo/database";

// Select schema for post comments
export const comment = createSelectSchema(postComments);

// Insert schema (omit auto-generated fields)
export const commentInsertSchema = createInsertSchema(postComments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
});

// Update schema (partial, omit auto-generated fields)
export const commentUpdateSchema = createInsertSchema(postComments)
  .omit({
    id: true,
    userId: true,
    createdAt: true,
    updatedAt: true,
    postId: true,
  })
  .partial();

// Types
export type commentInsertType = z.infer<typeof commentInsertSchema>;
export type commentUpdateType = z.infer<typeof commentUpdateSchema>;
export type comment = z.infer<typeof comment>;
