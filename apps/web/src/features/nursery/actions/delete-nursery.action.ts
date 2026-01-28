import { getClient } from "@/lib/rpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteNursery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!id) throw new Error("Missing nursery id");
      const rpcClient = await getClient();
      const res = await rpcClient.api.nurseries[":id"].$delete({ param: { id } });

      if (res.ok) return id;

      // Try to read body for more context
      let body: string | undefined;
      try {
        // prefer json, fall back to text
        const txt = await res.text();
        body = txt;
      } catch (e) {
        body = undefined;
      }

      throw new Error(
        `Failed to delete nursery (status=${res.status})${body ? `: ${body}` : ""}`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nurseries"] });
    },
  });
};
