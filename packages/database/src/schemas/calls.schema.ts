import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { chat } from "./chats.schema";
import { profile } from "./profile.schema";

import cuid from "cuid";
import { sql } from "drizzle-orm";

export const call = pgTable("call", {
 id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`), // Auto-generate UUID in Postgres
  chatId: text("chat_id")
    .references(() => chat.id)
    .notNull(),
  createdBy: text("created_by")
    .references(() => profile.userId)
    .notNull(),
  type: text("type").notNull(), // audio | video
  startedAt: timestamp("started_at"),
  endedAt: timestamp("ended_at"),
});
