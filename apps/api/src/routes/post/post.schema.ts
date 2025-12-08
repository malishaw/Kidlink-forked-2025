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

/////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////
