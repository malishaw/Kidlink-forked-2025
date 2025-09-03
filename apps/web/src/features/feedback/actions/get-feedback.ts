import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export interface FilterParams {
  page?: number;
  limit?: number;
  search?: string | null;
  sort?: "desc" | "asc" | undefined;
}

export const useGetFeedbacks = (params: FilterParams) => {
  const { page = 1, limit = 10, search = "", sort = "desc" } = params;

  const query = useQuery({
    queryKey: ["feedback", { page, limit, search, sort }],
    queryFn: async () => {
      const rpcClient = await getClient();

      const feedbacksRes = await rpcClient.api["feedbacks"].$get({
        query: {
          page: page.toString(),
          limit: limit.toString(),
          // search: search || undefined,
          sort: sort || undefined,
        },
      });

      if (!feedbacksRes.ok) {
        const errorData = await feedbacksRes.json();
        throw new Error("Failed to fetch feedback");
      }

      const feedbacks = await feedbacksRes.json();

      return feedbacks;
    },
  });

  return query;
};
