import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { posts } from "@repo/database";

export const post = createSelectSchema(posts);

export const postInsertSchema = createInsertSchema(posts).omit({
  id: true,
  updatedAt: true,
  createdAt: true,
  organizationId: true,
});

export const postUpdateSchema = createInsertSchema(posts)
  .omit({
    id: true,
    organizationId: true,

    createdAt: true,
    updatedAt: true,
  })
  .partial();

export type postUpdateType = z.infer<typeof postUpdateSchema>;
export type post = z.infer<typeof post>;
export type postInsertType = z.infer<typeof postInsertSchema>;

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
    postId: true,
  })
  .partial();

export type postCommentUpdateType = z.infer<typeof postCommentUpdateSchema>;
export type postComment = z.infer<typeof postComment>;
export type postCommentInsertType = z.infer<typeof postCommentInsertSchema>;

/////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////

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
