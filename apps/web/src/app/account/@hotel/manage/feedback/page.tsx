// import UpdateNotificationForm from "@/features/notification/components/update-notification";

import FeedbackForm from "@/features/feedback/components/feedback-form";
import FeedbackList from "@/features/feedback/components/feedback-list";

export default function Page() {
  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen">
      <div className="space-y-6 max-w-7xl mx-auto">
        <FeedbackForm />
        <FeedbackList />
      </div>
    </div>
  );
}
