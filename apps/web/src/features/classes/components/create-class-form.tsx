"use client";

import { useGetNurseries } from "@/features/nursery/actions/get-nursery-action";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { Plus, X } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { createClass } from "../actions/create-class-action";

export default function CreateClassForm() {
  const { data: nurseries, isLoading: isNurseriesLoading } = useGetNurseries();

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

      alert("Class created!");
      setName("");
      setMainTeacherId("");
      setTeacherIds([]);
      setTeacherInput("");
      setChildIds([]);
      setChildInput("");
    } catch (error: any) {
      console.error("Create class error:", error);
      alert(error?.message || "Error creating class");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl rounded-3xl overflow-hidden max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Plus className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Create New Class</h2>
            <p className="text-indigo-100">
              Add a new class to your management system
            </p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Nursery Display */}
          <div className="space-y-3">
            <Label className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              🏫 Nursery
            </Label>
            <div className="w-full h-12 text-lg border-2 border-slate-200 rounded-xl bg-gray-50 px-4 flex items-center">
              {isNurseriesLoading ? (
                <span className="text-gray-500">Loading nursery...</span>
              ) : nurseryTitle ? (
                <span className="text-slate-700">{nurseryTitle}</span>
              ) : (
                <span className="text-red-500">No nursery available</span>
              )}
            </div>
          </div>

          {/* Class Name */}
          <div className="space-y-3">
            <Label
              htmlFor="name"
              className="text-lg font-semibold text-slate-800 flex items-center gap-2"
            >
              📚 Class Name *
            </Label>
            <Input
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter a memorable class name..."
              required
              className="h-12 text-lg border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-indigo-200 transition-all duration-200"
            />
          </div>

          {/* Main Teacher ID */}
          <div className="space-y-3">
            <Label
              htmlFor="mainTeacherId"
              className="text-lg font-semibold text-slate-800 flex items-center gap-2"
            >
              👨‍🏫 Main Teacher ID
            </Label>
            <Input
              id="mainTeacherId"
              name="mainTeacherId"
              value={mainTeacherId}
              onChange={(e) => setMainTeacherId(e.target.value)}
              placeholder="Enter the main teacher's ID..."
              className="h-12 text-lg border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-blue-200 transition-all duration-200"
            />
          </div>

          {/* Teacher IDs */}
          <div className="space-y-4">
            <Label
              htmlFor="teacherId"
              className="text-lg font-semibold text-slate-800 flex items-center gap-2"
            >
              👥 Additional Teachers
            </Label>
            <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-200">
              <div className="flex gap-3 mb-4">
                <Input
                  id="teacherId"
                  name="teacherId"
                  value={teacherInput}
                  onChange={(e) => setTeacherInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTeacherId();
                    }
                  }}
                  placeholder="Enter teacher ID and press Enter or click Add"
                  className="flex-1 h-11 border-2 border-slate-300 rounded-xl focus:border-green-500 focus:ring-green-200"
                />
                <Button
                  type="button"
                  onClick={addTeacherId}
                  className="h-11 px-6 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-xl"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Teacher
                </Button>
              </div>

              {teacherIds.length > 0 && (
                <div className="space-y-3">
                  <div className="text-sm font-medium text-slate-600">
                    Added Teachers ({teacherIds.length})
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {teacherIds.map((id) => (
                      <div
                        key={id}
                        className="flex items-center gap-2 bg-green-100 text-green-800 rounded-xl px-4 py-2 border border-green-200"
                      >
                        <span className="font-mono font-medium">{id}</span>
                        <button
                          type="button"
                          onClick={() => removeTeacherId(id)}
                          className="text-green-600 hover:text-green-800 hover:bg-green-200 rounded-full p-1 transition-colors"
                          aria-label={`Remove ${id}`}
                          title={`Remove ${id}`}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Children IDs */}
          <div className="space-y-4">
            <Label
              htmlFor="childId"
              className="text-lg font-semibold text-slate-800 flex items-center gap-2"
            >
              🧒 Students
            </Label>
            <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-200">
              <div className="flex gap-3 mb-4">
                <Input
                  id="childId"
                  name="childId"
                  value={childInput}
                  onChange={(e) => setChildInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addChildId();
                    }
                  }}
                  placeholder="Enter student ID and press Enter or click Add"
                  className="flex-1 h-11 border-2 border-slate-300 rounded-xl focus:border-purple-500 focus:ring-purple-200"
                />
                <Button
                  type="button"
                  onClick={addChildId}
                  className="h-11 px-6 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-xl"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Student
                </Button>
              </div>

              {childIds.length > 0 && (
                <div className="space-y-3">
                  <div className="text-sm font-medium text-slate-600">
                    Added Students ({childIds.length})
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {childIds.map((id) => (
                      <div
                        key={id}
                        className="flex items-center gap-2 bg-purple-100 text-purple-800 rounded-xl px-4 py-2 border border-purple-200"
                      >
                        <span className="font-mono font-medium">{id}</span>
                        <button
                          type="button"
                          onClick={() => removeChildId(id)}
                          className="text-purple-600 hover:text-purple-800 hover:bg-purple-200 rounded-full p-1 transition-colors"
                          aria-label={`Remove ${id}`}
                          title={`Remove ${id}`}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <Button
              type="submit"
              disabled={isPending || !canSubmit}
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
            >
              {isPending ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Class...
                </div>
              ) : (
                <div className="flex items-center gap-3">🎓 Create Class</div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
