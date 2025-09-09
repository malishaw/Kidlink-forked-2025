import { sql } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { profile } from "./profile.schema";

export const chat = pgTable("chat", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`), // Auto-generate UUID in Postgres
  kind: text("kind").notNull(), // 'direct' | 'group'
  title: text("title"),
  avatarUrl: text("avatar_url"),
  createdBy: text("created_by")
    .references(() => profile.userId, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
