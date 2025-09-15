"use client";

import { useEffect, useState } from "react";

// These would typically come from your user API
interface User {
  id: string;
  name: string;
  image?: string;
  email?: string;
  isOnline?: boolean;
}

interface CreateChatDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateDirectChat: (userId: string) => void;
  onCreateGroupChat: (name: string, userIds: string[]) => void;
  currentUserId?: string;
  isLoading?: boolean;
}

export const CreateChatDialog = ({
  isOpen,
  onClose,
  onCreateDirectChat,
  onCreateGroupChat,
  currentUserId,
  isLoading = false
}: CreateChatDialogProps) => {
  const [chatType, setChatType] = useState<"direct" | "group">("direct");
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  // Mock users data - replace with actual API call
  useEffect(() => {
    if (isOpen) {
      setIsLoadingUsers(true);
      // Simulate API call
      setTimeout(() => {
        const mockUsers: User[] = [
          {
            id: "1",
            name: "John Doe",
            email: "john@example.com",
            isOnline: true
          },
          {
            id: "2",
            name: "Jane Smith",
            email: "jane@example.com",
            isOnline: false
          },
          {
            id: "3",
            name: "Bob Johnson",
            email: "bob@example.com",
            isOnline: true
          },
          {
            id: "4",
            name: "Alice Brown",
            email: "alice@example.com",
            isOnline: true
          }
        ].filter((user) => user.id !== currentUserId);

        setUsers(mockUsers);
        setIsLoadingUsers(false);
      }, 500);
    }
  }, [isOpen, currentUserId]);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserToggle = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCreate = () => {
    if (chatType === "direct" && selectedUsers.length === 1) {
      const userId = selectedUsers[0];
      if (userId) {
        onCreateDirectChat(userId);
      }
    } else if (
      chatType === "group" &&
      selectedUsers.length > 0 &&
      groupName.trim()
    ) {
      onCreateGroupChat(groupName.trim(), selectedUsers);
    }
    handleClose();
  };

  const handleClose = () => {
    setChatType("direct");
    setGroupName("");
    setSelectedUsers([]);
    setSearchTerm("");
    onClose();
  };

  const canCreate =
    (chatType === "direct" && selectedUsers.length === 1) ||
    (chatType === "group" && selectedUsers.length > 0 && groupName.trim());

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Start New Chat
            </h2>
            <button
              onClick={handleClose}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Chat type selector */}
          <div className="mt-4 flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="direct"
                checked={chatType === "direct"}
                onChange={(e) => setChatType(e.target.value as "direct")}
                className="mr-2 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Direct Message
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="group"
                checked={chatType === "group"}
                onChange={(e) => setChatType(e.target.value as "group")}
                className="mr-2 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Group Chat
              </span>
            </label>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Group name input (for group chats) */}
          {chatType === "group" && (
            <div className="p-4 border-b border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Group Name
              </label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Enter group name..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          {/* Search */}
          <div className="p-4 border-b border-gray-200">
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
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* User list */}
          <div className="flex-1 overflow-y-auto">
            {isLoadingUsers ? (
              <div className="p-4 space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center space-x-3 p-3 animate-pulse"
                  >
                    <div className="w-10 h-10 bg-gray-300 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-300 rounded w-3/4" />
                      <div className="h-3 bg-gray-300 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredUsers.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <div className="mb-2">No users found</div>
                    <div className="text-sm">Try a different search term</div>
                  </div>
                ) : (
                  filteredUsers.map((user) => (
                    <label
                      key={user.id}
                      className="flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <input
                        type={chatType === "direct" ? "radio" : "checkbox"}
                        name={
                          chatType === "direct" ? "selected-user" : undefined
                        }
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleUserToggle(user.id)}
                        className="mr-3 text-blue-600 focus:ring-blue-500"
                      />

                      <div className="flex items-center space-x-3">
                        {/* Avatar */}
                        <div className="relative">
                          {user.image ? (
                            <img
                              src={user.image}
                              alt={user.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                              <span className="text-gray-600 font-medium text-sm">
                                {user.name[0]?.toUpperCase()}
                              </span>
                            </div>
                          )}

                          {/* Online indicator */}
                          {user.isOnline && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                          )}
                        </div>

                        {/* User info */}
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                          {user.email && (
                            <div className="text-xs text-gray-500">
                              {user.email}
                            </div>
                          )}
                        </div>

                        {/* Status */}
                        <div className="text-xs text-gray-400">
                          {user.isOnline ? "Online" : "Offline"}
                        </div>
                      </div>
                    </label>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {chatType === "direct"
                ? selectedUsers.length === 0
                  ? "Select a user"
                  : "1 user selected"
                : `${selectedUsers.length} user${selectedUsers.length !== 1 ? "s" : ""} selected`}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!canCreate || isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                {isLoading ? "Creating..." : "Create Chat"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
