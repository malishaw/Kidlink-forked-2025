import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export interface Nursery {
  id: string;
  organizationId: string;
  createdBy: string;
  title: string;
  description: string | null;
  address: string | null;
  longitude: number | null;
  latitude: number | null;
  phoneNumbers: (string | null)[];
  logo: string | null;
  photos: (string | null)[];
  attachments: (string | null)[];
  createdAt: string;
  updatedAt: string | null;
}

export function useMyNursery() {
  return useQuery<Nursery | null>({
    queryKey: ["my-nursery"],
    queryFn: async () => {
      const rpcClient = await getClient();
      const res = await rpcClient.api.nurseries["my"].$get();

      if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error("Failed to fetch nursery");
      }

      return await res.json();
    },
  });
}
