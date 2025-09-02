// app/page.tsx
"use client";

import CreateClassForm from "@/features/classes/components/create-class-form";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      {/* Create Class Form Component */}
      <CreateClassForm />
    </main>
  );
}
