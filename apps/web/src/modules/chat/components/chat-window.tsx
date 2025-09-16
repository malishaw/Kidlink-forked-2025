"use client";

import { format, isToday, isYesterday } from "date-fns";
import { useEffect, useRef, useState } from "react";
import type { Chat, Message } from "../types";

interface ChatWindowProps {
  chat: Chat | null;
  messages: Message[];
  onSendMessage: (content: string) => void;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoadingMore: boolean;
  isLoading: boolean;
  currentUserId?: string;
  typingUsers: string[];
  isConnected: boolean;
}

export const ChatWindow = ({
  chat,
  messages,
  onSendMessage,
  onLoadMore,
  hasMore,
  isLoadingMore,
  isLoading,
  currentUserId,
  typingUsers,
  isConnected
}: ChatWindowProps) => {
  const [messageInput, setMessageInput] = useState("");
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current && messages.length > 0) {
      const container = messagesContainerRef.current;
      if (container) {
        const isNearBottom =
          container.scrollHeight -
            container.scrollTop -
            container.clientHeight <
          100;
        if (isNearBottom) {
          messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  }, [messages]);

  // Handle scroll to show/hide scroll to bottom button
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const isNearBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight <
        100;
      setShowScrollButton(!isNearBottom);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [messageInput]);

  const handleSendMessage = () => {
    const content = messageInput.trim();
    if (!content || !chat) return;

    onSendMessage(content);
    setMessageInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getChatDisplayName = (chat: Chat) => {
    if (chat.name) return chat.name;

    // For direct chats, show the other participant's name
    if (chat.type === "direct") {
      const otherParticipant = chat.participants.find(
        (p) => p.userId !== currentUserId
      );
      return otherParticipant?.user.name || "Unknown User";
    }

    return "Unnamed Chat";
  };

  const getChatAvatar = (chat: Chat) => {
    if (chat.avatar) return chat.avatar;

    // For direct chats, use the other participant's avatar
    if (chat.type === "direct") {
      const otherParticipant = chat.participants.find(
        (p) => p.userId !== currentUserId
      );
      return otherParticipant?.user.image;
    }

    return null;
  };

  const isOtherParticipantOnline = (chat: Chat) => {
    if (chat.type !== "direct") return false;

    const otherParticipant = chat.participants.find(
      (p) => p.userId !== currentUserId
    );
    return otherParticipant?.isOnline || false;
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);

    if (isToday(date)) {
      return format(date, "HH:mm");
    } else if (isYesterday(date)) {
      return `Yesterday ${format(date, "HH:mm")}`;
    } else {
      return format(date, "MMM d, HH:mm");
    }
  };

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {};

    messages.forEach((message) => {
      const date = format(new Date(message.createdAt), "yyyy-MM-dd");
      if (!groups[date]) groups[date] = [];
      groups[date].push(message);
    });

    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  };

  const formatDateSeparator = (dateStr: string) => {
    const date = new Date(dateStr);

    if (isToday(date)) {
      return "Today";
    } else if (isYesterday(date)) {
      return "Yesterday";
    } else {
      return format(date, "MMMM d, yyyy");
    }
  };

  const isConsecutiveMessage = (
    currentMessage: Message,
    previousMessage: Message | undefined
  ) => {
    if (!previousMessage) return false;

    const timeDiff =
      new Date(currentMessage.createdAt).getTime() -
      new Date(previousMessage.createdAt).getTime();
    const fiveMinutes = 5 * 60 * 1000;

    return (
      currentMessage.senderId === previousMessage.senderId &&
      timeDiff < fiveMinutes
    );
  };

  if (!chat) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 text-gray-300">
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
            </svg>
          </div>
          <p className="text-lg font-medium">No chat selected</p>
          <p className="text-sm">
            Choose a chat from the sidebar to start messaging
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-full flex flex-col">
        {/* Header skeleton */}
        <div className="p-4 border-b border-gray-200 flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-300 rounded w-1/3 animate-pulse" />
            <div className="h-3 bg-gray-300 rounded w-1/5 animate-pulse" />
          </div>
        </div>

        {/* Messages skeleton */}
        <div className="flex-1 p-4 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs p-3 rounded-lg ${i % 2 === 0 ? "bg-gray-300" : "bg-gray-200"} animate-pulse`}
              >
                <div className="h-4 bg-gray-400 rounded mb-2" />
                <div className="h-3 bg-gray-400 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          {/* Avatar */}
          {getChatAvatar(chat) ? (
            <img
              src={getChatAvatar(chat)!}
              alt={getChatDisplayName(chat)}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 font-medium">
                {getChatDisplayName(chat)[0]?.toUpperCase()}
              </span>
            </div>
          )}

          {/* Chat Info */}
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900">
              {getChatDisplayName(chat)}
            </h2>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              {chat.type === "direct" && (
                <>
                  <div
                    className={`w-2 h-2 rounded-full ${isOtherParticipantOnline(chat) ? "bg-green-500" : "bg-gray-300"}`}
                  />
                  <span>
                    {isOtherParticipantOnline(chat) ? "Online" : "Offline"}
                  </span>
                </>
              )}
              {chat.type === "group" && (
                <span>{chat.participants.length} members</span>
              )}
              {!isConnected && (
                <>
                  <span>•</span>
                  <span className="text-yellow-600">Disconnected</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {/* Load more button */}
        {hasMore && (
          <div className="text-center">
            <button
              onClick={onLoadMore}
              disabled={isLoadingMore}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              {isLoadingMore ? "Loading..." : "Load more messages"}
            </button>
          </div>
        )}

        {messageGroups.map(([date, dateMessages]) => (
          <div key={date}>
            {/* Date separator */}
            <div className="flex items-center justify-center my-4">
              <div className="bg-gray-100 px-3 py-1 rounded-full text-xs text-gray-600">
                {formatDateSeparator(date)}
              </div>
            </div>

            {/* Messages for this date */}
            <div className="space-y-2">
              {dateMessages.map((message, index) => {
                const isOwn = message.senderId === currentUserId;
                const previousMessage =
                  index > 0 ? dateMessages[index - 1] : undefined;
                const isConsecutive = isConsecutiveMessage(
                  message,
                  previousMessage
                );
                const sender = chat.participants.find(
                  (p) => p.userId === message.senderId
                )?.user;

                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwn ? "justify-end" : "justify-start"} ${
                      isConsecutive ? "mt-1" : "mt-4"
                    }`}
                  >
                    <div
                      className={`max-w-xs md:max-w-md ${isOwn ? "order-2" : "order-1"}`}
                    >
                      {!isOwn && !isConsecutive && chat.type === "group" && (
                        <div className="text-xs text-gray-500 mb-1 ml-3">
                          {sender?.name}
                        </div>
                      )}

                      <div
                        className={`px-4 py-2 rounded-lg ${
                          isOwn
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-900"
                        } ${
                          isConsecutive
                            ? isOwn
                              ? "rounded-tr-sm"
                              : "rounded-tl-sm"
                            : ""
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words">
                          {message.content}
                        </p>
                        <div
                          className={`text-xs mt-1 ${isOwn ? "text-blue-100" : "text-gray-500"}`}
                        >
                          {formatMessageTime(message.createdAt)}
                          {isOwn && <span className="ml-2">✓</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Typing indicators */}
        {typingUsers.length > 0 && (
          <div className="flex justify-start">
            <div className="bg-gray-100 px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-1">
                <div className="text-sm text-gray-600">
                  {typingUsers.length === 1
                    ? `${typingUsers[0]} is typing`
                    : `${typingUsers.length} people are typing`}
                </div>
                <div className="flex space-x-1">
                  <div
                    className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <div
                    className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <div
                    className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <div className="absolute bottom-20 right-8">
          <button
            onClick={scrollToBottom}
            className="p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <textarea
              ref={textareaRef}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none min-h-[48px] max-h-[120px]"
              disabled={!isConnected}
              rows={1}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!messageInput.trim() || !isConnected}
            className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
