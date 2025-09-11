import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export interface FilterParams {
  page?: number;
  limit?: number;
  search?: string | null;
  sort?: "desc" | "asc" | undefined;
}

export const ChildrensList = (params: FilterParams) => {
  const { page = 1, limit = 10, search = "", sort = "desc" } = params;

  const query = useQuery({
    queryKey: ["classes", { page, limit, search, sort }],
    queryFn: async () => {
      const rpcClient = await getClient();

      const childrensRes = await rpcClient.api["classes"].$get({
        query: {
          page: page.toString(),
          limit: limit.toString(),
          // search: search || undefined,
          sort: sort || undefined,
        },
      });

      if (!childrensRes.ok) {
        const errorData = await childrensRes.json();
        throw new Error("Failed to fetch classes");
      }

      const childrens = await childrensRes.json();

      return childrens;
    },
  });

  return query;
};
