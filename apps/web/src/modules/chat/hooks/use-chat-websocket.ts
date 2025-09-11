"use client";

import { authClient } from "@/lib/auth-client";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import type {
  WSAuthMessage,
  WSChatMessage,
  WSJoinChatMessage,
  WSLeaveChatMessage,
  WSMessage,
  WSTypingIndicator,
  WSUserStatus
} from "../types";

interface UseWebSocketOptions {
  onMessage?: (message: WSMessage) => void;
  onConnectionChange?: (connected: boolean) => void;
  reconnectInterval?: number;
}

export const useChatWebSocket = (options: UseWebSocketOptions = {}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const ws = useRef<WebSocket | null>(null);
  const queryClient = useQueryClient();
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { onMessage, onConnectionChange, reconnectInterval = 5000 } = options;

  const connect = useCallback(() => {
    try {
      // Use the appropriate WebSocket URL based on environment
      const wsUrl =
        process.env.NODE_ENV === "production"
          ? `wss://${window.location.host}/api/ws`
          : `ws://localhost:3000/api/ws`;

      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
        onConnectionChange?.(true);

        // Authenticate immediately after connection
        authenticate();
      };

      ws.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as WSMessage;

          // Handle authentication response
          if (message.type === "auth_success") {
            setIsAuthenticated(true);
            console.log("WebSocket authenticated successfully");
          } else if (message.type === "auth_error") {
            console.error("WebSocket authentication failed:", message.data);
            setIsAuthenticated(false);
          }

          // Handle chat messages
          if (message.type === "chat_message") {
            const chatMessage = message as WSChatMessage;
            // Invalidate messages query for the specific chat
            queryClient.invalidateQueries({
              queryKey: ["messages", chatMessage.data.chatId]
            });
            // Also invalidate chats to update last message
            queryClient.invalidateQueries({
              queryKey: ["chats"]
            });
          }

          // Handle typing indicators
          if (
            message.type === "typing_start" ||
            message.type === "typing_stop"
          ) {
            // You can use this to show typing indicators in UI
            console.log("Typing indicator:", message.data);
          }

          // Handle user status changes
          if (
            message.type === "user_online" ||
            message.type === "user_offline"
          ) {
            const statusMessage = message as WSUserStatus;
            // Update user online status in cache
            queryClient.invalidateQueries({ queryKey: ["chats"] });
            console.log("User status:", statusMessage.data);
          }

          // Call custom message handler
          onMessage?.(message);
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      };

      ws.current.onclose = (event) => {
        console.log("WebSocket disconnected", event.code, event.reason);
        setIsConnected(false);
        setIsAuthenticated(false);
        onConnectionChange?.(false);

        // Attempt to reconnect if not a clean close
        if (event.code !== 1000) {
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log("Attempting to reconnect...");
            connect();
          }, reconnectInterval);
        }
      };

      ws.current.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    } catch (error) {
      console.error("Failed to connect WebSocket:", error);
    }
  }, [onMessage, onConnectionChange, reconnectInterval, queryClient]);

  const authenticate = async () => {
    const session = authClient.useSession();
    if (!session.data?.user) {
      console.error("No user session available for WebSocket authentication");
      return;
    }

    const authMessage: WSAuthMessage = {
      type: "auth",
      data: {
        userId: session.data.user.id,
        sessionToken: session.data.session.token || ""
      },
      timestamp: new Date().toISOString()
    };

    send(authMessage);
  };

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    if (ws.current) {
      ws.current.close(1000, "Manual disconnect");
      ws.current = null;
    }

    setIsConnected(false);
    setIsAuthenticated(false);
  }, []);

  const send = useCallback((message: WSMessage) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket not connected, cannot send message:", message);
    }
  }, []);

  const joinChat = useCallback(
    (chatId: string) => {
      if (!isAuthenticated) {
        console.warn("WebSocket not authenticated, cannot join chat");
        return;
      }

      const session = authClient.useSession();
      if (!session.data?.user) return;

      const message: WSJoinChatMessage = {
        type: "join_chat",
        data: {
          userId: session.data.user.id,
          chatId
        },
        timestamp: new Date().toISOString()
      };

      send(message);
    },
    [isAuthenticated, send]
  );

  const leaveChat = useCallback(
    (chatId: string) => {
      if (!isAuthenticated) return;

      const session = authClient.useSession();
      if (!session.data?.user) return;

      const message: WSLeaveChatMessage = {
        type: "leave_chat",
        data: {
          userId: session.data.user.id,
          chatId
        },
        timestamp: new Date().toISOString()
      };

      send(message);
    },
    [isAuthenticated, send]
  );

  const sendTypingIndicator = useCallback(
    (chatId: string, isTyping: boolean) => {
      if (!isAuthenticated) return;

      const session = authClient.useSession();
      if (!session.data?.user) return;

      const message: WSTypingIndicator = {
        type: isTyping ? "typing_start" : "typing_stop",
        data: {
          chatId,
          userId: session.data.user.id,
          userName: session.data.user.name
        },
        timestamp: new Date().toISOString()
      };

      send(message);
    },
    [isAuthenticated, send]
  );

  // Initialize connection on mount
  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  // Ping to keep connection alive
  useEffect(() => {
    if (!isConnected) return;

    const pingInterval = setInterval(() => {
      if (ws.current?.readyState === WebSocket.OPEN) {
        send({
          type: "ping",
          data: {},
          timestamp: new Date().toISOString()
        });
      }
    }, 30000); // Ping every 30 seconds

    return () => clearInterval(pingInterval);
  }, [isConnected, send]);

  return {
    isConnected,
    isAuthenticated,
    connect,
    disconnect,
    send,
    joinChat,
    leaveChat,
    sendTypingIndicator
  };
};
