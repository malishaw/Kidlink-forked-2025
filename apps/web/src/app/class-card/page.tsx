"use client";

import ClassDetailsCard from "../../../../web/src/features/classes/components/get-class-details-card";

export default function Home() {
  // Replace with a real class ID from your DB
  const exampleClassId = "your-class-id-here";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 space-y-8">
      {/* Class Details Card */}
      <ClassDetailsCard classId={exampleClassId} />
    </main>
  );
}
