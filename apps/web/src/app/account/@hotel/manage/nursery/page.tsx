"use client";

import { useMyNursery } from "@/features/nursery/actions/get-my-nursery.action";
import NurseriesPage from "@/features/nursery/components/nursery-card";
import CreateNurseryForm from "@/features/nursery/components/nursery-create-form";

export default function Page() {
  const { data: nursery, isLoading, refetch } = useMyNursery();

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  // If nursery exists, show the card
  if (nursery) {
    return (
      <main className="min-h-screen w-full p-6">
        <NurseriesPage nursery={nursery} />
      </main>
    );
  }

  // If no nursery, show the create form
  return (
    <main className="min-h-screen w-full p-6">
      <CreateNurseryForm onCreated={refetch} />
    </main>
  );
}
