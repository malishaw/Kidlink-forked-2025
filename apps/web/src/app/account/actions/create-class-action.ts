import { getClient } from "@/lib/rpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface Class {
  id: string;
  nurseryId?: string | null;
  name: string;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface CreateClassInput {
  // nurseryId is optional on the client; server will auto-pick if omitted
  nurseryId?: string | null;
  name: string;
}

export const useCreateClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newClass: CreateClassInput) => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.classes.$post({
        json: newClass,
      });

      if (!response.ok) {
        // Try to bubble up the API error message if available
        let msg = "Failed to create class";
        try {
          const err = await response.json();
          if (err?.message) msg = err.message;
        } catch {}
        throw new Error(msg);
      }

      const json = await response.json();
      return json as Class;
    },
    onSuccess: () => {
      // Invalidate cache so `useGetClasses` refetches
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
  });
};
