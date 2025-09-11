import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export interface FilterParams {
  page?: number;
  limit?: number;
  search?: string | null;
  sort?: "desc" | "asc" | undefined;
  organizationId?: string | null; // Added organizationId for filtering
}

export const BadgesList = (params: FilterParams) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    sort = "desc",
    organizationId = null,
  } = params;

  const query = useQuery({
    queryKey: ["badge", { page, limit, search, sort, organizationId }],
    queryFn: async () => {
      const rpcClient = await getClient();

      const badgesRes = await rpcClient.api["badges"].$get({
        query: {
          page: page.toString(),
          limit: limit.toString(),
          search: search || undefined,
          sort: sort || undefined,
          organizationId: organizationId || undefined, // Pass organizationId as a query parameter
        },
      });

      if (!badgesRes.ok) {
        const errorData = await badgesRes.json();
        throw new Error("Failed to fetch badges");
      }

      const badges = await badgesRes.json();

      return badges;
    },
  });

  return query;
};
