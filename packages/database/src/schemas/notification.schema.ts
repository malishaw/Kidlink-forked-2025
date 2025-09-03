import { sql } from "drizzle-orm";
import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { organization } from "./auth.schema";

export const notificationStatusEnum = pgEnum("notification_status", [
  "event",
  "parents meeting",
  "found colection",
  "others",
]);

export const notifications = pgTable("notification", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  organizationId: text("organization_id").references(() => organization.id),
  senderId: text("senderId").notNull(),
  receiverId: text("receiverId").array().notNull(),
  // userId: text("user_id")
  //   .references(() => user.id)
  //   .notNull(),
  topic: text("topic").notNull(),
  description: text("description").notNull(),

  status: notificationStatusEnum("status").default("others").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});
