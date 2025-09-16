"use client";

import { useGetChildById } from "@/features/children/actions/get-children-by-id";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent, CardHeader } from "@repo/ui/components/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import {
  Calendar,
  CreditCard,
  DollarSign,
  Edit,
  Eye,
  MoreHorizontal,
  Trash2,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { deletePayment } from "../actions/delete-payments.action";

interface Payment {
  id: number;
  childId: string;
  amount: string;
  paymentMethod: string;
  status?: string;
  createdAt?: string;
  description?: string;
}

interface PaymentCardProps {
  payment: Payment;
  onEdit?: (payment: Payment) => void;
  onView?: (payment: Payment) => void;
  onRefresh?: () => void;
}

export function PaymentCard({
  payment,
  onEdit,
  onView,
  onRefresh,
}: PaymentCardProps) {
  // Fetch child data using the childId
  const {
    data: child,
    isLoading: isChildLoading,
    error: childError,
  } = useGetChildById(payment.childId);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this payment?")) {
      try {
        await deletePayment(payment.id);
        toast.success("Payment deleted successfully");
        onRefresh?.();
      } catch (error) {
        console.error("Failed to delete payment:", error);
        toast.error("Failed to delete payment");
      }
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "—";
    }
  };

  const formatAmount = (amount: string) => {
    const num = parseFloat(amount);
    return isNaN(num) ? amount : `$${num.toFixed(2)}`;
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Payment ID #{payment.id}</h3>
              <p className="text-blue-100 text-sm">
                {formatAmount(payment.amount)}
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 rounded-lg"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView?.(payment)}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit?.(payment)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Payment
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Payment
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {/* Payment Details */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <User className="h-4 w-4" />
              <span className="text-xs font-medium">Child</span>
            </div>
            <div className="font-bold text-blue-800 text-sm">
              {isChildLoading ? (
                <span className="text-blue-600">Loading...</span>
              ) : childError ? (
                <span
                  className="text-red-600"
                  title={`Child ID: ${payment.childId}`}
                >
                  Error loading child
                </span>
              ) : child ? (
                <div>
                  <div className="truncate">{child.name}</div>
                  {/* <div className="text-xs text-blue-600 opacity-70">
                    ID: {payment.childId}
                  </div> */}
                </div>
              ) : (
                <span className="text-gray-600">Unknown Child</span>
              )}
            </div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-purple-600 mb-1">
              <DollarSign className="h-4 w-4" />
              <span className="text-xs font-medium">Method</span>
            </div>
            <div className="font-bold text-purple-800 text-sm capitalize">
              {payment.paymentMethod}
            </div>
          </div>
        </div>

        {/* Status and Date */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {payment.status && (
              <Badge className={`text-xs ${getStatusColor(payment.status)}`}>
                {payment.status.charAt(0).toUpperCase() +
                  payment.status.slice(1)}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1 text-slate-500 text-xs">
            <Calendar className="h-3 w-3" />
            {formatDate(payment.createdAt)}
          </div>
        </div>

        {/* Description */}
        {payment.description && (
          <div className="pt-2 border-t border-slate-200">
            <p className="text-xs text-slate-600 line-clamp-2">
              {payment.description}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
