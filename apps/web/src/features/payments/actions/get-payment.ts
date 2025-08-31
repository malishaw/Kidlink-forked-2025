import { getClient } from "@/lib/rpc/client";
import { useQuery } from "@tanstack/react-query";

export interface FilterParams {
  page?: number;
  limit?: number;
  search?: string | null;
  sort?: "desc" | "asc" | undefined;
}

export const PaymentsList = (params: FilterParams) => {
  const { page = 1, limit = 10, search = "", sort = "desc" } = params;

  const query = useQuery({
    queryKey: ["payment", { page, limit, search, sort }],
    queryFn: async () => {
      const rpcClient = await getClient();

      const paymentsRes = await rpcClient.api["payment"].$get({
        query: {
          page: page.toString(),
          limit: limit.toString(),
          // search: search || undefined,
          sort: sort || undefined,
        },
      });

      if (!paymentsRes.ok) {
        const errorData = await paymentsRes.json();
        throw new Error("Failed to fetch payment");
      }

      const payments = await paymentsRes.json();

      return payments;
    },
  });

  return query;
};
