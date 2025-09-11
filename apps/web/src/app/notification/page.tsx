import GetNotificationsList from "@/features/notification/components/get-notification";
import NurseryNotificationSystem from "@/features/notification/components/notification";
// import UpdateNotificationForm from "@/features/notification/components/update-notification";

export default function Page() {
  return (
    <div className="space-y-6">
      <NurseryNotificationSystem />
      <GetNotificationsList />
      {/* <UpdateNotificationForm /> */}
    </div>
  );
}
