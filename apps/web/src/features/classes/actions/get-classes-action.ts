import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export interface Class {
  id: string;
  nurseryId?: string | null;
  name: string;
  mainTeacherId?: string | null;
  teacherIds?: string[]; // server may omit; default to []
  childIds?: string[]; // server may omit; default to []
  createdAt?: string | null;
  updatedAt?: string | null;
}

export const useGetClass = (id: string) => {
  return useQuery({
    queryKey: ["class", id],
    queryFn: async () => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.classes.$get({
        param: { id },
      });

      if (!response.ok) throw new Error("Failed to fetch class");

      const json = (await response.json()) as Class;

      // Normalize arrays so the UI can safely map them
      return {
        ...json,
        teacherIds: json.teacherIds ?? [],
        childIds: json.childIds ?? [],
      } satisfies Class;
    },
    enabled: !!id, // only run if id is provided
  });
};
