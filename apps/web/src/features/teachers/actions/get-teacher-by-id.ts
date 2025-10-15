import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

type Teacher = {
  id: string;
  classId: string | null;
  organizationId: string | null;
  name: string;
  phoneNumber: string;
  email: string;
  address: string;
  updatedAt: string | null;
  createdAt: string | null;
};

export const useGetTeacherById = (id: string) => {
  return useQuery({
    queryKey: ["teacher", id],
    queryFn: async () => {
      const rpcClient = await getClient();
      if (
        !rpcClient ||
        !rpcClient.api ||
        typeof rpcClient.api.teacher !== "object"
      ) {
        throw new Error("RPC client or API is not properly initialized");
      }
      const response = await rpcClient.api.teacher[":id"].$get({
        param: { id },
      });
      if (!response.ok) throw new Error("Failed to fetch teacher");
      const json = await response.json();
      return json as Teacher;
    },
    enabled: !!id,
  });
};
