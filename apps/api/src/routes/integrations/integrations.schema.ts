import { timestamps } from "@/db/column.helpers";
import { organization } from "@/db/schema";
import { relations } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// PostgreSQL table definition
export const integration = pgTable("integrations", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  domain: text("domain").notNull(),

  /**
   * Social Prover Details
   * - TODO: Extend these fields when adding instagram feature etc.
   */
  facebookAppId: text("facebook_app_id"),
  facebookAppSecret: text("facebook_app_secret"),

  /**
   * Assuming a organization is equals to a integrations
   * When a Integrations creates, an organization will be created automatically
   */
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, {
      onDelete: "cascade"
    }),

  ...timestamps
});

// Drizzle Relation Definitions
export const organizationRelations = relations(organization, ({ one }) => ({
  integration: one(integration)
}));

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
