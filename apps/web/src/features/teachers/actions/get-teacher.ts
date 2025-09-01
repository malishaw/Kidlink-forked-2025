import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export interface FilterParams {
  page?: number;
  limit?: number;
  search?: string | null;
  sort?: "desc" | "asc" | undefined;
}

export const TeachersList = (params: FilterParams) => {
  const { page = 1, limit = 10, search = "", sort = "desc" } = params;

  const query = useQuery({
    queryKey: ["teacher", { page, limit, search, sort }],
    queryFn: async () => {
      const rpcClient = await getClient();

      const teachersRes = await rpcClient.api["teacher"].$get({
        query: {
          page: page.toString(),
          limit: limit.toString(),
          // search: search || undefined,
          sort: sort || undefined,
        },
      });

      if (!teachersRes.ok) {
        const errorData = await teachersRes.json();
        throw new Error("Failed to fetch teacher");
      }

      const teachers = await teachersRes.json();

      return teachers;
    },
  });

  return query;
};
