"use server";

import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export const useGetClassById = (id: string) => {
  const query = useQuery({
    queryKey: ["class", id],
    queryFn: async () => {
      const rpcClient = await getClient();

      const classRes = await rpcClient.api["classes"].$get({
        params: { id },
      });

      if (!classRes.ok) {
        const errorData = await classRes.json();
        throw new Error(errorData.message || "Failed to fetch class details");
      }

      const classData = await classRes.json();
      return classData;
    },
  });

  return query;
};
