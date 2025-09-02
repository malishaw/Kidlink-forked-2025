// src/features/nurseries/queries/use-update-nursery.ts
"use client";

import { getClient } from "@/lib/rpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Fields from your `nurseries` table that are client-updatable.
 * Adjust as needed (e.g., omit createdBy/organizationId if server-controlled).
 */
export type NurseryUpdatableFields = {
  title?: string;
  description?: string | null;

  address?: string | null;

  longitude?: number | null;
  latitude?: number | null;

  phoneNumbers?: string[]; // complete replacement (server merges if you prefer)
  logo?: string | null;
  photos?: string[]; // complete replacement
  attachments?: string[]; // complete replacement
};

type Vars = {
  id: string;
  patch: NurseryUpdatableFields; // partial update payload
};

export function useUpdateNursery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, patch }: Vars) => {
      if (!id) throw new Error("Missing nursery id");
      if (!patch || Object.keys(patch).length === 0) {
        throw new Error("Nothing to update");
      }

      const rpc = await getClient();

      // Adjust this to match your API routes (pick one and keep it consistent):
      // - rpc.api.nursery[":id"].$patch({ param: { id }, json: patch })
      // - rpc.api.nursery.$patch({ json: { id, ...patch } })
      // - rpc.api.nursery[":id"].$put({ param: { id }, json: patch })
      const res = await rpc.api.nurseries[":id"].$patch({
        param: { id },
        json: patch,
      });

      if (!res.ok) throw new Error("Failed to update nursery");

      // If your API returns the updated nursery, you could parse it here:
      // const data = await res.json();
      // return data as Nursery;
      return { id, ...patch };
    },

    /**
     * Optimistically update both:
     * - The list cache: ["nurseries"]
     * - The detail cache (if you keep one): ["nursery", id]
     */
    onMutate: async ({ id, patch }) => {
      // Cancel outgoing refetches so they don’t overwrite our optimistic update
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ["nurseries"] }),
        queryClient.cancelQueries({ queryKey: ["nursery", id] }),
      ]);

      // Snapshot previous caches for rollback
      const listSnapshots = queryClient.getQueriesData<any>({
        queryKey: ["nurseries"],
      });
      const detailSnapshot = queryClient.getQueryData<any>(["nursery", id]);

      // Optimistically update list queries
      listSnapshots.forEach(([key, data]) => {
        if (!Array.isArray(data)) return;
        const next = data.map((n) => (n.id === id ? { ...n, ...patch } : n));
        queryClient.setQueryData(key, next);
      });

      // Optimistically update detail query
      if (detailSnapshot) {
        queryClient.setQueryData(["nursery", id], {
          ...detailSnapshot,
          ...patch,
        });
      }

      return { listSnapshots, detailSnapshot, id };
    },

    // Roll back if the mutation fails
    onError: (_err, _vars, ctx) => {
      if (!ctx) return;
      ctx.listSnapshots?.forEach?.(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
      if (ctx.detailSnapshot) {
        queryClient.setQueryData(["nursery", ctx.id], ctx.detailSnapshot);
      }
    },

    // Ensure eventual consistency
    onSettled: (_data, _error, vars) => {
      queryClient.invalidateQueries({ queryKey: ["nurseries"] });
      queryClient.invalidateQueries({ queryKey: ["nursery", vars.id] });
    },
  });
}
