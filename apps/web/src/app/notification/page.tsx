import { NotificationInbox } from "@/features/notification/components/notification-inbox";

export default function NotificationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-slate-800">Your Notifications</h1>
          <p className="text-slate-600">
            Stay updated with messages from your nursery
          </p>
        </div>

        {/* Notifications */}
        <NotificationInbox />
      </div>
    </div>
  );
}
