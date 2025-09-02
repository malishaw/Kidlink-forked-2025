"use client";

import { useGetNotificationsByUserId } from "@/features/notification/actions/get-notification-by-receiver-id";
import { authClient } from "@/lib/auth-client";

export default function NotificationPage() {
  const { data: session } = authClient.useSession();

  // Try different ways to get user ID
  const userId = session?.user?.id;

  console.log("Session object:", session);
  console.log("Extracted User ID:", userId);
  console.log("User ID attempts:", {
    fromUser: session?.user?.id,
  });

  const {
    data: notifications,
    isLoading: notificationsLoading,
    error,
  } = useGetNotificationsByUserId(userId);

  // Remove sessionLoading check since it's not available
  if (!userId) return <div>User not found in session.</div>;
  if (notificationsLoading) return <div>Loading notifications...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return (
    <div>
      <h1>Notifications for {session?.user?.name}</h1>
      {notifications?.data?.length ? (
        <ul>
          {notifications.data.map((notification: any) => (
            <li key={notification.id}>
              <strong>{notification.topic}</strong>: {notification.description}
            </li>
          ))}
        </ul>
      ) : (
        <div>No notifications found.</div>
      )}
    </div>
  );
}
