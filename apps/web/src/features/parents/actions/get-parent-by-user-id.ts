import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export interface Parent {
  id: string;
  organizationId: string | null;
  userId: string | null;
  childId: string[] | null;
  name: string;
  phoneNumber: string;
  email: string;
  address: string;
  updatedAt: string | null;
  createdAt: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    currentPage: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
}

// React Query hook to fetch parents by userId
export const useGetParentByUserId = (userId: string) => {
  return useQuery({
    queryKey: ["parent", "user", userId],
    queryFn: async () => {
      const rpcClient = await getClient();
      const response = await rpcClient.api.parent.user[":userId"].$get({
        param: { userId },
      });
      if (!response.ok) throw new Error("Failed to fetch parent by user ID");
      const json = await response.json();
      return json as PaginatedResponse<Parent>;
    },
    enabled: !!userId,
  });
};

// Server action version for server-side usage
export async function getParentByUserId(
  userId: string
): Promise<PaginatedResponse<Parent>> {
  const rpcClient = await getClient();
  const response = await rpcClient.api.parent.user[":userId"].$get({
    param: { userId },
  });
  if (!response.ok) throw new Error("Failed to fetch parent by user ID");
  const json = await response.json();
  return json as PaginatedResponse<Parent>;
}
