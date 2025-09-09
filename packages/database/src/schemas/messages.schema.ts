import { boolean, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { profile } from "./profile.schema";
import { chat } from "./chats.schema";
import cuid from "cuid";

export const message = pgTable('message', {
id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`), // Auto-generate UUID in Postgres  chatId: text('chat_id').references(() => chat.id).notNull(),
  senderId: text('sender_id').references(() => profile.userId).notNull(),
  type: text('type').notNull(),          // text | image | video | file | audio | voice | system
  text: text('text'),
  mediaUrl: text('media_url'),
  durationMs: integer('duration_ms'),
  replyToMessageId: text('reply_to_message_id'),
  quotedText: text('quoted_text'),
  quotedSenderName: text('quoted_sender_name'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});
