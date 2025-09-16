import type { ConnectionInfo, WebSocketMessage } from "@repo/database";
import type { Server, ServerWebSocket } from "bun";

// Global WebSocket connection manager using Bun's WebSocket with topics
class WebSocketManager {
  private connections = new Map<string, ServerWebSocket>(); // userId -> Bun ServerWebSocket
  private userConnections = new Map<string, ConnectionInfo>(); // userId -> connection info
  private chatRooms = new Map<string, Set<string>>(); // chatId -> Set of userIds

  // Add a new connection
  addConnection(
    userId: string,
    ws: ServerWebSocket,
    userInfo: Omit<ConnectionInfo, "chatRooms" | "connectedAt">
  ) {
    this.connections.set(userId, ws);
    this.userConnections.set(userId, {
      ...userInfo,
      connectedAt: new Date().toISOString(),
      chatRooms: new Set<string>()
    });

    // Subscribe to user's personal topic
    ws.subscribe(`user:${userId}`);
    // Subscribe to global topic for broadcast messages
    ws.subscribe("global");

    console.log(`User ${userInfo.userName} (${userId}) connected`);
  }

  // Remove a connection
  removeConnection(userId: string) {
    const userInfo = this.userConnections.get(userId);
    const ws = this.connections.get(userId);

    if (userInfo && ws) {
      // Leave all chat rooms
      userInfo.chatRooms.forEach((chatId) => {
        this.leaveChatRoom(userId, chatId);
      });

      // Unsubscribe from user's personal topic and global topic
      ws.unsubscribe(`user:${userId}`);
      ws.unsubscribe("global");

      // Remove from maps
      this.connections.delete(userId);
      this.userConnections.delete(userId);

      console.log(`User ${userInfo.userName} (${userId}) disconnected`);
    }
  }

  // Join a chat room
  joinChatRoom(userId: string, chatId: string) {
    const userInfo = this.userConnections.get(userId);
    const ws = this.connections.get(userId);

    if (userInfo && ws) {
      // Add user to chat room
      if (!this.chatRooms.has(chatId)) {
        this.chatRooms.set(chatId, new Set());
      }
      this.chatRooms.get(chatId)?.add(userId);

      // Add chat to user's chat rooms
      userInfo.chatRooms.add(chatId);

      // Subscribe to chat topic
      ws.subscribe(`chat:${chatId}`);

      console.log(`User ${userInfo.userName} joined chat ${chatId}`);
    }
  }

  // Leave a chat room
  leaveChatRoom(userId: string, chatId: string) {
    const userInfo = this.userConnections.get(userId);
    const ws = this.connections.get(userId);

    if (userInfo && ws) {
      // Remove user from chat room
      this.chatRooms.get(chatId)?.delete(userId);
      if (this.chatRooms.get(chatId)?.size === 0) {
        this.chatRooms.delete(chatId);
      }

      // Remove chat from user's chat rooms
      userInfo.chatRooms.delete(chatId);

      // Unsubscribe from chat topic
      ws.unsubscribe(`chat:${chatId}`);

      console.log(`User ${userInfo.userName} left chat ${chatId}`);
    }
  }

  // Send message to a specific user
  sendToUser(userId: string, message: WebSocketMessage) {
    const ws = this.connections.get(userId);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  // Broadcast message to all users in a chat room using Bun's publish
  broadcastToChatRoom(
    chatId: string,
    message: WebSocketMessage,
    excludeUserId?: string,
    server?: Server
  ) {
    if (server) {
      // Use Bun's publish to broadcast to all subscribers of the chat topic
      server.publish(`chat:${chatId}`, JSON.stringify(message));
    } else {
      // Fallback: send to individual connections
      const chatUsers = this.chatRooms.get(chatId);
      if (chatUsers) {
        chatUsers.forEach((userId) => {
          if (userId !== excludeUserId) {
            this.sendToUser(userId, message);
          }
        });
      }
    }
  }

  // Broadcast message to all connected users using Bun's publish
  broadcastToAll(
    message: WebSocketMessage,
    excludeUserId?: string,
    server?: Server
  ) {
    if (server) {
      // Publish to a global topic that all users subscribe to
      server.publish("global", JSON.stringify(message));
    } else {
      // Fallback: send to individual connections
      this.connections.forEach((ws, userId) => {
        if (userId !== excludeUserId) {
          this.sendToUser(userId, message);
        }
      });
    }
  }

  // Get online users in a specific chat
  getOnlineUsersInChat(chatId: string): string[] {
    const chatUsers = this.chatRooms.get(chatId);
    return chatUsers ? Array.from(chatUsers) : [];
  }

  // Check if user is online
  isUserOnline(userId: string): boolean {
    return this.connections.has(userId);
  }

  // Get all connected users
  getConnectedUsers(): ConnectionInfo[] {
    return Array.from(this.userConnections.values());
  }

  // Get connection info for a user
  getUserConnectionInfo(userId: string): ConnectionInfo | undefined {
    return this.userConnections.get(userId);
  }

  // Get total number of connections
  getConnectionCount(): number {
    return this.connections.size;
  }

  // Get all chat rooms with their users
  getAllChatRooms(): Map<string, Set<string>> {
    return new Map(this.chatRooms);
  }
}

// Export singleton instance
export const wsManager = new WebSocketManager();
