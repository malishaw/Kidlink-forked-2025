import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";
import type { Class } from "../schemas";

export const useGetClassById = (id: string) => {
  return useQuery({
    queryKey: ["class", id],
    queryFn: async () => {
      const rpcClient = await getClient();
      const response = await rpcClient.api.classes[":id"].$get({
        param: { id },
      });
      if (!response.ok) throw new Error("Failed to fetch class");
      const json = await response.json();
      return json as Class;
    },
    enabled: !!id,
  });
};
