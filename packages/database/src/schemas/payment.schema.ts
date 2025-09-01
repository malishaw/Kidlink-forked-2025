import { sql } from "drizzle-orm";
import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { organization } from "./auth.schema";
import { parents } from "./parent.schema";
export const paymentMethodStatusEnum = pgEnum("payment_method", [
  "card",
  "bankTransfer",
]);

export const payments = pgTable("payment", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  organizationId: text("organization_id").references(() => organization.id),
  childId: text("child_id"),
  parentId: text("parent_id").references(() => parents.id),
  paymentMethod: paymentMethodStatusEnum("payment_method")
    .default("bankTransfer")
    .notNull(),
  amount: text("amount").notNull(),
  phoneNumber: text("phone_number").notNull(),
  email: text("email").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});
