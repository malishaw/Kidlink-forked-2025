"use client";

// import UpdateNotificationForm from "@/features/notification/components/update-notification";

import FeedbackForm from "@/features/feedback/components/feedback-form";
import FeedbackList from "@/features/feedback/components/feedback-list";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function Page() {
  const [isFeedbackFormOpen, setIsFeedbackFormOpen] = useState(false);

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen">
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header with Add Feedback Button */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              Feedback Management
            </h1>
            <p className="text-slate-600">
              Manage and review feedback from teachers and parents
            </p>
          </div>
          <button
            onClick={() => setIsFeedbackFormOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            Add New Feedback
          </button>
        </div>

        <FeedbackList />

        {/* Feedback Form Modal */}
        <FeedbackForm
          isOpen={isFeedbackFormOpen}
          onClose={() => setIsFeedbackFormOpen(false)}
        />
      </div>
    </div>
  );
}
