"use client";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Filter, RefreshCw, Search } from "lucide-react";
import { useState } from "react";
import {
  getPayments,
  type PaymentFilters,
} from "../actions/get-payments.action";
import { PaymentCard } from "./payment-card";

interface Payment {
  id: number;
  childId: string;
  amount: string;
  paymentMethod: string;
  status?: string;
  createdAt?: string;
  description?: string;
}

export function PaymentList() {
  const [filters, setFilters] = useState<PaymentFilters>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [methodFilter, setMethodFilter] = useState("");

  const {
    data: paymentsData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["payments", filters],
    queryFn: () => getPayments(filters),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const payments = paymentsData?.data || [];

  // Filter payments based on search term
  const filteredPayments = payments.filter((payment: Payment) => {
    const matchesSearch = searchTerm
      ? payment.childId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.id.toString().includes(searchTerm) ||
        payment.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    const matchesStatus =
      statusFilter && statusFilter !== "all"
        ? payment.status?.toLowerCase() === statusFilter.toLowerCase()
        : true;

    const matchesMethod =
      methodFilter && methodFilter !== "all"
        ? payment.paymentMethod.toLowerCase() === methodFilter.toLowerCase()
        : true;

    return matchesSearch && matchesStatus && matchesMethod;
  });

  const handleRefresh = () => {
    refetch();
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setMethodFilter("all");
    setFilters({});
  };

  const getUniqueValues = (key: keyof Payment) => {
    const values = payments
      .map((payment: Payment) => payment[key])
      .filter(
        (value: any): value is string =>
          Boolean(value) && typeof value === "string"
      )
      .map((value: string) => value.toLowerCase());
    return Array.from(new Set(values));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading payments...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h3 className="font-semibold text-red-800 mb-2">
            Error Loading Payments
          </h3>
          <p className="text-red-600 mb-4">
            Failed to load payments. Please try again.
          </p>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-200">
        <div className="flex flex-col gap-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search by Child ID, Payment ID, or Payment Method..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-200"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {getUniqueValues("status").map((status) => (
                  <SelectItem key={status as string} value={status as string}>
                    {(status as string).charAt(0).toUpperCase() +
                      (status as string).slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                {getUniqueValues("paymentMethod").map((method) => (
                  <SelectItem key={method as string} value={method as string}>
                    {(method as string).charAt(0).toUpperCase() +
                      (method as string).slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Clear Filters
            </Button>

            <Button
              variant="outline"
              onClick={handleRefresh}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>

          {/* Active Filters Display */}
          {(searchTerm ||
            (statusFilter && statusFilter !== "all") ||
            (methodFilter && methodFilter !== "all")) && (
            <div className="flex flex-wrap gap-2">
              {searchTerm && (
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800"
                >
                  Search: {searchTerm}
                </Badge>
              )}
              {statusFilter && statusFilter !== "all" && (
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800"
                >
                  Status: {statusFilter}
                </Badge>
              )}
              {methodFilter && methodFilter !== "all" && (
                <Badge
                  variant="secondary"
                  className="bg-purple-100 text-purple-800"
                >
                  Method: {methodFilter}
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800">
          Payment Records
        </h3>
        <div className="text-sm text-slate-500">
          Showing {filteredPayments.length} of {payments.length} payments
        </div>
      </div>

      {/* Payment Grid */}
      {filteredPayments.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 max-w-md mx-auto">
            <div className="text-slate-400 text-4xl mb-4">💳</div>
            <h3 className="font-semibold text-slate-800 mb-2">
              No Payments Found
            </h3>
            <p className="text-slate-600">
              {searchTerm ||
              (statusFilter && statusFilter !== "all") ||
              (methodFilter && methodFilter !== "all")
                ? "Try adjusting your search or filters"
                : "No payments have been created yet"}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPayments.map((payment: Payment) => (
            <PaymentCard
              key={payment.id}
              payment={payment}
              onRefresh={handleRefresh}
              onView={(payment) => {
                // Handle view payment details
                console.log("View payment:", payment);
              }}
              onEdit={(payment) => {
                // Handle edit payment
                console.log("Edit payment:", payment);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
