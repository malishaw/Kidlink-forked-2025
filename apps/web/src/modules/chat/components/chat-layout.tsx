"use client";

import { useEffect, useState } from "react";
import {
  useCreateDirectChat,
  useCreateGroupChat,
  useSendMessage
} from "../api/use-chat-mutations";
import { useGetChat } from "../api/use-get-chat";
import { useGetMessages } from "../api/use-get-messages";
import { useListChats } from "../api/use-list-chats";
import { useChatWebSocket } from "../hooks/use-chat-websocket";
import type { Chat } from "../types";
import { ChatSidebar } from "./chat-sidebar";
import { ChatWindow } from "./chat-window";
import { CreateChatDialog } from "./create-chat-dialog";

export const ChatLayout = () => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  // Fetch chats list
  const { data: chatsData, isLoading: chatsLoading } = useListChats();

  // Fetch selected chat details
  const { data: selectedChat } = useGetChat(
    selectedChatId || "",
    !!selectedChatId
  );

  // Fetch messages for selected chat
  const { data: messagesData, isLoading: messagesLoading } = useGetMessages(
    selectedChatId || "",
    { limit: "50" }
  );

  // Send message mutation
  const sendMessageMutation = useSendMessage();
  const createDirectChatMutation = useCreateDirectChat();
  const createGroupChatMutation = useCreateGroupChat();

  // Initialize WebSocket connection
  const {
    isConnected,
    isAuthenticated,
    joinChat,
    leaveChat,
    sendTypingIndicator
  } = useChatWebSocket({
    onMessage: (message) => {
      console.log("Received WebSocket message:", message);
      // Handle different message types
      if (message.type === "typing") {
        const typingMsg = message as any;
        setTypingUsers((prev) => {
          if (typingMsg.data.isTyping) {
            return [
              ...prev.filter((id) => id !== typingMsg.data.userId),
              typingMsg.data.userId
            ];
          } else {
            return prev.filter((id) => id !== typingMsg.data.userId);
          }
        });
      }
    },
    onConnectionChange: (connected) => {
      console.log("WebSocket connection changed:", connected);
    }
  });

  // Join/leave chat rooms when selection changes
  useEffect(() => {
    if (!isAuthenticated) return;

    if (selectedChatId) {
      joinChat(selectedChatId);
    }

    // Cleanup: leave previous chat when switching
    return () => {
      if (selectedChatId) {
        leaveChat(selectedChatId);
      }
    };
  }, [selectedChatId, isAuthenticated, joinChat, leaveChat]);

  const handleChatSelect = (chat: Chat) => {
    if (selectedChatId) {
      leaveChat(selectedChatId);
    }
    setSelectedChatId(chat.id);
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedChatId) return;

    try {
      await sendMessageMutation.mutateAsync({
        chatId: selectedChatId,
        content
      });
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleLoadMore = () => {
    // TODO: Implement pagination for loading more messages
    console.log("Load more messages");
  };

  const handleCreateDirectChat = async (userId: string) => {
    try {
      const result = await createDirectChatMutation.mutateAsync({
        participantId: userId
      });
      setSelectedChatId(result.chatId);
      setShowCreateDialog(false);
    } catch (error) {
      console.error("Failed to create direct chat:", error);
    }
  };

  const handleCreateGroupChat = async (name: string, userIds: string[]) => {
    try {
      const result = await createGroupChatMutation.mutateAsync({
        name,
        participantIds: userIds
      });
      setSelectedChatId(result.chatId);
      setShowCreateDialog(false);
    } catch (error) {
      console.error("Failed to create group chat:", error);
    }
  };

  const handleCreateChat = () => {
    setShowCreateDialog(true);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/3 border-r border-gray-300 bg-white">
        <ChatSidebar
          chats={chatsData?.data || []}
          selectedChatId={selectedChatId}
          onChatSelect={handleChatSelect}
          onCreateChat={handleCreateChat}
          isLoading={chatsLoading}
          isConnected={isConnected}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <ChatWindow
            chat={selectedChat}
            messages={messagesData?.data || []}
            onSendMessage={handleSendMessage}
            onLoadMore={handleLoadMore}
            hasMore={false} // TODO: Implement pagination
            isLoadingMore={false}
            isLoading={messagesLoading}
            currentUserId={undefined} // TODO: Get from auth context
            typingUsers={typingUsers}
            isConnected={isConnected && isAuthenticated}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="text-gray-400 mb-4">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Select a chat to start messaging
              </h3>
              <p className="text-gray-500 mb-4">
                Choose a conversation from the sidebar or create a new one
              </p>
              <button
                onClick={handleCreateChat}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Start New Chat
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Connection Status */}
      <div className="fixed bottom-4 right-4">
        <div
          className={`flex items-center space-x-2 px-3 py-2 rounded-full text-sm ${
            isConnected && isAuthenticated
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              isConnected && isAuthenticated ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span>
            {isConnected && isAuthenticated ? "Connected" : "Disconnected"}
          </span>
        </div>
      </div>

      {/* Create Chat Dialog */}
      <CreateChatDialog
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onCreateDirectChat={handleCreateDirectChat}
        onCreateGroupChat={handleCreateGroupChat}
        isLoading={
          createDirectChatMutation.isPending ||
          createGroupChatMutation.isPending
        }
      />
    </div>
  );
};
