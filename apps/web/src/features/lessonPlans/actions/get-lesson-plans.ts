"use client";

import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export interface LessonPlan {
  id: string;
  organizationId: string | null;
  title: string;
  content: string | null;
  teacherId: string | null;
  childId: string | null;
  classId: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface LessonPlansResponse {
  data: LessonPlan[];
  meta: {
    currentPage: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
}

export interface FilterParams {
  page?: number;
  limit?: number;
  search?: string | null;
  sort?: "desc" | "asc" | undefined;
}

export const useGetAllLessonPlans = (params: FilterParams) => {
  const { page = 1, limit = 10, search = "", sort = "desc" } = params;

  const query = useQuery({
    queryKey: ["lesson-plans", { page, limit, search, sort }],
    queryFn: async () => {
      const rpcClient = await getClient();

      const lessonPlansRes = await rpcClient.api!["lesson-plans"].$get({
        query: {
          page: page.toString(),
          limit: limit.toString(),
          search: search || undefined,
          sort: sort || undefined,
        },
      });

      if (!lessonPlansRes.ok) {
        const errorData = await lessonPlansRes.json();
        throw new Error(errorData.message || "Failed to fetch lesson plans");
      }

      const lessonPlans = await lessonPlansRes.json();
      return lessonPlans;
    },
  });

  return query;
};
