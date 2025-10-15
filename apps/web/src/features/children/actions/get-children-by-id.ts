import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export interface Child {
  id: string;
  name: string;
  organizationId: string | null;
  nurseryId: string | null;
  parentId: string | null;
  classId: string | null;
  badgeId: string | null;
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

export const useGetChildById = (id: string) => {
  return useQuery({
    queryKey: ["child", id],
    queryFn: async () => {
      const rpcClient = await getClient();
      const response = await rpcClient.api.children[":id"].$get({
        param: { id },
      });
      if (!response.ok) throw new Error("Failed to fetch child");
      const json = await response.json();
      return json as Child;
    },
    enabled: !!id,
  });
};

// Server action version for server-side usage
export async function getChildById(id: string): Promise<Child> {
  const rpcClient = await getClient();
  const response = await rpcClient.api.children[":id"].$get({
    param: { id },
  });
  if (!response.ok) throw new Error("Failed to fetch child");
  const json = await response.json();
  return json as Child;
}
