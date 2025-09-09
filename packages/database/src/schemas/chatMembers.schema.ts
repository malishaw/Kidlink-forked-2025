import { sql } from "drizzle-orm";
import { boolean, pgTable, text, uniqueIndex } from "drizzle-orm/pg-core";
import { chat } from "./chats.schema";
import { profile } from "./profile.schema";

export const chatMember = pgTable(
  "chat_member",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`), // Auto UUID
    chatId: text("chat_id")
      .references(() => chat.id)
      .notNull(),
    userId: text("user_id")
      .references(() => profile.userId) // Correct reference to profile.userId
      .notNull(),
    role: text("role").default("member").notNull(),
    isMuted: boolean("is_muted").default(false).notNull(),
    isArchived: boolean("is_archived").default(false).notNull(),
    lastReadMessageId: text("last_read_message_id"),
  },
  (t) => [uniqueIndex("chat_member_chat_user_idx").on(t.chatId, t.userId)]
);
