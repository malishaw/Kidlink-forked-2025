import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export interface Child {
  id: string;
  name: string;
  organizationId: string | null;
  nurseryId: string | null;
  parentId: string | null;
  classId: string | null;
  badgeId: string[] | null;
  dateOfBirth: string | null;
  gender: string | null;
  emergencyContact: string | null;
  medicalNotes: string | null;
  profileImageUrl: string | null;
  imagesUrl: string | null;
  activities: string | null;
  createdAt: string;
  updatedAt: string | null;
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

// React Query hook to fetch children by parentId
export const useGetChildrenByParentId = (parentId: string) => {
  return useQuery({
    queryKey: ["children", "parent", parentId],
    queryFn: async () => {
      const rpcClient = await getClient();
      const response = await rpcClient.api.children.parent[":parentId"].$get({
        param: { parentId },
      });
      if (!response.ok)
        throw new Error("Failed to fetch children by parent ID");
      const json = await response.json();
      return json as PaginatedResponse<Child>;
    },
    enabled: !!parentId,
  });
};

// Server action version for server-side usage
export async function getChildrenByParentId(
  parentId: string
): Promise<PaginatedResponse<Child>> {
  const rpcClient = await getClient();
  const response = await rpcClient.api.children.parent[":parentId"].$get({
    param: { parentId },
  });
  if (!response.ok) throw new Error("Failed to fetch children by parent ID");
  const json = await response.json();
  return json as PaginatedResponse<Child>;
}
