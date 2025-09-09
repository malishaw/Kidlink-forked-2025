import { boolean, pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";
import { profile } from "./profile.schema";
import { chat } from "./chats.schema";


export const chatMember = pgTable('chat_member', {
  chatId: text('chat_id').references(() => chat.id).notNull(),
  userId: text('user_id').references(() => profile.userId).notNull(),
  role: text('role').default('member').notNull(), // admin | member
  isMuted: boolean('is_muted').default(false).notNull(),
  isArchived: boolean('is_archived').default(false).notNull(),
  lastReadMessageId: text('last_read_message_id'),
},

(t) => {
  return ({
    pk: primaryKey({ columns: [t.chatId, t.userId] }),
  });
});
