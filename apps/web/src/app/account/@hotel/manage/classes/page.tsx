"use client";

import { useCreateClass } from "@/app/account/actions/create-class-action";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
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

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              disabled={isPending}
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
