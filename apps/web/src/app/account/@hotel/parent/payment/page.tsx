"use client";

import { AddNewPayment } from "@/features/payments/components/add-new-payment";
import { PaymentList } from "@/features/payments/components/payment-list";
import { Suspense } from "react";

export default function PaymentsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          {/* Left Side - Title and Description */}
          <div>
            <h1 className="text-4xl font-bold text-slate-800 mb-2">
              Payment Management
            </h1>
            <p className="text-xl text-slate-600">
              Track and manage all payment transactions
            </p>
          </div>

          {/* Right Side - Add Payment Button */}
          <Suspense fallback={<div>Loading...</div>}>
            <AddNewPayment />
          </Suspense>
        </div>

        {/* Payment List Section */}
        <section className="space-y-6">
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                  <p className="text-slate-600 font-medium">
                    Loading payments...
                  </p>
                </div>
              </div>
            }
          >
            <PaymentList />
          </Suspense>
        </section>
      </div>
    </div>
  );
}
