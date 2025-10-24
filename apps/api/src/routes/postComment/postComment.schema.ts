import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { postComments } from "@repo/database";

export const postComment = createSelectSchema(postComments);

export const postCommentInsertSchema = createInsertSchema(postComments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
});

export const postCommentUpdateSchema = createInsertSchema(postComments)
  .omit({
    id: true,
    userId: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();

export type postCommentUpdateType = z.infer<typeof postCommentUpdateSchema>;
export type postComment = z.infer<typeof postComment>;
export type postCommentInsertType = z.infer<typeof postCommentInsertSchema>;
