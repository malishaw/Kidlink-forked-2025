import { getClient } from "@/lib/rpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface Class {
  id: string;
  nurseryId?: string | null;
  name: string;
  mainTeacherId?: string | null;
  teacherIds: string[];
  childIds: string[];
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface CreateClassInput {
  nurseryId?: string | null;
  name: string;
  mainTeacherId?: string | null;
  teacherIds?: string[]; // optional on create
  childIds?: string[]; // optional on create
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
        // Bubble up API error if present
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
      // Invalidate so classes list refetches
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
  });
};
