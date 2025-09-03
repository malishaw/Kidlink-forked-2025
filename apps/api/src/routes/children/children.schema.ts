import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { childrens } from "@repo/database";

export const children = createSelectSchema(childrens);

export const childrenInsertSchema = createInsertSchema(childrens).omit({
  id: true,
  updatedAt: true,
  createdAt: true,
  organizationId: true,
});

export const childrenUpdateSchema = createInsertSchema(childrens)
  .omit({
    id: true,
    organizationId: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();

export type childrenUpdateType = z.infer<typeof childrenUpdateSchema>;
export type children = z.infer<typeof children>;
export type childrenInsertType = z.infer<typeof childrenInsertSchema>;
