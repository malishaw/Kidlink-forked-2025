"use client";

import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export function useGetNurseries(params: {
  page?: number;
  limit?: number;
  search?: string;
  sort?: "asc" | "desc";
}) {
  const { page = 1, limit = 10, search = "", sort = "asc" } = params;

  return useQuery({
    queryKey: ["nurseries", { page, limit, search, sort }],
    queryFn: async () => {
      const rpcClient = getClient();
      const response = await rpcClient.api.nursery.$get({
        query: {
          page,
          limit,
          search,
          sort,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch nurseries");
      }

      return response.json();
    },
  });
}
