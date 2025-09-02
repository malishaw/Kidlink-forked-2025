"use client";

import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { Plus, X } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useCreateClass } from "../actions/create-class-action";

export default function CreateClassForm() {
  const { mutate: createClass, isPending } = useCreateClass();
  const [name, setName] = useState("");

  // Main teacher
  const [mainTeacherId, setMainTeacherId] = useState("");

  // Teacher IDs
  const [teacherInput, setTeacherInput] = useState("");
  const [teacherIds, setTeacherIds] = useState<string[]>([]);

  // Children IDs
  const [childInput, setChildInput] = useState("");
  const [childIds, setChildIds] = useState<string[]>([]);

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

  const canSubmit = useMemo(() => name.trim().length > 0, [name]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createClass(
      { name, mainTeacherId, teacherIds, childIds },
      {
        onSuccess: () => {
          alert("Class created!");
          setName("");
          setMainTeacherId("");
          setTeacherIds([]);
          setTeacherInput("");
          setChildIds([]);
          setChildInput("");
        },
        onError: (err: any) => {
          console.error(err);
          alert(err?.message || "Error creating class");
        },
      }
    );
  };

  return (
    <Card className="w-[600px] ml-0">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Create Class</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Class Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Class Name *</Label>
            <Input
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter class name"
              required
            />
          </div>

          {/* Main Teacher ID */}
          <div className="space-y-2">
            <Label htmlFor="mainTeacherId">Main Teacher ID</Label>
            <Input
              id="mainTeacherId"
              name="mainTeacherId"
              value={mainTeacherId}
              onChange={(e) => setMainTeacherId(e.target.value)}
              placeholder="Enter main teacher id"
            />
          </div>

          {/* Teacher IDs */}
          <div className="space-y-2">
            <Label htmlFor="teacherId">Teacher IDs</Label>
            <div className="relative flex gap-2">
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
                placeholder="Enter a teacher id and press Enter"
                className="pr-8"
              />
              {teacherIds.length > 0 && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 select-none text-muted-foreground"
                  title="You can add more"
                >
                  +
                </span>
              )}
              <Button type="button" onClick={addTeacherId} variant="secondary">
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>

            {teacherIds.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {teacherIds.map((id) => (
                  <div
                    key={id}
                    className="flex items-center gap-2 rounded-2xl border px-3 py-1 text-sm"
                  >
                    <span className="font-mono">{id}</span>
                    <button
                      type="button"
                      onClick={() => removeTeacherId(id)}
                      className="text-muted-foreground hover:text-foreground"
                      aria-label={`Remove ${id}`}
                      title={`Remove ${id}`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Children IDs */}
          <div className="space-y-2">
            <Label htmlFor="childId">Children IDs</Label>
            <div className="relative flex gap-2">
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
                placeholder="Enter a child id and press Enter"
                className="pr-8"
              />
              {childIds.length > 0 && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 select-none text-muted-foreground"
                  title="You can add more"
                >
                  +
                </span>
              )}
              <Button type="button" onClick={addChildId} variant="secondary">
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>

            {childIds.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {childIds.map((id) => (
                  <div
                    key={id}
                    className="flex items-center gap-2 rounded-2xl border px-3 py-1 text-sm"
                  >
                    <span className="font-mono">{id}</span>
                    <button
                      type="button"
                      onClick={() => removeChildId(id)}
                      className="text-muted-foreground hover:text-foreground"
                      aria-label={`Remove ${id}`}
                      title={`Remove ${id}`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="pt-4">
            <Button
              type="submit"
              disabled={isPending || !canSubmit}
              className="w-full md:w-auto px-8"
            >
              {isPending ? "Saving..." : "Save Class"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
