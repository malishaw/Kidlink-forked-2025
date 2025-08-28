"use client";

import { useCreateClass } from "@/app/account/actions/create-class-action";
import { useState } from "react";

export default function CreateClassForm() {
  const { mutate: createClass, isPending } = useCreateClass();

  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createClass(
      { name },
      {
        onSuccess: () => {
          alert("Class created!");
          setName("");
        },
        onError: (err: any) => {
          console.error(err);
          alert(err?.message || "Error creating class");
        },
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 max-w-lg mx-auto bg-white shadow rounded"
    >
      <h2 className="text-xl font-bold">Create Class</h2>

      <input
        type="text"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Class name"
        className="w-full border px-3 py-2 rounded"
        required
      />

      {/* No nurseryId input. The API will auto-pick the user's sole nursery.
          If the account owns multiple nurseries, the API responds 400 asking
          for a specific nurseryId — you can catch that and show a UI picker. */}

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded"
        disabled={isPending}
      >
        {isPending ? "Saving..." : "Save Class"}
      </button>
    </form>
  );
}
