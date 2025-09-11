// Chat type definitions
export type ChatType = "direct" | "group";
export type MessageStatus = "sent" | "delivered" | "read";
export type MessageType = "text" | "image" | "file" | "system";

// WebSocket event types
export interface WebSocketMessage {
  type: string;
  data: Record<string, unknown>;
  timestamp: string;
  userId?: string;
  chatId?: string;
}

// Chat events
export interface ChatMessageEvent extends WebSocketMessage {
  type: "chat_message";
  data: {
    id: string;
    chatId: string;
    senderId: string;
    senderName: string;
    senderAvatar?: string;
    content: string;
    messageType: MessageType;
    replyToId?: string;
    createdAt: string;
  };
}

export interface TypingEvent extends WebSocketMessage {
  type: "typing_start" | "typing_stop";
  data: {
    chatId: string;
    userId: string;
    userName: string;
  };
}

export interface UserOnlineEvent extends WebSocketMessage {
  type: "user_online" | "user_offline";
  data: {
    userId: string;
    userName: string;
    status: "online" | "offline";
  };
}

export interface MessageStatusEvent extends WebSocketMessage {
  type: "message_status";
  data: {
    messageId: string;
    userId: string;
    status: MessageStatus;
  };
}

export interface ChatJoinEvent extends WebSocketMessage {
  type: "chat_join" | "chat_leave";
  data: {
    chatId: string;
    userId: string;
    userName: string;
  };
}

// Union type for all possible WebSocket events
export type WebSocketEvent =
  | ChatMessageEvent
  | TypingEvent
  | UserOnlineEvent
  | MessageStatusEvent
  | ChatJoinEvent;

// Connection info
export interface ConnectionInfo {
  userId: string;
  userName: string;
  userAvatar?: string;
  connectedAt: string;
  chatRooms: Set<string>; // Set of chat IDs user has joined
}

// Chat participant info
export interface ChatParticipant {
  userId: string;
  userName: string;
  userAvatar?: string;
  isAdmin: boolean;
  isOnline: boolean;
  joinedAt: string;
}

// Chat info with participants
export interface ChatInfo {
  id: string;
  name?: string;
  type: ChatType;
  avatar?: string;
  participants: ChatParticipant[];
  lastMessage?: {
    id: string;
    content: string;
    senderId: string;
    senderName: string;
    createdAt: string;
  };
  unreadCount: number;
}
