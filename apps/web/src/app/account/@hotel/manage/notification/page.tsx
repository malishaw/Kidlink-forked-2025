import { NotificationInbox } from "@/features/notification/components/notification-inbox";
import { SendNotificationForm } from "@/features/notification/components/send-notification";

export default function NotificationManagementPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-slate-800">Notifications</h1>
          <p className="text-slate-600">
            Send notifications to teachers and parents
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Send Notification Form */}
          <div className="lg:col-span-2">
            <SendNotificationForm />
          </div>

          {/* Notification Inbox */}
          <div className="lg:col-span-1">
            <NotificationInbox />
          </div>
        </div>
      </div>
    </div>
  );
}
