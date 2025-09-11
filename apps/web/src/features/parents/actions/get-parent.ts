import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export interface FilterParams {
  page?: number;
  search?: string;
  sort?: string;
}

export const ParentsList = (params: FilterParams) => {
  const { page = 1, search = "", sort = "desc" } = params;

  const query = useQuery({
    queryKey: ["parent", { page, search, sort }],
    queryFn: async () => {
      try {
        const rpcClient = await getClient();

        if (!rpcClient || !rpcClient.api) {
          throw new Error("RPC Client or API is undefined");
        }

        const api: NonNullable<typeof rpcClient.api> = rpcClient.api; // Explicitly typed

        const parentsRes = await api["parent"].$get({
          query: {
            page: page.toString(),
            limit: "1000", // Set a high limit to fetch all parents
            search: search || undefined,
            sort: sort || undefined,
          },
        });

        if (!parentsRes.ok) {
          const errorData = await parentsRes.json();
          console.error("API Error Response:", errorData);
          throw new Error(
            `Failed to fetch parent: ${errorData.message || "Unknown error"}`
          );
        }

        const parents = await parentsRes.json();
        console.log("Fetched Parents Data:", parents);
        return parents;
      } catch (error) {
        console.error("Error in ParentsList queryFn:", error);
        throw error;
      }
    },
  });

  return query;
};
