"use client";

import { getPayments } from "@/features/payments/actions/get-payments.action";
import { updatePayment } from "@/features/payments/actions/update-payment.action";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import { Download, Eye, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Payment {
  id: string;
  childId: string;
  amount: string;
  paymentMethod: string;
  slipUrl: string | null;
  status: string;
  paidAt: string | null;
  organizationId: string | null;
  createdAt: string;
  updatedAt: string;
}

interface PaymentsData {
  data: Payment[];
  meta: {
    currentPage: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<Set<string>>(new Set());
  const [selectedSlip, setSelectedSlip] = useState<string | null>(null);
  const [isSlipModalOpen, setIsSlipModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Fetch payments
  const fetchPayments = async (page = 1, status = "all") => {
    try {
      setLoading(true);
      const filters: any = {
        page,
        limit: 10,
      };

      if (status !== "all") {
        filters.status = status;
      }

      const data = await getPayments(filters);
      setPayments(data);
    } catch (error) {
      console.error("Error fetching payments:", error);
      toast.error("Failed to fetch payments");
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchPayments(currentPage, statusFilter);
  }, [currentPage, statusFilter]);

  // Update payment status
  const handleStatusUpdate = async (paymentId: string, newStatus: string) => {
    setUpdatingStatus((prev) => new Set(prev).add(paymentId));

    try {
      // Only send the status field - keep it simple like pending and failed
      const updateData = {
        status: newStatus,
      };

      console.log("Updating payment:", { paymentId, updateData });

      await updatePayment(paymentId, updateData);

      // Update local state - let the backend handle paidAt automatically
      setPayments((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          data: prev.data.map((payment) =>
            payment.id === paymentId
              ? {
                  ...payment,
                  status: newStatus,
                  // Let the backend set paidAt, but update UI optimistically
                  paidAt:
                    newStatus === "completed" ? new Date().toISOString() : null,
                  updatedAt: new Date().toISOString(),
                }
              : payment
          ),
        };
      });

      toast.success("Payment status updated successfully");
    } catch (error) {
      console.error("Error updating payment status:", error);
      console.error("Error details:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update payment status"
      );
    } finally {
      setUpdatingStatus((prev) => {
        const next = new Set(prev);
        next.delete(paymentId);
        return next;
      });
    }
  };

  // Get status badge variant
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "failed":
        return "destructive";
      default:
        return "secondary";
    }
  };

  // View slip
  const handleViewSlip = (slipUrl: string) => {
    setSelectedSlip(slipUrl);
    setIsSlipModalOpen(true);
  };

  // Format currency
  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(parseFloat(amount));
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Payments Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage and track all payment transactions
          </p>
        </div>
        <Button onClick={() => fetchPayments(currentPage, statusFilter)}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      {payments && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">
              Total Payments
            </h3>
            <p className="text-2xl font-bold text-gray-900">
              {payments.meta.totalCount}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Completed</h3>
            <p className="text-2xl font-bold text-green-600">
              {payments.data.filter((p) => p.status === "completed").length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Pending</h3>
            <p className="text-2xl font-bold text-yellow-600">
              {payments.data.filter((p) => p.status === "pending").length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Failed</h3>
            <p className="text-2xl font-bold text-red-600">
              {payments.data.filter((p) => p.status === "failed").length}
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Status:</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Payment ID</TableHead>
              <TableHead>Child ID</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Slip</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Paid At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments?.data.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-mono text-sm">
                  {payment.id}
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {payment.childId}
                </TableCell>
                <TableCell className="font-semibold">
                  {formatCurrency(payment.amount)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {payment.paymentMethod === "cash" && "💵"}
                    {payment.paymentMethod === "card" && "💳"}
                    {payment.paymentMethod === "bank_transfer" && "🏦"}
                    {payment.paymentMethod === "mobile_payment" && "📱"}
                    {payment.paymentMethod === "check" && "📄"}
                    <span className="capitalize">{payment.paymentMethod}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(payment.status)}>
                    {payment.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {payment.slipUrl ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewSlip(payment.slipUrl!)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  ) : (
                    <span className="text-gray-400 text-sm">No slip</span>
                  )}
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {formatDate(payment.createdAt)}
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {payment.paidAt ? formatDate(payment.paidAt) : "-"}
                </TableCell>
                <TableCell>
                  <Select
                    value={payment.status}
                    onValueChange={(value) =>
                      handleStatusUpdate(payment.id, value)
                    }
                    disabled={updatingStatus.has(payment.id)}
                  >
                    <SelectTrigger className="w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {payments?.data.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">No payments found</div>
            <p className="text-gray-500">
              No payment records match your current filters.
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {payments && payments.meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {(currentPage - 1) * payments.meta.limit + 1} to{" "}
            {Math.min(
              currentPage * payments.meta.limit,
              payments.meta.totalCount
            )}{" "}
            of {payments.meta.totalCount} results
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {payments.meta.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(payments.meta.totalPages, prev + 1)
                )
              }
              disabled={currentPage === payments.meta.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Slip Viewer Modal */}
      <Dialog open={isSlipModalOpen} onOpenChange={setIsSlipModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Payment Slip</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center p-4">
            {selectedSlip ? (
              <div className="space-y-4">
                <img
                  src={selectedSlip}
                  alt="Payment slip"
                  className="max-w-full max-h-96 object-contain rounded-lg border"
                />
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = selectedSlip;
                      link.download = "payment-slip.jpg";
                      link.click();
                    }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">No slip available</div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
