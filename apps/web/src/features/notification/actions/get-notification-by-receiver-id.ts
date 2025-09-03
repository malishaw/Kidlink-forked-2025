import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export const useGetNotificationsByUserId = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["notification", "by-user", userId],
    queryFn: async () => {
      if (!userId) {
        throw new Error("User ID is required");
      }
      console.log("Fetching notifications for userId:", userId);
      const rpcClient = await getClient();
      const res = await rpcClient.api.notification["by-user"].$get({
        query: { receiverId: userId },
      });
      console.log("Response status:", res.status);
      if (!res.ok) {
        const errorData = await res.json();
        console.log("Error data:", errorData);
        throw new Error(errorData?.message || "Failed to fetch notifications");
      }
      const data = await res.json();
      console.log("Received data:", data);
      return data;
    },
    enabled: !!userId && userId.trim() !== "",
  });
};
