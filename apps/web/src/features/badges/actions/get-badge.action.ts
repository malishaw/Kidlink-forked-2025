import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export interface FilterParams {
  page?: number;
  limit?: number;
  search?: string | null;
  sort?: "desc" | "asc" | undefined;
}

export const BadgesList = (params: FilterParams) => {
  const { page = 1, limit = 10, search = "", sort = "desc" } = params;

  const query = useQuery({
    queryKey: ["badge", { page, limit, search, sort }],
    queryFn: async () => {
      const rpcClient = await getClient();

      const badgesRes = await rpcClient.api["badges"].$get({
        query: {
          page: page.toString(),
          limit: limit.toString(),
          // search: search || undefined,
          sort: sort || undefined,
        },
      });

      if (!badgesRes.ok) {
        const errorData = await badgesRes.json();
        throw new Error("Failed to fetch badge");
      }

      const badges = await badgesRes.json();

      return badges;
    },
  });

  return query;
};
