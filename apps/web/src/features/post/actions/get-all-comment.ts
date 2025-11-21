import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export interface FilterParams {
  page?: number;
  limit?: number;
  search?: string | null;
  sort?: "desc" | "asc" | undefined;
}

export const useGetAllComments = (params: FilterParams) => {
  const { page = 1, limit = 10, search = "", sort = "desc" } = params;

  const query = useQuery({
    queryKey: ["comment", { page, limit, search, sort }],
    queryFn: async () => {
      const rpcClient = await getClient();

      const commentsRes = await rpcClient.api["comment"].$get({
        query: {
          page: page.toString(),
          limit: limit.toString(),
          search: search || undefined,
          sort: sort || undefined,
        },
      });

      if (!commentsRes.ok) {
        const errorData = await commentsRes.json();
        throw new Error(errorData.message || "Failed to fetch comments");
      }

      const comments = await commentsRes.json();
      return comments;
    },
  });

  return query;
};
