import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export const useGetChildById = (id: string) => {
  const query = useQuery({
    queryKey: ["child", id],
    queryFn: async () => {
      const rpcClient = await getClient();

      const childRes = await rpcClient.api["children"].$get({
        params: { id },
      });

      if (!childRes.ok) {
        const errorData = await childRes.json();
        throw new Error(errorData.message || "Failed to fetch child details");
      }

      const childData = await childRes.json();
      return childData;
    },
  });

  return query;
};
