// import { sql } from "drizzle-orm";
// import { boolean, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
// import { timestamps } from "../utils/helpers";
// import { user } from "./auth.schema";

// // Chat types enum
// export const chatTypeEnum = pgEnum("chat_type", ["direct", "group"]);

// // Chat status enum
// export const messageStatusEnum = pgEnum("message_status", [
//   "sent",
//   "delivered",
//   "read"
// ]);

// // Chats table - represents both direct and group chats
// export const chats = pgTable("chats", {
//   id: text("id")
//     .primaryKey()
//     .default(sql`gen_random_uuid()`),
//   name: text("name"), // null for direct chats, set for group chats
//   description: text("description"),
//   type: chatTypeEnum("type").notNull(),
//   avatar: text("avatar"), // group chat avatar
//   isActive: boolean("is_active").default(true).notNull(),
//   createdBy: text("created_by")
//     .references(() => user.id, { onDelete: "cascade" })
//     .notNull(),

//   ...timestamps
// });

// // Chat participants - many-to-many relationship between users and chats
// export const chatParticipants = pgTable("chat_participants", {
//   id: text("id")
//     .primaryKey()
//     .default(sql`gen_random_uuid()`),
//   chatId: text("chat_id")
//     .references(() => chats.id, { onDelete: "cascade" })
//     .notNull(),
//   userId: text("user_id")
//     .references(() => user.id, { onDelete: "cascade" })
//     .notNull(),
//   joinedAt: timestamp("joined_at")
//     .default(sql`NOW()`)
//     .notNull(),
//   isAdmin: boolean("is_admin").default(false).notNull(), // for group chats
//   isMuted: boolean("is_muted").default(false).notNull(),
//   leftAt: timestamp("left_at") // null if still in chat
// });

// // Messages table
// export const messages = pgTable("messages", {
//   id: text("id")
//     .primaryKey()
//     .default(sql`gen_random_uuid()`),
//   chatId: text("chat_id")
//     .references(() => chats.id, { onDelete: "cascade" })
//     .notNull(),
//   senderId: text("sender_id")
//     .references(() => user.id, { onDelete: "cascade" })
//     .notNull(),
//   content: text("content").notNull(),
//   messageType: text("message_type").default("text").notNull(), // text, image, file, etc.
//   replyToId: text("reply_to_id"), // Will be constrained to reference messages.id
//   isEdited: boolean("is_edited").default(false).notNull(),
//   editedAt: timestamp("edited_at"),

//   ...timestamps
// });

// // Message status tracking for read receipts
// export const messageStatus = pgTable("message_read_status", {
//   id: text("id")
//     .primaryKey()
//     .default(sql`gen_random_uuid()`),
//   messageId: text("message_id")
//     .references(() => messages.id, { onDelete: "cascade" })
//     .notNull(),
//   userId: text("user_id")
//     .references(() => user.id, { onDelete: "cascade" })
//     .notNull(),
//   status: messageStatusEnum("status").notNull(),
//   timestamp: timestamp("timestamp")
//     .default(sql`NOW()`)
//     .notNull()
// });

// // Typing indicators
// export const typingIndicators = pgTable("typing_indicators", {
//   id: text("id")
//     .primaryKey()
//     .default(sql`gen_random_uuid()`),
//   chatId: text("chat_id")
//     .references(() => chats.id, { onDelete: "cascade" })
//     .notNull(),
//   userId: text("user_id")
//     .references(() => user.id, { onDelete: "cascade" })
//     .notNull(),
//   startedAt: timestamp("started_at")
//     .default(sql`NOW()`)
//     .notNull(),
//   expiresAt: timestamp("expires_at").notNull() // typing indicators expire after 3-5 seconds
// });
