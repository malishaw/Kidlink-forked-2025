import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { organization } from "@repo/database";

// Select schema for organization
export const organizationSelectSchema = createSelectSchema(organization);

// Insert schema (omit auto-generated fields)
export const organizationInsertSchema = createInsertSchema(organization)
  .omit({
    id: true,
    createdAt: true,
  })
  .transform((data) => ({ ...data }));

// Update schema (partial, omit auto-generated fields)
export const organizationUpdateSchema = createInsertSchema(organization)
  .omit({
    id: true,
    createdAt: true,
  })
  .partial();

// Types
export type organizationInsertType = z.output<typeof organizationInsertSchema>; // use z.output because of transform
export type organizationUpdateType = z.infer<typeof organizationUpdateSchema>;
export type organization = z.infer<typeof organizationSelectSchema>;
