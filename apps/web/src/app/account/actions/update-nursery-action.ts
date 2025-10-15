import { getClient } from "@/lib/rpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Nursery } from "./create-nursery.action";

export interface UpdateNurseryInput {
  id: string; // required for identifying which nursery to update
  title?: string;
  description?: string | null;
  address?: string | null;
  longitude?: number | null;
  latitude?: number | null;
  phoneNumbers?: string[];
  logo?: string | null;
  photos?: string[];
  attachments?: string[];
}

export const useUpdateNursery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updatedNursery: UpdateNurseryInput) => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.nursery[":id"].$put({
        param: { id: updatedNursery.id },
        json: updatedNursery,
      });

      if (!response.ok) throw new Error("Failed to update nursery");

      const json = await response.json();
      return json as Nursery;
    },
    onSuccess: (_data, variables) => {
      // Invalidate cache so details and list are refetched
      queryClient.invalidateQueries({ queryKey: ["nurseries"] });
      queryClient.invalidateQueries({ queryKey: ["nursery", variables.id] });
    },
  });
};
export type { Nursery };
