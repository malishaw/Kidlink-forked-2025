import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export interface FilterParams {
  page?: number;
  limit?: number;
  search?: string | null;
  sort?: "desc" | "asc" | undefined;
}

export const ParentsList = (params: FilterParams) => {
  const { page = 1, limit = 10, search = "", sort = "desc" } = params;

  const query = useQuery({
    queryKey: ["parent", { page, limit, search, sort }],
    queryFn: async () => {
      const rpcClient = await getClient();

      const parentsRes = await rpcClient.api["parent"].$get({
        query: {
          page: page.toString(),
          limit: limit.toString(),
          // search: search || undefined,
          sort: sort || undefined,
        },
      });

      if (!parentsRes.ok) {
        const errorData = await parentsRes.json();
        throw new Error("Failed to fetch parent");
      }

      const parents = await parentsRes.json();

      return parents;
    },
  });

  return query;
};
