import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export interface FilterParams {
  page?: number;
  limit?: number;
  search?: string | null;
  sort?: "desc" | "asc" | undefined;
}

export const useGetAllNurseriess = (params: FilterParams) => {
  const { page = 1, limit = 10, search = "", sort = "desc" } = params;

  const query = useQuery({
    queryKey: ["nurseries", { page, limit, search, sort }],
    queryFn: async () => {
      const rpcClient = await getClient();

      const nurseriessRes = await rpcClient.api["nurseries"].$get({
        query: {
          page: page.toString(),
          limit: limit.toString(),
          search: search || undefined,
          sort: sort || undefined,
        },
      });

      if (!nurseriessRes.ok) {
        const errorData = await nurseriessRes.json();
        throw new Error(errorData.message || "Failed to fetch nurseriess");
      }

      const nurseriess = await nurseriessRes.json();
      return nurseriess;
    },
  });

  return query;
};
