import { and, count, desc, eq, ilike, or, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import { db } from "@api/db";
import { wsManager } from "@api/lib/websocket-manager";
import { getServer } from "@api/lib/websocket-setup";
import type { AppRouteHandler } from "@api/types";

import {
  chatParticipants,
  chats,
  messages,
  messageStatus,
  user,
  type ChatMessageEvent,
  type MessageType
} from "@repo/database";

import type {
  CreateDirectChatRoute,
  CreateGroupChatRoute,
  DeleteMessageRoute,
  GetChatRoute,
  GetMessagesRoute,
  JoinChatRoute,
  LeaveChatRoute,
  ListChatsRoute,
  SendMessageRoute,
  UpdateMessageRoute
} from "./chat.routes";

/**
 * ================================================================
 * Chat Management Handlers
 * ================================================================
 */

// List all chats for the authenticated user
export const listChatsHandler: AppRouteHandler<ListChatsRoute> = async (c) => {
  const session = c.get("session");
  if (!session) {
    return c.json({ message: "Unauthorized" }, HttpStatusCodes.UNAUTHORIZED);
  }

  const { page = "1", limit = "20", search } = c.req.valid("query");
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
  const offset = (pageNum - 1) * limitNum;

  try {
    // Build the query to get user's chats
    const query = db
      .select({
        chat: chats,
        participant: chatParticipants,
        lastMessage: messages,
        lastMessageSender: {
          id: user.id,
          name: user.name,
          image: user.image
        }
      })
      .from(chats)
      .innerJoin(chatParticipants, eq(chats.id, chatParticipants.chatId))
      .leftJoin(messages, eq(chats.id, messages.chatId))
      .leftJoin(user, eq(messages.senderId, user.id))
      .where(
        and(
          eq(chatParticipants.userId, session.userId),
          eq(chats.isActive, true),
          search ? ilike(chats.name, `%${search}%`) : undefined
        )
      )
      .orderBy(desc(messages.createdAt), desc(chats.updatedAt))
      .limit(limitNum)
      .offset(offset);

    const results = await query;

    // Group by chat and get participants
    const chatMap = new Map();

    for (const result of results) {
      const chatId = result.chat.id;

      if (!chatMap.has(chatId)) {
        // Get all participants for this chat
        const participants = await db
          .select({
            participant: chatParticipants,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              image: user.image
            }
          })
          .from(chatParticipants)
          .innerJoin(user, eq(chatParticipants.userId, user.id))
          .where(eq(chatParticipants.chatId, chatId));

        // Get unread message count
        const unreadCount = await db
          .select({ count: count() })
          .from(messages)
          .leftJoin(
            messageStatus,
            and(
              eq(messages.id, messageStatus.messageId),
              eq(messageStatus.userId, session.userId)
            )
          )
          .where(
            and(
              eq(messages.chatId, chatId),
              eq(messageStatus.status, "delivered") // Messages without read status
            )
          );

        chatMap.set(chatId, {
          ...result.chat,
          participants: participants.map((p) => ({
            ...p.participant,
            user: p.user,
            isOnline: wsManager.isUserOnline(p.user.id)
          })),
          lastMessage: result.lastMessage
            ? {
                ...result.lastMessage,
                sender: result.lastMessageSender
              }
            : null,
          unreadCount: unreadCount[0]?.count || 0
        });
      }
    }

    const chatsArray = Array.from(chatMap.values());

    // Get total count for pagination
    const totalCountQuery = await db
      .select({ count: count() })
      .from(chats)
      .innerJoin(chatParticipants, eq(chats.id, chatParticipants.chatId))
      .where(
        and(
          eq(chatParticipants.userId, session.userId),
          eq(chats.isActive, true),
          search ? ilike(chats.name, `%${search}%`) : undefined
        )
      );

    const totalCount = totalCountQuery[0]?.count || 0;
    const totalPages = Math.ceil(totalCount / limitNum);

    return c.json(
      {
        data: chatsArray,
        meta: {
          currentPage: pageNum,
          limit: limitNum,
          totalCount,
          totalPages
        }
      },
      HttpStatusCodes.OK
    );
  } catch (error) {
    console.error("Error listing chats:", error);
    return c.json(
      { message: "Internal server error" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

// Get a specific chat
export const getChatHandler: AppRouteHandler<GetChatRoute> = async (c) => {
  const session = c.get("session");
  if (!session) {
    return c.json(
      { message: "Unauthorized" },
      HttpStatusCodes.UNAUTHORIZED
    ) as ReturnType<AppRouteHandler<GetChatRoute>>;
  }

  const { id: chatId } = c.req.valid("param");

  try {
    // Check if user is a participant of this chat
    const participation = await db
      .select()
      .from(chatParticipants)
      .where(
        and(
          eq(chatParticipants.chatId, chatId),
          eq(chatParticipants.userId, session.userId)
        )
      )
      .limit(1);

    if (participation.length === 0) {
      return c.json(
        { message: "Chat not found or access denied" },
        HttpStatusCodes.NOT_FOUND
      ) as ReturnType<AppRouteHandler<GetChatRoute>>;
    }

    // Get chat details
    const chat = await db
      .select()
      .from(chats)
      .where(eq(chats.id, chatId))
      .limit(1);

    if (chat.length === 0) {
      return c.json(
        { message: "Chat not found" },
        HttpStatusCodes.NOT_FOUND
      ) as ReturnType<AppRouteHandler<GetChatRoute>>;
    }

    // Get all participants
    const participants = await db
      .select({
        participant: chatParticipants,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image
        }
      })
      .from(chatParticipants)
      .innerJoin(user, eq(chatParticipants.userId, user.id))
      .where(eq(chatParticipants.chatId, chatId));

    // Get last message
    const lastMessage = await db
      .select({
        message: messages,
        sender: {
          id: user.id,
          name: user.name,
          image: user.image
        }
      })
      .from(messages)
      .innerJoin(user, eq(messages.senderId, user.id))
      .where(eq(messages.chatId, chatId))
      .orderBy(desc(messages.createdAt))
      .limit(1);

    // Get unread count
    const unreadCount = await db
      .select({ count: count() })
      .from(messages)
      .leftJoin(
        messageStatus,
        and(
          eq(messages.id, messageStatus.messageId),
          eq(messageStatus.userId, session.userId)
        )
      )
      .where(
        and(eq(messages.chatId, chatId), eq(messageStatus.status, "delivered"))
      );

    const result = {
      ...chat[0],
      participants: participants.map((p) => ({
        ...p.participant,
        user: p.user,
        isOnline: wsManager.isUserOnline(p.user.id)
      })),
      lastMessage: lastMessage[0]
        ? {
            ...lastMessage[0].message,
            sender: lastMessage[0].sender
          }
        : null,
      unreadCount: unreadCount[0]?.count || 0
    };

    return c.json(
      {
        ...result,
        id: result.id!,
        name: result.name || null,
        description: result?.description || null,
        type: result.type as "direct" | "group",
        avatar: result.avatar || null,
        isActive: result.isActive ?? true,
        createdAt: result.createdAt?.toISOString() || new Date().toISOString(),
        updatedAt: result.updatedAt?.toISOString() || null,
        createdBy: result.createdBy!,
        lastMessage: result.lastMessage
          ? {
              ...result.lastMessage,
              id: result.lastMessage.id,
              chatId: result.lastMessage.chatId,
              senderId: result.lastMessage.senderId,
              content: result.lastMessage.content,
              messageType: result.lastMessage.messageType,
              replyToId: result.lastMessage.replyToId,
              isEdited: result.lastMessage.isEdited,
              editedAt: result.lastMessage.editedAt?.toISOString() || null,
              createdAt: result.lastMessage.createdAt.toISOString(),
              updatedAt: result.lastMessage.updatedAt?.toISOString() || null,
              sender: result.lastMessage.sender
            }
          : undefined
      },
      HttpStatusCodes.OK
    );
  } catch (error) {
    console.error("Error getting chat:", error);
    return c.json(
      { message: "Internal server error" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    ) as ReturnType<AppRouteHandler<GetChatRoute>>;
  }
};

// Create a direct chat
export const createDirectChatHandler: AppRouteHandler<
  CreateDirectChatRoute
> = async (c) => {
  const session = c.get("session");
  if (!session) {
    return c.json({ message: "Unauthorized" }, HttpStatusCodes.UNAUTHORIZED);
  }

  const { participantId } = c.req.valid("json");

  try {
    // Check if the other user exists
    const otherUser = await db
      .select({ id: user.id, name: user.name, image: user.image })
      .from(user)
      .where(eq(user.id, participantId))
      .limit(1);

    if (otherUser.length === 0) {
      return c.json({ message: "User not found" }, HttpStatusCodes.NOT_FOUND);
    }

    // Check if a direct chat already exists between these users
    const existingChat = await db
      .select({ chatId: chatParticipants.chatId })
      .from(chatParticipants)
      .innerJoin(chats, eq(chatParticipants.chatId, chats.id))
      .where(
        and(
          eq(chats.type, "direct"),
          or(
            eq(chatParticipants.userId, session.userId),
            eq(chatParticipants.userId, participantId)
          )
        )
      )
      .groupBy(chatParticipants.chatId)
      .having(sql`COUNT(*) = 2`);

    if (existingChat.length > 0) {
      // Return existing chat
      const firstChat = existingChat[0];
      if (!firstChat) {
        return c.json(
          { message: "Error retrieving existing chat" },
          HttpStatusCodes.INTERNAL_SERVER_ERROR
        );
      }
      const chatId = firstChat.chatId;
      return c.json({ chatId, message: "Direct chat already exists" });
    }

    // Create new direct chat
    const newChat = await db
      .insert(chats)
      .values({
        type: "direct",
        isActive: true,
        createdBy: session.userId
      })
      .returning();

    const firstNewChat = newChat[0];
    if (!firstNewChat) {
      return c.json(
        { message: "Failed to create chat" },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      );
    }

    const chatId = firstNewChat.id;

    // Add both participants
    await db.insert(chatParticipants).values([
      {
        chatId,
        userId: session.userId,
        isAdmin: false
      },
      {
        chatId,
        userId: participantId,
        isAdmin: false
      }
    ]);

    return c.json(
      {
        chatId,
        message: "Direct chat created successfully"
      },
      HttpStatusCodes.CREATED
    );
  } catch (error) {
    console.error("Error creating direct chat:", error);
    return c.json(
      { message: "Internal server error" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

// Create a group chat
export const createGroupChatHandler: AppRouteHandler<
  CreateGroupChatRoute
> = async (c) => {
  const session = c.get("session");
  if (!session) {
    return c.json({ message: "Unauthorized" }, HttpStatusCodes.UNAUTHORIZED);
  }

  const { name, description, participantIds } = c.req.valid("json");

  try {
    // Validate that all participants exist
    const users = await db
      .select({ id: user.id })
      .from(user)
      .where(sql`${user.id} = ANY(${participantIds})`);

    if (users.length !== participantIds.length) {
      return c.json(
        { message: "Some participants not found" },
        HttpStatusCodes.BAD_REQUEST
      );
    }

    // Create group chat
    const newChat = await db
      .insert(chats)
      .values({
        name,
        description,
        type: "group",
        isActive: true,
        createdBy: session.userId
      })
      .returning();

    const firstNewChat = newChat[0];
    if (!firstNewChat) {
      return c.json(
        { message: "Failed to create group chat" },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      );
    }

    const chatId = firstNewChat.id;

    // Add creator as admin
    const participantsToInsert = [
      {
        chatId,
        userId: session.userId,
        isAdmin: true
      }
    ];

    // Add other participants
    participantIds.forEach((userId) => {
      if (userId !== session.userId) {
        participantsToInsert.push({
          chatId,
          userId,
          isAdmin: false
        });
      }
    });

    await db.insert(chatParticipants).values(participantsToInsert);

    return c.json(
      {
        chatId,
        message: "Group chat created successfully"
      },
      HttpStatusCodes.CREATED
    );
  } catch (error) {
    console.error("Error creating group chat:", error);
    return c.json(
      { message: "Internal server error" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

/**
 * ================================================================
 * Message Handlers
 * ================================================================
 */

// Get messages for a chat
export const getMessagesHandler: AppRouteHandler<GetMessagesRoute> = async (
  c
) => {
  const session = c.get("session");
  if (!session) {
    return c.json(
      { message: "Unauthorized" },
      HttpStatusCodes.UNAUTHORIZED
    ) as ReturnType<AppRouteHandler<GetMessagesRoute>>;
  }

  const { id: chatId } = c.req.valid("param");
  const { page = "1", limit = "50", before, after } = c.req.valid("query");

  try {
    // Check if user is a participant
    const participation = await db
      .select()
      .from(chatParticipants)
      .where(
        and(
          eq(chatParticipants.chatId, chatId),
          eq(chatParticipants.userId, session.userId)
        )
      )
      .limit(1);

    if (participation.length === 0) {
      return c.json(
        { message: "Chat not found or access denied" },
        HttpStatusCodes.NOT_FOUND
      ) as ReturnType<AppRouteHandler<GetMessagesRoute>>;
    }

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
    const offset = (pageNum - 1) * limitNum;

    // Build query conditions
    const conditions = [eq(messages.chatId, chatId)];

    if (before) {
      const beforeMessage = await db
        .select({ createdAt: messages.createdAt })
        .from(messages)
        .where(eq(messages.id, before))
        .limit(1);

      if (beforeMessage.length > 0 && beforeMessage[0]) {
        conditions.push(
          sql`${messages.createdAt} < ${beforeMessage[0].createdAt}`
        );
      }
    }

    if (after) {
      const afterMessage = await db
        .select({ createdAt: messages.createdAt })
        .from(messages)
        .where(eq(messages.id, after))
        .limit(1);

      if (afterMessage.length > 0 && afterMessage[0]) {
        conditions.push(
          sql`${messages.createdAt} > ${afterMessage[0].createdAt}`
        );
      }
    }

    // Get messages with sender info
    const messageResults = await db
      .select({
        message: messages,
        sender: {
          id: user.id,
          name: user.name,
          image: user.image
        }
      })
      .from(messages)
      .innerJoin(user, eq(messages.senderId, user.id))
      .where(and(...conditions))
      .orderBy(desc(messages.createdAt))
      .limit(limitNum)
      .offset(offset);

    // Get reply information if any
    const messagesWithReplies = await Promise.all(
      messageResults.map(async (result) => {
        let replyTo = null;

        if (result.message.replyToId) {
          const replyResult = await db
            .select({
              message: {
                id: messages.id,
                content: messages.content,
                senderId: messages.senderId
              },
              sender: {
                name: user.name
              }
            })
            .from(messages)
            .innerJoin(user, eq(messages.senderId, user.id))
            .where(eq(messages.id, result.message.replyToId))
            .limit(1);

          if (replyResult.length > 0 && replyResult[0]) {
            replyTo = {
              id: replyResult[0].message.id,
              content: replyResult[0].message.content,
              senderId: replyResult[0].message.senderId,
              sender: replyResult[0].sender
            };
          }
        }

        return {
          id: result.message.id,
          chatId: result.message.chatId,
          senderId: result.message.senderId,
          content: result.message.content,
          messageType: result.message.messageType,
          replyToId: result.message.replyToId,
          isEdited: result.message.isEdited,
          editedAt: result.message.editedAt?.toISOString() || null,
          createdAt: result.message.createdAt.toISOString(),
          updatedAt: result.message.updatedAt?.toISOString() || null,
          sender: result.sender,
          replyTo: replyTo || undefined
        };
      })
    );

    // Get total count
    const totalCountResult = await db
      .select({ count: count() })
      .from(messages)
      .where(eq(messages.chatId, chatId));

    const totalCount = totalCountResult[0]?.count || 0;
    const totalPages = Math.ceil(totalCount / limitNum);

    return c.json(
      {
        data: messagesWithReplies.reverse(), // Reverse to show oldest first
        meta: {
          currentPage: pageNum,
          limit: limitNum,
          totalCount,
          totalPages
        }
      },
      HttpStatusCodes.OK
    );
  } catch (error) {
    console.error("Error getting messages:", error);
    return c.json(
      { message: "Internal server error" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    ) as ReturnType<AppRouteHandler<GetMessagesRoute>>;
  }
};

// Send a message
export const sendMessageHandler: AppRouteHandler<SendMessageRoute> = async (
  c
) => {
  const session = c.get("session");
  if (!session) {
    return c.json({ message: "Unauthorized" }, HttpStatusCodes.UNAUTHORIZED);
  }

  const { id: chatId } = c.req.valid("param");
  const { content, messageType = "text", replyToId } = c.req.valid("json");

  try {
    // Check if user is a participant
    const participation = await db
      .select()
      .from(chatParticipants)
      .where(
        and(
          eq(chatParticipants.chatId, chatId),
          eq(chatParticipants.userId, session.userId)
        )
      )
      .limit(1);

    if (participation.length === 0) {
      return c.json(
        { message: "Chat not found or access denied" },
        HttpStatusCodes.NOT_FOUND
      );
    }

    // Validate reply message if provided
    if (replyToId) {
      const replyMessage = await db
        .select()
        .from(messages)
        .where(and(eq(messages.id, replyToId), eq(messages.chatId, chatId)))
        .limit(1);

      if (replyMessage.length === 0) {
        return c.json(
          { message: "Reply message not found" },
          HttpStatusCodes.BAD_REQUEST
        );
      }
    }

    // Create the message
    const newMessage = await db
      .insert(messages)
      .values({
        chatId,
        senderId: session.userId,
        content,
        messageType: messageType as MessageType,
        replyToId: replyToId || null
      })
      .returning();

    const message = newMessage[0];
    if (!message) {
      return c.json(
        { message: "Failed to create message" },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      );
    }

    // Get sender info for WebSocket broadcast
    const senderInfo = await db
      .select({
        name: user.name,
        image: user.image
      })
      .from(user)
      .where(eq(user.id, session.userId))
      .limit(1);

    // Broadcast message to chat participants via WebSocket
    const wsMessage: ChatMessageEvent = {
      type: "chat_message",
      data: {
        id: message.id,
        chatId,
        senderId: session.userId,
        senderName: senderInfo[0]?.name || "Unknown",
        senderAvatar: senderInfo[0]?.image || undefined,
        content,
        messageType: messageType as MessageType,
        replyToId: replyToId || undefined,
        createdAt: message.createdAt.toISOString()
      },
      timestamp: new Date().toISOString(),
      userId: session.userId,
      chatId
    };

    wsManager.broadcastToChatRoom(chatId, wsMessage, undefined, getServer());

    // Update chat's last activity
    await db
      .update(chats)
      .set({ updatedAt: new Date() })
      .where(eq(chats.id, chatId));

    return c.json(
      {
        id: message.id,
        message: "Message sent successfully"
      },
      HttpStatusCodes.CREATED
    );
  } catch (error) {
    console.error("Error sending message:", error);
    return c.json(
      { message: "Internal server error" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

/**
 * ================================================================
 * Chat Room Management
 * ================================================================
 */

// Join chat room (WebSocket connection)
export const joinChatHandler: AppRouteHandler<JoinChatRoute> = async (c) => {
  const session = c.get("session");
  if (!session) {
    return c.json({ message: "Unauthorized" }, HttpStatusCodes.UNAUTHORIZED);
  }

  const { chatId } = c.req.valid("json");

  try {
    // Check if user is a participant
    const participation = await db
      .select()
      .from(chatParticipants)
      .where(
        and(
          eq(chatParticipants.chatId, chatId),
          eq(chatParticipants.userId, session.userId)
        )
      )
      .limit(1);

    if (participation.length === 0) {
      return c.json(
        { message: "Chat not found or access denied" },
        HttpStatusCodes.NOT_FOUND
      );
    }

    // Join the chat room via WebSocket manager
    wsManager.joinChatRoom(session.userId, chatId);

    return c.json({ message: "Joined chat room successfully" });
  } catch (error) {
    console.error("Error joining chat:", error);
    return c.json(
      { message: "Internal server error" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

// Leave chat room
export const leaveChatHandler: AppRouteHandler<LeaveChatRoute> = async (c) => {
  const session = c.get("session");
  if (!session) {
    return c.json({ message: "Unauthorized" }, HttpStatusCodes.UNAUTHORIZED);
  }

  const { chatId } = c.req.valid("json");

  try {
    // Leave the chat room via WebSocket manager
    wsManager.leaveChatRoom(session.userId, chatId);

    return c.json({ message: "Left chat room successfully" });
  } catch (error) {
    console.error("Error leaving chat:", error);
    return c.json(
      { message: "Internal server error" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

// Update message (edit)
export const updateMessageHandler: AppRouteHandler<UpdateMessageRoute> = async (
  c
) => {
  const session = c.get("session");
  if (!session) {
    return c.json({ message: "Unauthorized" }, HttpStatusCodes.UNAUTHORIZED);
  }

  const { id: messageId } = c.req.valid("param");
  const { content } = c.req.valid("json");

  try {
    // Check if message exists and belongs to the user
    const existingMessage = await db
      .select()
      .from(messages)
      .where(
        and(eq(messages.id, messageId), eq(messages.senderId, session.userId))
      )
      .limit(1);

    if (existingMessage.length === 0) {
      return c.json(
        { message: "Message not found or access denied" },
        HttpStatusCodes.NOT_FOUND
      );
    }

    // Update the message
    await db
      .update(messages)
      .set({
        content,
        isEdited: true,
        editedAt: new Date()
      })
      .where(eq(messages.id, messageId));

    return c.json({ message: "Message updated successfully" });
  } catch (error) {
    console.error("Error updating message:", error);
    return c.json(
      { message: "Internal server error" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

// Delete message
export const deleteMessageHandler: AppRouteHandler<DeleteMessageRoute> = async (
  c
) => {
  const session = c.get("session");
  if (!session) {
    return c.json({ message: "Unauthorized" }, HttpStatusCodes.UNAUTHORIZED);
  }

  const { id: messageId } = c.req.valid("param");

  try {
    // Check if message exists and belongs to the user
    const existingMessage = await db
      .select()
      .from(messages)
      .where(
        and(eq(messages.id, messageId), eq(messages.senderId, session.userId))
      )
      .limit(1);

    if (existingMessage.length === 0) {
      return c.json(
        { message: "Message not found or access denied" },
        HttpStatusCodes.NOT_FOUND
      );
    }

    // Delete the message (this will also cascade delete related message status records)
    await db.delete(messages).where(eq(messages.id, messageId));

    return c.json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    return c.json(
      { message: "Internal server error" },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};
