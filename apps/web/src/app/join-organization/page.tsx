"use client";

import { InvitationInputForm } from "@/features/auth/components/invitation-input-form";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function JoinOrganizationContent() {
  const searchParams = useSearchParams();
  const userType = searchParams.get("userType") as "teacher" | "parent";

  if (!userType || (userType !== "teacher" && userType !== "parent")) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Invalid User Type
          </h1>
          <p className="text-gray-600">Please select a valid user type.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <InvitationInputForm userType={userType} />
    </div>
  );
}

export default function JoinOrganizationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p>Loading...</p>
          </div>
        </div>
      }
    >
      <JoinOrganizationContent />
    </Suspense>
  );
}
