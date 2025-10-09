import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export interface Badge {
  id: string;
  organizationId: string | null;
  childId: string | null;
  teacherId: string | null;
  title: string;
  description: string | null;
  status: string | null;
  badgeType: string | null;
  iconUrl: string | null;
  points: number | null;
  level: string | null;
  awardedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

// React Query hook to fetch a badge by ID
export const useGetBadgeById = (id: string) => {
  return useQuery({
    queryKey: ["badge", id],
    queryFn: async () => {
      const rpcClient = await getClient();
      const response = await rpcClient.api.badges[":id"].$get({
        param: { id },
      });
      if (!response.ok) throw new Error("Failed to fetch badge");
      const json = await response.json();
      return json as Badge;
    },
    enabled: !!id,
  });
};

// Server action version for server-side usage
export async function getBadgeById(id: string): Promise<Badge> {
  const rpcClient = await getClient();
  const response = await rpcClient.api.badges[":id"].$get({
    param: { id },
  });
  if (!response.ok) throw new Error("Failed to fetch badge");
  const json = await response.json();
  return json as Badge;
}
