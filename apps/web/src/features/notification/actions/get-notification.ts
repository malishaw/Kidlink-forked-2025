import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export interface FilterParams {
  page?: number;
  limit?: number;
  search?: string | null;
  sort?: "desc" | "asc" | undefined;
}

export const useGetNotifications = (params: FilterParams) => {
  const { page = 1, limit = 10, search = "", sort = "desc" } = params;

  const query = useQuery({
    queryKey: ["notification", { page, limit, search, sort }],
    queryFn: async () => {
      const rpcClient = await getClient();

      const notificationsRes = await rpcClient.api["notification"].$get({
        query: {
          page: page.toString(),
          limit: limit.toString(),
          // search: search || undefined,
          sort: sort || undefined,
        },
      });

      if (!notificationsRes.ok) {
        const errorData = await notificationsRes.json();
        throw new Error("Failed to fetch notification");
      }

      const notifications = await notificationsRes.json();

      return notifications;
    },
  });

  return query;
};
