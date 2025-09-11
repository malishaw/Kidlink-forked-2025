import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { badges } from "@repo/database";

export const badgesSchema = createSelectSchema(badges);

// Base schema from drizzle
const baseInsertSchema = createInsertSchema(badges).omit({
  id: true,
  childId: true,
  updatedAt: true,
  createdAt: true,
  organizationId: true,
  awardedAt: true,
});

// 👇 Override nullables with stricter required types for the form
export const badgesInsertSchema = baseInsertSchema.extend({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  badgeType: z.string().min(1, "Badge type is required"),
  points: z.number().nonnegative().default(0),
  level: z.string().min(1, "Level is required"),
  iconUrl: z.string().url("Must be a valid URL"),
});

export const badgesUpdateSchema = createInsertSchema(badges)
  .omit({
    id: true,
    organizationId: true,
    childId: true,
    createdAt: true,
    updatedAt: true,
    awardedAt: true,
  })
  .partial();

export type badgesUpdateType = z.infer<typeof badgesUpdateSchema>;
export type badgesType = z.infer<typeof badgesSchema>;
export type badgesInsertType = z.infer<typeof badgesInsertSchema>;
export { badges };
