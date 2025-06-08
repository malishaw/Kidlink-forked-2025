import { relations } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";
import { organization } from "./auth.schema";

import { timestamps } from "../utils/helpers";

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
