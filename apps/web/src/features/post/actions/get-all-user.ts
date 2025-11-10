import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export interface FilterParams {
  page?: number;
  limit?: number;
  search?: string | null;
  sort?: "desc" | "asc" | undefined;
}

export const useGetAllUsers = (params: FilterParams) => {
  const { page = 1, limit = 10, search = "", sort = "desc" } = params;

  const query = useQuery({
    queryKey: ["user", { page, limit, search, sort }],
    queryFn: async () => {
      const rpcClient = await getClient();

      const usersRes = await rpcClient.api["user"].$get({
        query: {
          page: page.toString(),
          limit: limit.toString(),
          search: search || undefined,
          sort: sort || undefined,
        },
      });

      if (!usersRes.ok) {
        const errorData = await usersRes.json();
        throw new Error(errorData.message || "Failed to fetch users");
      }

      const users = await usersRes.json();
      return users;
    },
  });

  return query;
};
