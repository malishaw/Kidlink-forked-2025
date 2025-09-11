import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export interface ClassFilterParams {
  page?: number;
  limit?: number;
  search?: string | null;
  sort?: "desc" | "asc" | undefined;
}

export const ClassesList = (params: ClassFilterParams) => {
  const { page = 1, limit = 10, search = "", sort = "desc" } = params;

  const query = useQuery({
    queryKey: ["classes", { page, limit, search, sort }],
    queryFn: async () => {
      const rpcClient = await getClient();

      const classesRes = await rpcClient.api["classes"].$get({
        query: {
          page: page.toString(),
          limit: limit.toString(),
          // search: search || undefined,
          sort: sort || undefined,
        },
      });

      if (!classesRes.ok) {
        const errorData = await classesRes.json();
        throw new Error("Failed to fetch classes");
      }

      const classes = await classesRes.json();
      return classes;
    },
  });

  return query;
};
