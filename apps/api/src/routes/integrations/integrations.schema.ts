import { pgTable, text } from "drizzle-orm/pg-core";
import { user } from "@/db/schema/auth.schema";
import { timestamps } from "@/db/column.helpers";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// PostgreSQL table definition
export const integration = pgTable("integrations", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  appName: text("app_name").notNull(),
  domain: text("domain").notNull(),
  facebookAppId: text("facebook_app_id"),
  facebookAppSecret: text("facebook_app_secret"),
  ...timestamps
});

// Zod schemas
export const selectIntegrationSchema = createSelectSchema(integration);

export const createIntegrationSchema = createInsertSchema(integration, {
  appName: (val) => val.min(1).max(100)
}).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true
});

export const updateIntegrationSchema = createInsertSchema(integration, {
  appName: (val) => val.min(1).max(100)
})
  .partial()
  .omit({
    id: true,
    userId: true,
    createdAt: true,
    updatedAt: true
  });

export const deleteIntegrationSchema = z.object({
  id: z.string().min(1, "ID is required")
});

// Type Definitions
export type Integration = z.infer<typeof selectIntegrationSchema>;
export type CreateIntegration = z.infer<typeof createIntegrationSchema>;
export type UpdateIntegration = z.infer<typeof updateIntegrationSchema>;
export type DeleteIntegration = z.infer<typeof deleteIntegrationSchema>;
