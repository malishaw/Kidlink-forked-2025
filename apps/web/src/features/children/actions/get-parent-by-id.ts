import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

type Parent = {
  id: string;
  organizationId: string | null;
  childId: string | null;
  name: string;
  phoneNumber: string;
  email: string;
  address: string;
  updatedAt: string | null;
  createdAt: string | null;
};

export const useGetParentById = (id: string) => {
  return useQuery({
    queryKey: ["parent", id],
    queryFn: async () => {
      const rpcClient = await getClient();
      const response = await rpcClient.api.parent[":id"].$get({
        param: { id },
      });
      if (!response.ok) throw new Error("Failed to fetch parent");
      const json = await response.json();
      return json as Parent;
    },
    enabled: !!id,
  });
};
