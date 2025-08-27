import { sql } from "drizzle-orm";
import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { organization } from "./auth.schema";

export const notifications = pgTable("notifications", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  organizationId: text("organization_id").references(() => organization.id),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  metadata: text("metadata"),
  //notificationType: text("notification_type").notNull(), // "info", "warning", "error"
  notificationType: text("notification_type")
    .notNull()
    .$type<"pending" | "approved">(),
  recipientType: varchar("recipient_type", { length: 20 }).notNull(), // "teacher", "parent", "all"
  recipientId: text("recipient_id"), // Optional - for specific recipient
  readAt: timestamp("read_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
