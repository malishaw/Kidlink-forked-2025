import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export interface FilterParams {
  page?: number;
  limit?: number;
  search?: string | null;
  sort?: "desc" | "asc" | undefined;
}

export const GalleriesList = (params: FilterParams) => {
  const { page = 1, limit = 10, search = "", sort = "desc" } = params;

  const query = useQuery({
    queryKey: ["gallery", { page, limit, search, sort }],
    queryFn: async () => {
      const rpcClient = await getClient();

      const galleriesRes = await rpcClient.api["gallery"].$get({
        query: {
          page: page.toString(),
          limit: limit.toString(),
          search: search || undefined,
          sort: sort || undefined,
        },
      });

      if (!galleriesRes.ok) {
        const errorData = await galleriesRes.json();
        throw new Error("Failed to fetch galleries");
      }

      const galleries = await galleriesRes.json();

      return galleries;
    },
  });

  return query;
};
