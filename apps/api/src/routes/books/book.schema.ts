import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { books } from "@repo/database";

export const book = createSelectSchema(books);

export const bookInsertSchema = createInsertSchema(books).omit({
  id: true,
  authorId: true,
  updatedAt: true,
  createdAt: true,
  organizationId: true,
});

export const bookUpdateSchema = createInsertSchema(books)
  .omit({
    id: true,
    organizationId: true,
    authorId: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();

export type bookUpdateType = z.infer<typeof bookUpdateSchema>;
export type book = z.infer<typeof book>;
export type bookInsertType = z.infer<typeof bookInsertSchema>;

/////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////
