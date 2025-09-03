// src/features/nurseries/queries/use-get-nurseries.ts
import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export interface Nursery {
  id: string;
  organizationId: string;
  createdBy: string;
  title: string;
  description?: string | null;
  address?: string | null;
  longitude?: number | null;
  latitude?: number | null;
  phoneNumbers: string[];
  logo?: string | null;
  photos: string[];
  attachments: string[];
  createdAt?: string | null;
  updatedAt?: string | null;
}

export const useGetNurseries = () => {
  return useQuery<Nursery[]>({
    queryKey: ["nurseries"],
    queryFn: async () => {
      const rpcClient = await getClient();
      const response = await rpcClient.api.nurseries.$get();

      if (!response.ok) {
        throw new Error("Failed to fetch nurseries");
      }

      const json = await response.json();

      // Normalize to an array (handles list, {data: [...]}, or single object)
      if (Array.isArray(json)) return json as Nursery[];
      if (Array.isArray(json?.data)) return json.data as Nursery[];
      if (json && typeof json === "object") return [json as Nursery];
      return [];
    },
  });
};
