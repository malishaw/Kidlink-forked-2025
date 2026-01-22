import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export const useGetMyNotifications = (userId?: string) => {
  const query = useQuery({
    queryKey: ["my-notifications", userId],
    queryFn: async () => {
      if (!userId) {
        return { data: [] };
      }

      const rpcClient = await getClient();

      // Call the getByUserId endpoint with receiverId query param
      const notificationsRes = await rpcClient.api.notification["by-user"].$get({
        query: {
          receiverId: userId,
        },
      });

      if (!notificationsRes.ok) {
        const errorData = await notificationsRes.json();
        console.error("Failed to fetch notifications:", errorData);
        throw new Error("Failed to fetch notifications");
      }

      const notifications = await notificationsRes.json();
      return { data: notifications || [] };
    },
    enabled: !!userId,
  });

  return query;
};
