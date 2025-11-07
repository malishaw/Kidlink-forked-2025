import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { postLikes } from "@repo/database";

export const postLike = createSelectSchema(postLikes);

export const postLikeInsertSchema = createInsertSchema(postLikes).omit({
  id: true,
  updatedAt: true,
  createdAt: true,

  userId: true,
});

export const postLikeUpdateSchema = createInsertSchema(postLikes)
  .omit({
    id: true,
    postId: true,
    userId: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();

export type postLikeUpdateType = z.infer<typeof postLikeUpdateSchema>;
export type postLike = z.infer<typeof postLike>;
export type postLikeInsertType = z.infer<typeof postLikeInsertSchema>;
