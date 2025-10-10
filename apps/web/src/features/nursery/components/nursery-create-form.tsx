"use client";

import type React from "react";
import { useState } from "react";

import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { Textarea } from "@repo/ui/components/textarea";

import GalleryView from "@/modules/media/components/gallery-view";
import { useCreateNursery } from "../actions/create-nursery.action";

export default function CreateNurseryForm({
  onCreated,
}: {
  onCreated?: () => void;
}) {
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

  const [isGalleryOpen, setGalleryOpen] = useState(false);

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
          onCreated?.();
        },
        onError: (err: any) => {
          console.error(err);
          alert("Error creating nursery");
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <Card className="w-full max-w-[1200px] mx-auto shadow-2xl border-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
          <CardTitle className="text-3xl font-bold text-center flex items-center justify-center gap-3">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Create New Nursery
          </CardTitle>
          <p className="text-blue-100 text-center mt-2">
            Build your educational community
          </p>
        </CardHeader>
        <CardContent className="p-8 bg-white">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z"
                    clipRule="evenodd"
                  />
                </svg>
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="title"
                    className="text-sm font-medium text-gray-700 flex items-center gap-1"
                  >
                    Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Enter nursery name"
                    required
                    className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="address"
                    className="text-sm font-medium text-gray-700"
                  >
                    Address
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Enter full address"
                    className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 rounded-xl"
                  />
                </div>

                {/* <div className="space-y-2">
                  <Label
                    htmlFor="longitude"
                    className="text-sm font-medium text-gray-700"
                  >
                    Longitude
                  </Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    name="longitude"
                    value={form.longitude}
                    onChange={handleChange}
                    placeholder="e.g., -122.4194"
                    className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 rounded-xl"
                  />
                </div> */}

                {/* <div className="space-y-2">
                  <Label
                    htmlFor="latitude"
                    className="text-sm font-medium text-gray-700"
                  >
                    Latitude
                  </Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    name="latitude"
                    value={form.latitude}
                    onChange={handleChange}
                    placeholder="e.g., 37.7749"
                    className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 rounded-xl"
                  />
                </div> */}
              </div>
            </div>

            {/* Description Section */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-purple-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Description
              </h3>
              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="text-sm font-medium text-gray-700"
                >
                  Tell us about your nursery
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe your nursery's mission, values, and unique features..."
                  rows={4}
                  className="border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 rounded-xl resize-none"
                />
              </div>
            </div>

            {/* Logo Section */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                    clipRule="evenodd"
                  />
                </svg>
                Logo
              </h3>
              <div className="space-y-2">
                <Label
                  htmlFor="logo"
                  className="text-sm font-medium text-gray-700"
                >
                  Logo URL
                </Label>
                <Input
                  id="logo"
                  name="logo"
                  value={form.logo}
                  onChange={handleChange}
                  placeholder="https://example.com/logo.png"
                  className="h-12 border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 rounded-xl"
                />
                <div className="flex items-center gap-4 mt-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => {
                          setForm((prev) => ({
                            ...prev,
                            logo: reader.result as string,
                          }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />
                  {form.logo && (
                    <img
                      src={form.logo}
                      alt="Logo Preview"
                      className="w-16 h-16 object-cover rounded-lg border border-gray-300"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Contact & Media Section */}
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-6 border border-orange-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-orange-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                Contact & Media
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Phone Numbers */}
                <div className="space-y-4">
                  <Label className="text-lg font-medium text-gray-800 flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    Phone Numbers
                  </Label>
                  <div className="space-y-3">
                    {form.phoneNumbers.map((phone, idx) => (
                      <Input
                        key={idx}
                        type="tel"
                        value={phone}
                        onChange={(e) =>
                          handleArrayChange("phoneNumbers", idx, e.target.value)
                        }
                        placeholder="Enter phone number"
                        className="h-11 border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 rounded-lg"
                      />
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addArrayField("phoneNumbers")}
                      className="w-full h-11 border-2 border-dashed border-orange-300 text-orange-600 hover:bg-orange-50 hover:border-orange-400 transition-all duration-200 rounded-lg"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Add Phone Number
                    </Button>
                  </div>
                </div>

                {/* Photos */}
                <div className="space-y-4">
                  <Label className="text-lg font-medium text-gray-800 flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Photos
                  </Label>

                  <div className="mt-4">
                    <Label className="text-sm font-medium text-gray-700">
                      Select from Media Gallery
                    </Label>
                    <div className="mt-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setGalleryOpen(true)}
                        className="w-full h-11 border-2 border-dashed border-orange-300 text-orange-600 hover:bg-orange-50 hover:border-orange-400 transition-all duration-200 rounded-lg"
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Add Photos from Gallery
                      </Button>

                      {/* Display selected photos */}
                      {form.photos.filter((p) => p !== "").length > 0 && (
                        <div className="mt-4">
                          <Label className="text-sm font-medium text-gray-700 mb-2 block">
                            Selected Photos (
                            {form.photos.filter((p) => p !== "").length})
                          </Label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {form.photos
                              .filter((p) => p !== "")
                              .map((photo, idx) => (
                                <div key={idx} className="relative group">
                                  <img
                                    src={photo}
                                    alt={`Selected photo ${idx + 1}`}
                                    className="w-full h-24 object-cover rounded-lg border border-gray-300"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setForm((prev) => ({
                                        ...prev,
                                        photos: prev.photos.filter(
                                          (_, i) =>
                                            i !== form.photos.indexOf(photo)
                                        ),
                                      }));
                                    }}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}

                      <GalleryView
                        modal={true}
                        modalOpen={isGalleryOpen}
                        setModalOpen={setGalleryOpen}
                        activeTab="library"
                        onUseSelected={(selectedPhotos) => {
                          const photoUrls = selectedPhotos.map(
                            (photo) => photo.url || ""
                          );
                          setForm((prev) => ({
                            ...prev,
                            photos: [
                              ...prev.photos.filter((p) => p !== ""),
                              ...photoUrls,
                            ],
                          }));
                          setGalleryOpen(false);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Attachments Section */}
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-indigo-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
                    clipRule="evenodd"
                  />
                </svg>
                Attachments
              </h3>
              <div className="space-y-3">
                {form.attachments.map((file, idx) => (
                  <Input
                    key={idx}
                    type="url"
                    value={file}
                    onChange={(e) =>
                      handleArrayChange("attachments", idx, e.target.value)
                    }
                    placeholder="Enter attachment URL"
                    className="h-11 border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 rounded-lg"
                  />
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayField("attachments")}
                  className="w-full max-w-xs h-11 border-2 border-dashed border-indigo-300 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-400 transition-all duration-200 rounded-lg"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Add Attachment
                </Button>
              </div>
            </div>

            {/* Submit Section */}
            <div className="flex justify-center pt-6">
              <Button
                type="submit"
                disabled={isPending}
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-12 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg"
              >
                {isPending ? (
                  <div className="flex items-center gap-3">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Creating Your Nursery...
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Create Nursery
                  </div>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
