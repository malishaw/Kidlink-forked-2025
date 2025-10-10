import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export interface FilterParams {
  page?: number;
  limit?: number;
  search?: string | null;
  sort?: "desc" | "asc" | undefined;
}

export const OrganizationList = (params: FilterParams) => {
  const { page = 1, limit = 10, search = "", sort = "desc" } = params;

  const query = useQuery({
    queryKey: ["organization", { page, limit, search, sort }],
    queryFn: async () => {
      const rpcClient = await getClient();

      const organizationRes = await rpcClient.api["organization"].$get({
        query: {
          page: page.toString(),
          limit: limit.toString(),
          search: search || undefined,
          sort: sort || undefined,
        },
      });

      if (!organizationRes.ok) {
        const errorData = await organizationRes.json();
        throw new Error("Failed to fetch organizations");
      }

      const organizations = await organizationRes.json();

      return organizations;
    },
  });

  return query;
};
