import { getClient } from "@/lib/rpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteNursery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const rpcClient = await getClient();
      const response = await rpcClient.api?.nurseries?.[":id"]?.$delete({
        param: { id },
      });

      if (!response?.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete nursery");
      }

      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nurseries"] });
      toast.success("Nursery deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete nursery");
    },
  });
};
