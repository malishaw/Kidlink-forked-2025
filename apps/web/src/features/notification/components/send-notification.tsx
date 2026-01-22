"use client";

import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { Textarea } from "@repo/ui/components/textarea";
import { Bell, Send, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { createNotification } from "../actions/create-notification";
import { useGetAllUsers } from "../actions/get-all-user";

type NotificationStatus = "event" | "parents meeting" | "found collection" | "others";

interface UserOption {
  id: string;
  name: string;
  role?: string;
  email?: string;
}

export function SendNotificationForm() {
  const { data: session } = authClient.useSession();
  const [status, setStatus] = useState<NotificationStatus>("others");
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [selectedReceiverIds, setSelectedReceiverIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all users
  const { data: allUsers } = useGetAllUsers({
    page: 1,
    limit: 1000,
    search: "",
    sort: "asc",
  });

  // Exclude admin users from the recipient list
  const users = ((allUsers?.data || []) as UserOption[]).filter((u) =>
    String(u.role || "").toLowerCase() !== "admin"
  );

  const handleAddReceiver = (userId: string) => {
    if (!selectedReceiverIds.includes(userId)) {
      setSelectedReceiverIds([...selectedReceiverIds, userId]);
    }
  };

  const handleRemoveReceiver = (userId: string) => {
    setSelectedReceiverIds(selectedReceiverIds.filter((id) => id !== userId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user?.id) {
      toast.error("Not authenticated");
      return;
    }

    if (!topic.trim()) {
      toast.error("Please enter a topic");
      return;
    }

    if (!description.trim()) {
      toast.error("Please enter a description");
      return;
    }

    if (selectedReceiverIds.length === 0) {
      toast.error("Please select at least one recipient");
      return;
    }

    setIsLoading(true);
    try {
      const result = await createNotification({
        senderId: session.user.id,
        receiverId: selectedReceiverIds,
        topic,
        description,
        status,
      });

      console.log("Notification created:", result);
      toast.success("Notification sent successfully!");
      setTopic("");
      setDescription("");
      setSelectedReceiverIds([]);
      setStatus("others");
    } catch (error) {
      console.error("Failed to send notification:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to send notification";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" />
            <div>
              <CardTitle>Send Notification</CardTitle>
              <CardDescription>
                Send notifications to teachers and parents
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Notification Type */}
            <div className="space-y-2">
              <Label htmlFor="status">Notification Type</Label>
              <Select value={status} onValueChange={(value) => setStatus(value as NotificationStatus)}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="event">Event</SelectItem>
                  <SelectItem value="parents meeting">Parents Meeting</SelectItem>
                  <SelectItem value="found collection">Fund Collection</SelectItem>
                  <SelectItem value="others">Others</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Topic */}
            <div className="space-y-2">
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                placeholder="Enter notification topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter notification description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                required
              />
            </div>

            {/* Recipients Selection */}
            <div className="space-y-4">
              <Label>Select Recipients</Label>
              <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto p-3 border border-gray-200 rounded-lg">
                {users.length === 0 ? (
                  <p className="text-sm text-gray-500 col-span-2">No users available</p>
                ) : (
                  users.map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() =>
                        selectedReceiverIds.includes(user.id)
                          ? handleRemoveReceiver(user.id)
                          : handleAddReceiver(user.id)
                      }
                      className={`p-2 text-left text-sm rounded-lg border-2 transition-all ${
                        selectedReceiverIds.includes(user.id)
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.role}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </button>
                  ))
                )}
              </div>
              {selectedReceiverIds.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>{selectedReceiverIds.length} recipient(s) selected</span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Send className="w-4 h-4 mr-2" />
              {isLoading ? "Sending..." : "Send Notification"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
