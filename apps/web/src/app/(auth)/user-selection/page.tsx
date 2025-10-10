import { UserSelectionForm } from "@/features/auth/components/user-selection-form";

export default function UserSelectionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <UserSelectionForm />
      </div>
    </div>
  );
}
