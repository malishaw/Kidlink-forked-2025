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
  return useQuery<{
    data: Nursery[];
    meta: { totalCount: number; limit: number; currentPage: number; totalPages: number };
  }>({
    queryKey: ["nurseries"],
    queryFn: async () => {
      const rpcClient = await getClient();
      const response = await rpcClient.api.nurseries.$get();

      if (!response.ok) {
        throw new Error("Failed to fetch nurseries");
      }

      const json = await response.json();

      // Return the full response with data and meta
      return json;
    },
  });
};
