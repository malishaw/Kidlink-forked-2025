import { pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";
import { message } from "./messages.schema";
import { profile } from "./profile.schema";

export const receipt = pgTable(
  "receipt",
  {
    messageId: text("message_id")
      .references(() => message.id)
      .notNull(),
    userId: text("user_id")
      .references(() => profile.userId)
      .notNull(),
    deliveredAt: timestamp("delivered_at"),
    readAt: timestamp("read_at"),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.messageId, t.userId] }),
  })
);
