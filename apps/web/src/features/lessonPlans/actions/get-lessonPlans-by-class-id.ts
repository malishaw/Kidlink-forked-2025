import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";
import type { LessonPlan } from "../schemas";

type LessonPlansResponse = {
  data: LessonPlan[];
  meta: {
    currentPage: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
};

export const useGetLessonPlansByClassId = (
  classId: string,
  options?: {
    page?: number;
    limit?: number;
    sort?: "asc" | "desc";
    search?: string;
  }
) => {
  return useQuery({
    queryKey: ["lessonPlans", classId, options],
    queryFn: async () => {
      const rpcClient = await getClient();
      const response = await rpcClient.api["lesson-plans"].class[
        ":classId"
      ].$get({
        param: { classId },
        query: options,
      });
      if (!response.ok) throw new Error("Failed to fetch lesson plans");
      const json = await response.json();
      return json as LessonPlansResponse;
    },
    enabled: !!classId,
  });
};
