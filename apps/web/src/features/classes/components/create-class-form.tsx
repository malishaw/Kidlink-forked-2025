"use client";

import { useGetNurseries } from "@/features/nursery/actions/get-nursery-action";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { createClass } from "../actions/create-class-action";

export default function CreateClassForm({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
}) {
  const { data: nurseries, isLoading: isNurseriesLoading } = useGetNurseries();
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [isPending, setIsPending] = useState(false);

  // Main teacher
  const [mainTeacherId, setMainTeacherId] = useState("");

  // Teacher IDs
  const [teacherInput, setTeacherInput] = useState("");
  const [teacherIds, setTeacherIds] = useState<string[]>([]);

  // Children IDs
  const [childInput, setChildInput] = useState("");
  const [childIds, setChildIds] = useState<string[]>([]);

  // Get the first (and only) nursery ID
  const nurseryId = nurseries?.[0]?.id || "";
  const nurseryTitle = nurseries?.[0]?.title || "";

  const addTeacherId = useCallback(() => {
    const trimmed = teacherInput.trim();
    if (!trimmed) return;
    setTeacherIds((prev) =>
      prev.includes(trimmed) ? prev : [...prev, trimmed]
    );
    setTeacherInput("");
  }, [teacherInput]);

  const removeTeacherId = useCallback((id: string) => {
    setTeacherIds((prev) => prev.filter((t) => t !== id));
  }, []);

  const addChildId = useCallback(() => {
    const trimmed = childInput.trim();
    if (!trimmed) return;
    setChildIds((prev) => (prev.includes(trimmed) ? prev : [...prev, trimmed]));
    setChildInput("");
  }, [childInput]);

  const removeChildId = useCallback((id: string) => {
    setChildIds((prev) => prev.filter((c) => c !== id));
  }, []);

  const canSubmit = useMemo(
    () => name.trim().length > 0 && nurseryId.length > 0,
    [name, nurseryId]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    try {
      if (name.trim() === "") {
        alert("Class name is required.");
        return;
      }

      if (!nurseryId) {
        alert(
          "No nursery available. Please ensure a nursery is created first."
        );
        return;
      }

      // Filter out empty strings and null values
      const filteredTeacherIds = teacherIds.filter(
        (id) => id != null && id.trim() !== ""
      );
      const filteredChildIds = childIds.filter(
        (id) => id != null && id.trim() !== ""
      );

      console.log("Submitting class data:", {
        nurseryId,
        name: name.trim(),
        mainTeacherId: mainTeacherId.trim() === "" ? null : mainTeacherId,
        teacherIds: filteredTeacherIds,
        childIds: filteredChildIds,
      });

      await createClass({
        nurseryId,
        name: name.trim(),
        mainTeacherId: mainTeacherId.trim() === "" ? null : mainTeacherId,
        teacherIds: filteredTeacherIds,
        childIds: filteredChildIds,
      });

      // Refetch the classes list
      queryClient.invalidateQueries({ queryKey: ["classes-list"] });

      alert("Class created!");
      setName("");
      setMainTeacherId("");
      setTeacherIds([]);
      setTeacherInput("");
      setChildIds([]);
      setChildInput("");

      // Call onSuccess callback if provided
      onSuccess?.();
    } catch (error: any) {
      console.error("Create class error:", error);
      alert(error?.message || "Error creating class");
    } finally {
      setIsPending(false);
    }
  };

  // Only show as right side panel
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-transparent bg-opacity-30 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Right Side Panel */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto">
        {/* Panel Header */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Plus className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Create Class</h2>
                <p className="text-indigo-100 text-sm">Add new class</p>
              </div>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Panel Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nursery Display */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                🏫 Nursery
              </Label>
              <div className="w-full h-10 text-sm border-2 border-slate-200 rounded-lg bg-gray-50 px-3 flex items-center">
                {isNurseriesLoading ? (
                  <span className="text-gray-500">Loading...</span>
                ) : nurseryTitle ? (
                  <span className="text-slate-700">{nurseryTitle}</span>
                ) : (
                  <span className="text-red-500">No nursery available</span>
                )}
              </div>
            </div>

            {/* Class Name */}
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-semibold text-slate-800 flex items-center gap-2"
              >
                📚 Class Name *
              </Label>
              <Input
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter class name..."
                required
                className="h-10 text-sm border-2 border-slate-200 rounded-lg focus:border-indigo-500 focus:ring-indigo-200 transition-all duration-200"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                disabled={isPending || !canSubmit}
                className="w-full h-10 text-sm font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isPending ? (
                  <div className="flex items-center gap-2 justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating...
                  </div>
                ) : (
                  <div className="flex items-center gap-2 justify-center">
                    🎓 Create Class
                  </div>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
