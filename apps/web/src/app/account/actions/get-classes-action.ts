import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export interface Class {
  id: string;
  nurseryId?: string | null;
  name: string;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export const useGetClass = (id: string) => {
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
    enabled: !!id, // only run if id is provided
  });
};
