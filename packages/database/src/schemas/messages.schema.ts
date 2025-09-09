import { boolean, integer, pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";
import { profile } from "./profile.schema";
import { chat } from "./chats.schema";

export const message = pgTable('message', {
  id: text('id').primaryKey(),
  chatId: text('chat_id').references(() => chat.id).notNull(),
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
