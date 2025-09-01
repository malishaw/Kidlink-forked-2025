"use client";

import { useCreateClass } from "@/app/account/actions/create-class-action";
import { Plus, Trash2 } from "lucide-react"; // icon library
import { useState } from "react";

export default function CreateClassForm() {
  const { mutate: createClass, isPending } = useCreateClass();

  const [name, setName] = useState("");
  const [mainTeacherId, setMainTeacherId] = useState<string | null>(null);
  const [teacherIds, setTeacherIds] = useState<string[]>([""]); // start with one empty field

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createClass(
      {
        name,
        mainTeacherId,
        teacherIds: teacherIds.filter(Boolean), // remove empty
      },
      {
        onSuccess: () => {
          alert("Class created!");
          setName("");
          setMainTeacherId(null);
          setTeacherIds([""]);
        },
        onError: (err: any) => {
          console.error(err);
          alert(err?.message || "Error creating class");
        },
      }
    );
  };

  const handleAddTeacherField = () => {
    setTeacherIds((prev) => [...prev, ""]);
  };

  const handleRemoveTeacherField = (index: number) => {
    setTeacherIds((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTeacherChange = (index: number, value: string) => {
    setTeacherIds((prev) => prev.map((t, i) => (i === index ? value : t)));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 max-w-lg mx-auto bg-white shadow rounded"
    >
      <h2 className="text-xl font-bold">Create Class</h2>

      {/* Class Name */}
      <input
        type="text"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Class name"
        className="w-full border px-3 py-2 rounded"
        required
      />

      {/* Main Teacher ID */}
      <input
        type="text"
        name="mainTeacherId"
        value={mainTeacherId ?? ""}
        onChange={(e) => setMainTeacherId(e.target.value || null)}
        placeholder="Main Teacher ID (optional)"
        className="w-full border px-3 py-2 rounded"
      />

      {/* All Teachers (dynamic fields) */}
      <div>
        <label className="block font-medium mb-1">All Teacher IDs</label>
        {teacherIds.map((teacherId, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={teacherId}
              onChange={(e) => handleTeacherChange(index, e.target.value)}
              placeholder={`Teacher ID #${index + 1}`}
              className="flex-1 border px-3 py-2 rounded"
            />
            {index === teacherIds.length - 1 ? (
              <button
                type="button"
                onClick={handleAddTeacherField}
                className="bg-blue-500 text-white px-3 py-2 rounded flex items-center"
              >
                <Plus className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleRemoveTeacherField(index)}
                className="bg-red-500 text-white px-3 py-2 rounded flex items-center"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Submit */}
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
