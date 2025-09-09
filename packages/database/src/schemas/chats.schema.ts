import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { profile } from "./profile.schema";

export const chat = pgTable('chat', {
  id: text('id').primaryKey(),
  kind: text('kind').notNull(),      // 'direct' | 'group'
  title: text('title'),
  avatarUrl: text('avatar_url'),
  createdBy: text('created_by').references(() => profile.userId).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
