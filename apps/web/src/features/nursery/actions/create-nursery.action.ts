import { getClient } from "@/lib/rpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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

export interface CreateNurseryInput {
  title: string;
  description?: string | null;
  address?: string | null;
  longitude?: number | null;
  latitude?: number | null;
  phoneNumbers: string[];
  logo?: string | null;
  photos?: string[];
  attachments?: string[];
}

export const useCreateNursery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newNursery: CreateNurseryInput) => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.nurseries.$post({
        json: newNursery,
      });

      if (!response.ok) throw new Error("Failed to create nursery");

      const json = await response.json();
      return json as Nursery;
    },
    onSuccess: () => {
      // Invalidate cache so `useGetNurseries` refetches
      queryClient.invalidateQueries({ queryKey: ["nurseries"] });
    },
  });
};
