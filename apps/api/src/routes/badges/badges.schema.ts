import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { badges } from "@repo/database";

export const badgesSchema = createSelectSchema(badges);

export const badgesInsertSchema = createInsertSchema(badges).omit({
  id: true,
  childId: true,
  updatedAt: true,
  createdAt: true,
  organizationId: true,
  awardedAt: true,
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
