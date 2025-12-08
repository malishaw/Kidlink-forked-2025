import {
  numeric,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { organization } from "./auth.schema";
import { childrens } from "./children.schema";

export const payments = pgTable("payments", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  childId: text("child_id")
    .references(() => childrens.id)
    .notNull(),
  amount: numeric("amount").notNull(),
  paymentMethod: varchar("payment_method", { length: 50 }).notNull(), // e.g., cash, card
  slipUrl: text("slip_url"), // URL to the payment slip image
  status: varchar("status", { length: 20 }).default("pending").notNull(), // pending, completed, failed
  paidAt: timestamp("paid_at"),
  organizationId: text("organization_id").references(() => organization.id),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
