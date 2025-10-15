"use client";

import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import type { Chat } from "../types";

interface ChatSidebarProps {
  chats: Chat[];
  selectedChatId: string | null;
  onChatSelect: (chat: Chat) => void;
  onCreateChat: () => void;
  isLoading: boolean;
  isConnected: boolean;
}

export const ChatSidebar = ({
  chats,
  selectedChatId,
  onChatSelect,
  onCreateChat,
  isLoading,
  isConnected
}: ChatSidebarProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredChats = chats.filter((chat) => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();

    // Search in chat name
    if (chat.name?.toLowerCase().includes(searchLower)) return true;

    // Search in participant names for direct chats
    if (chat.type === "direct") {
      return chat.participants.some((p) =>
        p.user.name.toLowerCase().includes(searchLower)
      );
    }

    return false;
  });

  const getChatDisplayName = (chat: Chat) => {
    if (chat.name) return chat.name;

    // For direct chats, show the other participant's name
    if (chat.type === "direct") {
      // TODO: Get current user ID and filter out self
      const otherParticipant = chat.participants[0]; // Simplified for now
      return otherParticipant?.user.name || "Unknown User";
    }

    return "Unnamed Chat";
  };

  const getChatAvatar = (chat: Chat) => {
    if (chat.avatar) return chat.avatar;

    // For direct chats, use the other participant's avatar
    if (chat.type === "direct") {
      const otherParticipant = chat.participants[0]; // Simplified
      return otherParticipant?.user.image;
    }

    return null;
  };

  const getLastMessagePreview = (chat: Chat) => {
    if (!chat.lastMessage) return "No messages yet";

    const content = chat.lastMessage.content;
    return content.length > 50 ? `${content.substring(0, 50)}...` : content;
  };

  const getLastMessageTime = (chat: Chat) => {
    if (!chat.lastMessage) return "";

    return formatDistanceToNow(new Date(chat.lastMessage.createdAt), {
      addSuffix: true
    });
  };

  if (isLoading) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Chats</h2>
            <div className="w-4 h-4 bg-gray-300 rounded animate-pulse" />
          </div>
        </div>
        <div className="flex-1 p-4 space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex items-center space-x-3 p-3 animate-pulse"
            >
              <div className="w-12 h-12 bg-gray-300 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-3/4" />
                <div className="h-3 bg-gray-300 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Chats</h2>
          <button
            onClick={onCreateChat}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            title="Start new chat"
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
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Connection status */}
      {!isConnected && (
        <div className="px-4 py-2 bg-yellow-50 border-b border-yellow-200">
          <div className="flex items-center space-x-2 text-yellow-800 text-sm">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
            <span>Reconnecting...</span>
          </div>
        </div>
      )}

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {searchTerm ? (
              <>
                <div className="mb-2">No chats found</div>
                <div className="text-sm">Try a different search term</div>
              </>
            ) : (
              <>
                <div className="mb-2">No chats yet</div>
                <div className="text-sm">Start a conversation</div>
                <button
                  onClick={onCreateChat}
                  className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  New Chat
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => onChatSelect(chat)}
                className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                  selectedChatId === chat.id
                    ? "bg-blue-50 border-r-2 border-blue-500"
                    : ""
                }`}
              >
                <div className="flex items-center space-x-3">
                  {/* Avatar */}
                  <div className="relative">
                    {getChatAvatar(chat) ? (
                      <img
                        src={getChatAvatar(chat)!}
                        alt={getChatDisplayName(chat)}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 font-medium text-lg">
                          {getChatDisplayName(chat)[0]?.toUpperCase()}
                        </span>
                      </div>
                    )}

                    {/* Online indicator for direct chats */}
                    {chat.type === "direct" &&
                      chat.participants[0]?.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                      )}
                  </div>

                  {/* Chat Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {getChatDisplayName(chat)}
                      </h3>
                      <div className="flex flex-col items-end space-y-1">
                        {chat.lastMessage && (
                          <span className="text-xs text-gray-500">
                            {getLastMessageTime(chat)}
                          </span>
                        )}
                        {chat.unreadCount > 0 && (
                          <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-600 rounded-full">
                            {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-gray-500 truncate mt-1">
                      {getLastMessagePreview(chat)}
                    </p>

                    {/* Chat type indicator */}
                    {chat.type === "group" && (
                      <div className="flex items-center mt-1 space-x-1">
                        <svg
                          className="w-3 h-3 text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                        </svg>
                        <span className="text-xs text-gray-400">
                          {chat.participants.length} members
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
