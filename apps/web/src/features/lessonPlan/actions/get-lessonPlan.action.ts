import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export interface FilterParams {
  page?: number;
  limit?: number;
  search?: string | null;
  sort?: "desc" | "asc" | undefined;
}

export const LessonPlansList = (params: FilterParams) => {
  const { page = 1, limit = 10, search = "", sort = "desc" } = params;

  const query = useQuery({
    queryKey: ["lessonPlan", { page, limit, search, sort }],
    queryFn: async () => {
      const rpcClient = await getClient();

      const lessonPlansRes: Response = await rpcClient.api["lesson-plans"].$get({
        query: {
          page: page.toString(),
          limit: limit.toString(),
          // search: search || undefined,
          sort: sort || undefined,
        },
      });

      if (!lessonPlansRes.ok) {
        const errorData = await lessonPlansRes.json();
        throw new Error("Failed to fetch lessonPlan");
      }

      const lessonPlans = await lessonPlansRes.json();

      return lessonPlans;
    },
  });

  return query;
};
