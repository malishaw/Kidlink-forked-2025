import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { integration } from "@repo/database/schemas";
import { z } from "zod";

// Zod schemas
export const selectIntegrationSchema = createSelectSchema(integration);

export const createIntegrationSchema = createInsertSchema(integration).omit({
  id: true,
  organizationId: true,
  createdAt: true,
  updatedAt: true
});

export const updateIntegrationSchema = createIntegrationSchema.partial();

// Type Definitions
export type Integration = z.infer<typeof selectIntegrationSchema>;

export type CreateIntegration = z.infer<typeof createIntegrationSchema>;

export type UpdateIntegration = z.infer<typeof updateIntegrationSchema>;
