"use client";

import type React from "react";

import { useCreateNursery } from "@/app/account/actions/create-nursery.action";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components//card";
import { Input } from "@repo/ui/components//input";
import { Button } from "@repo/ui/components/button";
import { Label } from "@repo/ui/components/label";
import { Textarea } from "@repo/ui/components/textarea";
import { useState } from "react";

export default function CreateNurseryForm() {
  const { mutate: createNursery, isPending } = useCreateNursery();

  const [form, setForm] = useState({
    title: "",
    description: "",
    address: "",
    longitude: "" as string | number | undefined,
    latitude: "" as string | number | undefined,
    phoneNumbers: [""],
    logo: "",
    photos: [""],
    attachments: [""],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (
    name: "phoneNumbers" | "photos" | "attachments",
    index: number,
    value: string
  ) => {
    setForm((prev) => {
      const copy = [...prev[name]];
      copy[index] = value;
      return { ...prev, [name]: copy };
    });
  };

  const addArrayField = (name: "phoneNumbers" | "photos" | "attachments") => {
    setForm((prev) => ({ ...prev, [name]: [...prev[name], ""] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createNursery(
      {
        ...form,
        longitude: form.longitude !== "" ? Number(form.longitude) : undefined,
        latitude: form.latitude !== "" ? Number(form.latitude) : undefined,
      },
      {
        onSuccess: () => {
          alert("Nursery created!");
          setForm({
            title: "",
            description: "",
            address: "",
            longitude: "",
            latitude: "",
            phoneNumbers: [""],
            logo: "",
            photos: [""],
            attachments: [""],
          });
        },
        onError: (err: any) => {
          console.error(err);
          alert("Error creating nursery");
        },
      }
    );
  };

  return (
    <Card className="w-[1200px] mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Create Nursery</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information - 2x2 Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Nursery title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Full address"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                name="longitude"
                value={form.longitude}
                onChange={handleChange}
                placeholder="e.g., -122.4194"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                name="latitude"
                value={form.latitude}
                onChange={handleChange}
                placeholder="e.g., 37.7749"
              />
            </div>
          </div>

          {/* Description - Full Width */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe your nursery..."
              rows={3}
            />
          </div>

          {/* Logo - Full Width */}
          <div className="space-y-2">
            <Label htmlFor="logo">Logo URL</Label>
            <Input
              id="logo"
              name="logo"
              value={form.logo}
              onChange={handleChange}
              placeholder="https://example.com/logo.png"
            />
          </div>

          {/* Dynamic Arrays in 2x1 Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Phone Numbers */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Phone Numbers</Label>
              <div className="space-y-2">
                {form.phoneNumbers.map((phone, idx) => (
                  <Input
                    key={idx}
                    type="tel"
                    value={phone}
                    onChange={(e) =>
                      handleArrayChange("phoneNumbers", idx, e.target.value)
                    }
                    placeholder="Phone number"
                  />
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayField("phoneNumbers")}
                  className="w-full"
                >
                  + Add Phone Number
                </Button>
              </div>
            </div>

            {/* Photos */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Photos</Label>
              <div className="space-y-2">
                {form.photos.map((photo, idx) => (
                  <Input
                    key={idx}
                    type="url"
                    value={photo}
                    onChange={(e) =>
                      handleArrayChange("photos", idx, e.target.value)
                    }
                    placeholder="Photo URL"
                  />
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayField("photos")}
                  className="w-full"
                >
                  + Add Photo
                </Button>
              </div>
            </div>
          </div>

          {/* Attachments - Full Width */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Attachments</Label>
            <div className="space-y-2">
              {form.attachments.map((file, idx) => (
                <Input
                  key={idx}
                  type="url"
                  value={file}
                  onChange={(e) =>
                    handleArrayChange("attachments", idx, e.target.value)
                  }
                  placeholder="Attachment URL"
                />
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayField("attachments")}
                className="w-full max-w-xs"
              >
                + Add Attachment
              </Button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              disabled={isPending}
              className="w-full md:w-auto px-8"
            >
              {isPending ? "Creating Nursery..." : "Create Nursery"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
