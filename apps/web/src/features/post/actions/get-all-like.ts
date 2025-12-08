import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export interface FilterParams {
  page?: number;
  limit?: number;
  search?: string | null;
  sort?: "desc" | "asc" | undefined;
}

export const useGetAllLikes = (params: FilterParams) => {
  const { page = 1, limit = 10, search = "", sort = "desc" } = params;

  const query = useQuery({
    queryKey: ["like", { page, limit, search, sort }],
    queryFn: async () => {
      const rpcClient = await getClient();

      const likesRes = await rpcClient.api["like"].$get({
        query: {
          page: page.toString(),
          limit: limit.toString(),
          search: search || undefined,
          sort: sort || undefined,
        },
      });

      if (!likesRes.ok) {
        const errorData = await likesRes.json();
        throw new Error(errorData.message || "Failed to fetch likes");
      }

      const likes = await likesRes.json();
      return likes;
    },
  });

  return query;
};
