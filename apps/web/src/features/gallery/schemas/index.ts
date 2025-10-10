import { galleries } from "@repo/database";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const gallerySelectSchema = createSelectSchema(galleries);

export const galleryInsertSchema = createInsertSchema(galleries).omit({
  id: true,
  organizationId: true,
  userId: true,
  createdBy: true,
  updatedAt: true,
  createdAt: true,
});

export const galleryUpdateSchema = createInsertSchema(galleries)
  .omit({
    id: true,
    organizationId: true,
    userId: true,
    createdBy: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();

export type galleryUpdateType = z.infer<typeof galleryUpdateSchema>;
export type galleryType = z.infer<typeof gallerySelectSchema>;
export type galleryInsertType = z.infer<typeof galleryInsertSchema>;
