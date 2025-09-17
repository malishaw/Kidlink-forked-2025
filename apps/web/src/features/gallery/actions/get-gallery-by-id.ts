import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

type Gallery = {
  id: string;
  organizationId: string | null;
  type: string;
  title: string;
  description: string | null;
  images: string[] | null;
  childId: string | null;
  classId: string | null;
  eventId: string | null;
  userId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export const useGetGalleryById = (id: string) => {
  return useQuery({
    queryKey: ["gallery", id],
    queryFn: async () => {
      const rpcClient = await getClient();
      const response = await rpcClient.api.gallery[":id"].$get({
        param: { id },
      });
      if (!response.ok) throw new Error("Failed to fetch gallery");
      const json = await response.json();
      return json as Gallery;
    },
    enabled: !!id,
  });
};
