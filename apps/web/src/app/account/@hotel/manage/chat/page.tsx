"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent } from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import { ScrollArea } from "@repo/ui/components/scroll-area";
import { cn } from "@repo/ui/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MessageCircle, Search, Send, User, Users } from "lucide-react";
import { useState } from "react";

// Import action files
import { getClient } from "@/lib/rpc/client";

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  type: "teacher" | "parent";
}

interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  participants: User[];
}

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
  sender?: User;
}

export default function ChatPage() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"teachers" | "parents">(
    "teachers"
  );

  // Custom client functions for chat
  const createConversationClient = async (data: {
    title: string;
    isGroup: boolean;
    createdBy: string;
  }) => {
    try {
      const rpcClient = await getClient();
      if (!rpcClient?.api) {
        throw new Error("RPC client not available");
      }
      const response = await (rpcClient.api as any).conversation.$post({
        json: data,
      });
      if (!response.ok) {
        throw new Error("Failed to create conversation");
      }
      return await response.json();
    } catch (error) {
      console.error("Error creating conversation:", error);
      throw error;
    }
  };

  const createMessageClient = async (data: {
    conversationId: string;
    senderId: string;
    content: string;
  }) => {
    try {
      const rpcClient = await getClient();
      if (!rpcClient?.api) {
        throw new Error("RPC client not available");
      }
      const response = await (rpcClient.api as any).messages.$post({
        json: data,
      });
      if (!response.ok) {
        throw new Error("Failed to create message");
      }
      return await response.json();
    } catch (error) {
      console.error("Error creating message:", error);
      throw error;
    }
  };

  const getAllConversationsClient = async () => {
    try {
      const rpcClient = await getClient();
      if (!rpcClient?.api) {
        throw new Error("RPC client not available");
      }
      const response = await (rpcClient.api as any).conversation.$get({
        query: { page: "1", limit: "100", sort: "desc" },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch conversations");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching conversations:", error);
      return { data: [] }; // Return empty array on error
    }
  };

  const getAllMessagesClient = async (conversationId: string) => {
    try {
      const rpcClient = await getClient();
      if (!rpcClient?.api) {
        throw new Error("RPC client not available");
      }
      const response = await (rpcClient.api as any).messages.$get({
        query: {
          page: "1",
          limit: "100",
          sort: "asc",
          conversationId,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching messages:", error);
      return { data: [] }; // Return empty array on error
    }
  };

  // Custom client function to fetch organization members
  const getOrganizationMembers = async () => {
    try {
      const rpcClient = await getClient();
      if (!rpcClient?.api) {
        throw new Error("RPC client not available");
      }
      const response = await (rpcClient.api as any).auth.organization[
        "list-members"
      ].$get();
      if (!response.ok) {
        throw new Error("Failed to fetch organization members");
      }
      const data = await response.json();
      console.log("Organization members response:", data); // Debug log
      return data;
    } catch (error) {
      console.error("Error fetching organization members:", error);
      return { members: [] }; // Return empty members array on error
    }
  };

  const createConversationParticipantClient = async (data: {
    conversationId: string;
    userId: string;
    role: string;
  }) => {
    try {
      const rpcClient = await getClient();
      if (!rpcClient?.api) {
        throw new Error("RPC client not available");
      }
      const response = await (rpcClient.api as any)[
        "conversation-participant"
      ].$post({
        json: data,
      });
      if (!response.ok) {
        throw new Error("Failed to create conversation participant");
      }
      return await response.json();
    } catch (error) {
      console.error("Error creating conversation participant:", error);
      throw error;
    }
  };

  // Fetch organization members
  const { data: membersData, isLoading: membersLoading } = useQuery({
    queryKey: ["organization-members"],
    queryFn: getOrganizationMembers,
  });

  const queryClient = useQueryClient();

  // Fetch conversations (enabled)
  const { data: conversationsData, isLoading: conversationsLoading } = useQuery(
    {
      queryKey: ["conversations"],
      queryFn: getAllConversationsClient,
      enabled: true, // Enabled to fetch existing conversations
    }
  );

  // Fetch messages for selected conversation (enabled)
  const { data: messagesData, isLoading: messagesLoading } = useQuery({
    queryKey: ["messages", selectedConversation?.id],
    queryFn: () =>
      selectedConversation
        ? getAllMessagesClient(selectedConversation.id)
        : null,
    enabled: !!selectedConversation, // Enabled when conversation is selected
  });

  // Create conversation mutation
  const createConversationMutation = useMutation({
    mutationFn: createConversationClient,
    onSuccess: (newConversation: any) => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      setSelectedConversation(newConversation);
    },
  });

  // Create message mutation
  const createMessageMutation = useMutation({
    mutationFn: createMessageClient,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["messages", selectedConversation?.id],
      });
      setMessageInput("");
    },
  });

  // Format users list from organization members
  const allMembers: User[] =
    membersData?.members?.map((member: any) => ({
      id: member.user.id,
      name: member.user.name,
      email: member.user.email,
      role:
        member.role === "teacher"
          ? "Teacher"
          : member.role === "parent"
            ? "Parent"
            : member.role === "owner"
              ? "Owner"
              : "Member", // Handle different roles
      type:
        member.role === "teacher"
          ? "teacher"
          : member.role === "parent"
            ? "parent"
            : "teacher", // Default to teacher for owner and other roles
    })) || [];

  // Debug log to see formatted users
  console.log("Formatted members:", allMembers);

  // Filter members by role (using original lowercase role for filtering)
  const teachers: User[] = allMembers.filter((user) => user.type === "teacher");
  const parents: User[] = allMembers.filter((user) => user.type === "parent");

  // Debug log to see filtered counts
  console.log(
    "Teachers count:",
    teachers.length,
    "Parents count:",
    parents.length
  );

  const allUsers = [...teachers, ...parents];
  const currentUsers = activeTab === "teachers" ? teachers : parents;

  // Filter users based on search
  const filteredUsers = currentUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Start conversation with selected user (enabled with real API calls)
  const startConversation = async (user: User) => {
    try {
      console.log("Starting conversation with:", user);

      // Try to create a real conversation
      const newConversation = await createConversationMutation.mutateAsync({
        title: `Chat with ${user.name}`,
        isGroup: false,
        createdBy: "current-user-id", // TODO: Replace with actual current user ID
      });

      // Add participants to conversation
      await createConversationParticipantClient({
        conversationId: newConversation.id,
        userId: user.id,
        role: "member",
      });

      setSelectedUser(user);
    } catch (error) {
      console.error("Failed to start conversation:", error);

      // Fallback to mock conversation if API fails
      const mockConversation: Conversation = {
        id: `conv_${user.id}`,
        title: `Chat with ${user.name}`,
        createdAt: new Date().toISOString(),
        participants: [user],
      };

      setSelectedConversation(mockConversation);
      setSelectedUser(user);
    }
  };

  // Send message (enabled with real API calls)
  const sendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation) return;

    try {
      console.log("Sending message:", messageInput);

      // Call the real API to send message
      await createMessageMutation.mutateAsync({
        conversationId: selectedConversation.id,
        senderId: "current-user-id", // TODO: Replace with actual current user ID
        content: messageInput,
      });
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar - Users List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Chat
          </h1>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <Button
              variant={activeTab === "teachers" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("teachers")}
              className="flex-1"
            >
              <Users className="h-4 w-4 mr-2" />
              Teachers ({teachers.length})
            </Button>
            <Button
              variant={activeTab === "parents" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("parents")}
              className="flex-1"
            >
              <User className="h-4 w-4 mr-2" />
              Parents ({parents.length})
            </Button>
          </div>
        </div>

        {/* Users List */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {membersLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="flex items-center space-x-3 p-3">
                      <div className="rounded-full bg-gray-200 h-10 w-10" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-1">
                {filteredUsers.map((user) => (
                  <Card
                    key={user.id}
                    className={cn(
                      "cursor-pointer hover:bg-gray-50 transition-colors border-none shadow-none",
                      selectedUser?.id === user.id &&
                        "bg-blue-50 border-blue-200"
                    )}
                    onClick={() => startConversation(user)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                          />
                          <AvatarFallback>
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {user.email}
                          </p>
                          <Badge
                            variant={
                              user.type === "teacher" ? "default" : "secondary"
                            }
                            className="mt-1 text-xs"
                          >
                            {user.role}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {filteredUsers.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No {activeTab} found</p>
                    {searchTerm && (
                      <p className="text-sm">Try adjusting your search</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation && selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser.name}`}
                  />
                  <AvatarFallback>
                    {selectedUser.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {selectedUser.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {selectedUser.role} • {selectedUser.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 bg-gray-50">
              <div className="p-4 space-y-4">
                {messagesLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="flex space-x-3">
                          <div className="rounded-full bg-gray-200 h-8 w-8" />
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4" />
                            <div className="h-3 bg-gray-200 rounded w-1/2" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    {/* Real messages from API */}
                    {messagesData?.data?.length > 0 ? (
                      messagesData.data.map((message: any) => (
                        <div key={message.id} className="flex space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${message.senderId}`}
                            />
                            <AvatarFallback>
                              {message.senderId.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="bg-white rounded-lg p-3 shadow-sm">
                              <p className="text-sm text-gray-900">
                                {message.content}
                              </p>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(message.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      /* Show welcome message if no real messages */
                      <div className="flex space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser?.name}`}
                          />
                          <AvatarFallback>
                            {selectedUser?.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="bg-white rounded-lg p-3 shadow-sm">
                            <p className="text-sm text-gray-900">
                              Hello! This is the start of your conversation with{" "}
                              {selectedUser?.name}. Send a message to begin
                              chatting!
                            </p>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date().toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex space-x-2">
                <Input
                  placeholder={
                    createMessageMutation.isPending
                      ? "Sending..."
                      : "Type your message..."
                  }
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  disabled={createMessageMutation.isPending}
                  className="flex-1"
                />
                <Button
                  onClick={sendMessage}
                  disabled={
                    !messageInput.trim() || createMessageMutation.isPending
                  }
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Select a user to start chatting
              </h3>
              <p className="text-gray-500 max-w-sm">
                Choose a teacher or parent from the sidebar to begin a
                conversation.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
