import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export interface FilterParams {
  page?: number;
  limit?: number;
  search?: string | null;
  sort?: "desc" | "asc" | undefined;
}

export const useGetFeedbacksByChildId = (
  childId: string,
  params: FilterParams = {}
) => {
  const { page = 1, limit = 10, search = "", sort = "desc" } = params;

  const query = useQuery({
    queryKey: ["feedback", "child", childId, { page, limit, search, sort }],
    queryFn: async () => {
      const rpcClient = await getClient();

      if (!rpcClient.api) {
        throw new Error("API client not available");
      }

      const feedbacksRes = await rpcClient.api.feedbacks.child[":childId"].$get(
        {
          param: {
            childId: childId,
          },
          query: {
            page: page.toString(),
            limit: limit.toString(),
            // search: search || undefined,
            sort: sort || undefined,
          },
        }
      );

      if (!feedbacksRes.ok) {
        const errorData = await feedbacksRes.json();
        throw new Error("Failed to fetch feedbacks for child");
      }

      const feedbacks = await feedbacksRes.json();

      return feedbacks;
    },
    enabled: !!childId, // Only run query if childId is provided
  });

  return query;
};
