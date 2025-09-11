import { db } from "@api/db";
import { createRouter } from "@api/lib/create-app";
import { wsManager } from "@api/lib/websocket-manager";
import { getServer, upgradeWebSocket } from "@api/lib/websocket-setup";
import type { TypingEvent } from "@repo/database";
import { user } from "@repo/database";
import type { ServerWebSocket } from "bun";
import { eq } from "drizzle-orm";

const wsRouter = createRouter();

interface WSMessage {
  type: string;
  data: Record<string, unknown>;
}

// WebSocket endpoint for real-time chat
wsRouter.get(
  "/ws",
  upgradeWebSocket((_c) => {
    return {
      onOpen: (_, ws) => {
        // Get the raw Bun ServerWebSocket for topic subscriptions
        const _rawWs = ws.raw as ServerWebSocket;
        console.log("WebSocket connection opened");
      },

      onMessage: async (event, ws) => {
        try {
          // Get the raw Bun ServerWebSocket
          const rawWs = ws.raw as ServerWebSocket;
          const data = JSON.parse(event.data.toString()) as WSMessage;

          // Handle different message types
          switch (data.type) {
            case "auth":
              await handleAuth(data, rawWs);
              break;

            case "join_chat":
              await handleJoinChat(data, rawWs);
              break;

            case "leave_chat":
              await handleLeaveChat(data, rawWs);
              break;

            case "typing_start":
            case "typing_stop":
              await handleTyping(data as TypingEvent);
              break;

            case "ping":
              // Respond to ping with pong
              rawWs.send(
                JSON.stringify({
                  type: "pong",
                  timestamp: new Date().toISOString()
                })
              );
              break;

            default:
              console.log("Unknown message type:", data.type);
          }
        } catch (error) {
          console.error("Error processing WebSocket message:", error);
          const rawWs = ws.raw as ServerWebSocket;
          rawWs.send(
            JSON.stringify({
              type: "error",
              data: { message: "Invalid message format" },
              timestamp: new Date().toISOString()
            })
          );
        }
      },

      onClose: () => {
        console.log("WebSocket connection closed");

        // Find and remove the connection from wsManager
        for (const [userId] of wsManager.getAllChatRooms()) {
          // Check if this websocket belongs to this user (simplified approach)
          wsManager.removeConnection(userId);
        }
      },

      onError: (event) => {
        console.error("WebSocket error:", event);
      }
    };
  })
);

// Handle user authentication
async function handleAuth(data: WSMessage, ws: ServerWebSocket) {
  try {
    const { userId, sessionToken } = data.data as {
      userId: string;
      sessionToken: string;
    };

    if (!userId || !sessionToken) {
      ws.send(
        JSON.stringify({
          type: "auth_error",
          data: { message: "Missing userId or sessionToken" },
          timestamp: new Date().toISOString()
        })
      );
      return;
    }

    // Verify user exists and get user info
    const userData = await db
      .select({
        id: user.id,
        name: user.name,
        image: user.image
      })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (userData.length === 0) {
      ws.send(
        JSON.stringify({
          type: "auth_error",
          data: { message: "User not found" },
          timestamp: new Date().toISOString()
        })
      );
      return;
    }

    const userInfo = userData[0];
    if (!userInfo) return;

    // Add connection to manager
    wsManager.addConnection(userId, ws, {
      userId,
      userName: userInfo.name,
      userAvatar: userInfo.image || undefined
    });

    // Send authentication success
    ws.send(
      JSON.stringify({
        type: "auth_success",
        data: {
          userId,
          userName: userInfo.name,
          userAvatar: userInfo.image
        },
        timestamp: new Date().toISOString()
      })
    );

    console.log(`User ${userInfo.name} authenticated successfully`);
  } catch (error) {
    console.error("Error in auth handler:", error);
    ws.send(
      JSON.stringify({
        type: "auth_error",
        data: { message: "Authentication failed" },
        timestamp: new Date().toISOString()
      })
    );
  }
}

// Handle joining a chat room
async function handleJoinChat(data: WSMessage, ws: ServerWebSocket) {
  try {
    const { userId, chatId } = data.data as { userId: string; chatId: string };

    if (!userId || !chatId) {
      ws.send(
        JSON.stringify({
          type: "error",
          data: { message: "Missing userId or chatId" },
          timestamp: new Date().toISOString()
        })
      );
      return;
    }

    // Check if user is connected
    if (!wsManager.isUserOnline(userId)) {
      ws.send(
        JSON.stringify({
          type: "error",
          data: { message: "User not authenticated" },
          timestamp: new Date().toISOString()
        })
      );
      return;
    }

    // Join the chat room
    wsManager.joinChatRoom(userId, chatId);

    // Send confirmation
    ws.send(
      JSON.stringify({
        type: "chat_joined",
        data: { chatId },
        timestamp: new Date().toISOString()
      })
    );

    // Send list of online users in this chat
    const onlineUsers = wsManager.getOnlineUsersInChat(chatId);
    ws.send(
      JSON.stringify({
        type: "online_users",
        data: { chatId, onlineUsers },
        timestamp: new Date().toISOString()
      })
    );
  } catch (error) {
    console.error("Error in join chat handler:", error);
    ws.send(
      JSON.stringify({
        type: "error",
        data: { message: "Failed to join chat" },
        timestamp: new Date().toISOString()
      })
    );
  }
}

// Handle leaving a chat room
async function handleLeaveChat(data: WSMessage, ws: ServerWebSocket) {
  try {
    const { userId, chatId } = data.data as { userId: string; chatId: string };

    if (!userId || !chatId) {
      ws.send(
        JSON.stringify({
          type: "error",
          data: { message: "Missing userId or chatId" },
          timestamp: new Date().toISOString()
        })
      );
      return;
    }

    // Leave the chat room
    wsManager.leaveChatRoom(userId, chatId);

    // Send confirmation
    ws.send(
      JSON.stringify({
        type: "chat_left",
        data: { chatId },
        timestamp: new Date().toISOString()
      })
    );
  } catch (error) {
    console.error("Error in leave chat handler:", error);
    ws.send(
      JSON.stringify({
        type: "error",
        data: { message: "Failed to leave chat" },
        timestamp: new Date().toISOString()
      })
    );
  }
}

// Handle typing indicators
async function handleTyping(data: TypingEvent) {
  try {
    const { chatId, userId, userName } = data.data;

    if (!chatId || !userId) {
      return;
    }

    // Check if user is connected and in the chat
    if (!wsManager.isUserOnline(userId)) {
      return;
    }

    // Broadcast typing event to other users in the chat (exclude sender)
    wsManager.broadcastToChatRoom(
      chatId,
      {
        type: data.type,
        data: {
          chatId,
          userId,
          userName
        },
        timestamp: new Date().toISOString()
      },
      userId,
      getServer()
    );
  } catch (error) {
    console.error("Error in typing handler:", error);
  }
}

export default wsRouter;
