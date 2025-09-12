"use server";

import { getClient } from "@/lib/rpc/server";

export interface PaymentFilters {
  status?: string;
  childId?: string;
  paymentMethod?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

export async function getPayments(filters: PaymentFilters = {}) {
  try {
    const rpcClient = await getClient();

    const queryParams = new URLSearchParams();

    if (filters.status) queryParams.append("status", filters.status);
    if (filters.childId) queryParams.append("childId", filters.childId);
    if (filters.paymentMethod)
      queryParams.append("paymentMethod", filters.paymentMethod);
    if (filters.startDate)
      queryParams.append("startDate", filters.startDate.toISOString());
    if (filters.endDate)
      queryParams.append("endDate", filters.endDate.toISOString());
    if (filters.page) queryParams.append("page", filters.page.toString());
    if (filters.limit) queryParams.append("limit", filters.limit.toString());

    const response = await (rpcClient as any).api.payment.$get({
      query: Object.fromEntries(queryParams.entries()),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || "Failed to fetch payments");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching payments:", error);
    throw error;
  }
}

export async function getPaymentById(id: string) {
  try {
    const rpcClient = await getClient();

    const response = await (rpcClient as any).api.payment[":id"].$get({
      param: { id },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || "Failed to fetch payment");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching payment:", error);
    throw error;
  }
}

export async function getPaymentStats() {
  try {
    const payments = await getPayments();

    // Calculate stats from the payments data
    // In a real app, you might have a dedicated stats endpoint
    const stats = {
      totalPayments: payments.data?.length || 0,
      totalRevenue: 0,
      pendingPayments: 0,
      completedPayments: 0,
      failedPayments: 0,
      averagePayment: 0,
    };

    if (payments.data && Array.isArray(payments.data)) {
      payments.data.forEach((payment: any) => {
        const amount = parseFloat(payment.amount || 0);
        stats.totalRevenue += amount;

        switch (payment.status) {
          case "pending":
            stats.pendingPayments++;
            break;
          case "completed":
            stats.completedPayments++;
            break;
          case "failed":
            stats.failedPayments++;
            break;
        }
      });

      stats.averagePayment =
        stats.totalPayments > 0 ? stats.totalRevenue / stats.totalPayments : 0;
    }

    return stats;
  } catch (error) {
    console.error("Error calculating payment stats:", error);
    throw error;
  }
}
