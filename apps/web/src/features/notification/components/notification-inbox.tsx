"use client";

import { Badge } from "@repo/ui/components/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Bell, Calendar } from "lucide-react";
import { useEffect, useState } from "react";

import { authClient } from "@/lib/auth-client";
import { useGetMyNotifications } from "../actions/get-my-notifications";

interface Notification {
  id: string;
  senderId: string;
  topic: string;
  description: string;
  status: string;
  createdAt: string;
}

export function NotificationInbox() {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;

  // Fetch notifications for current user using the by-user endpoint
  const { data: notificationsData, isLoading, error } = useGetMyNotifications(userId);

  const [userNotifications, setUserNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (notificationsData?.data && Array.isArray(notificationsData.data)) {
      setUserNotifications(notificationsData.data);
    }
  }, [notificationsData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "event":
        return "bg-blue-100 text-blue-800";
      case "parents meeting":
        return "bg-purple-100 text-purple-800";
      case "found collection":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Unknown date";
    }
  };

  if (isLoading) {
    return (
      <div className="w-full space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Loading notifications...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-800">Failed to load notifications</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-600" />
              <div>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  {userNotifications.length} notification(s)
                </CardDescription>
              </div>
            </div>
            <Badge variant="default">{userNotifications.length}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {userNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="w-12 h-12 text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">No notifications yet</p>
              <p className="text-gray-400 text-sm">
                You'll see notifications here when they're sent
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {[...userNotifications].sort((a,b)=>
                new Date(b.createdAt)-new Date(a.createdAt)
              ).map((notification) => (
                <div
                  key={notification.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">
                          {notification.topic}
                        </h3>
                        <Badge className={getStatusColor(notification.status)}>
                          {notification.status}
                        </Badge>
                      </div>
                      <p className="text-gray-700 text-sm">
                        {notification.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500 pt-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(notification.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
