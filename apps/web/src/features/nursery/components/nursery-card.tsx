"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
  Building2,
  Calendar,
  Edit3,
  Loader2,
  MapPin,
  Phone,
  Save,
  Star,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { useGetNurseries, type Nursery } from "../actions/get-nursery-action";
import { useUpdateNursery } from "../actions/update-nursery-action";

// Define UpdateNurseryInput locally if not exported from the action
type UpdateNurseryInput = {
  id: string;
  title?: string;
  description?: string;
  address?: string;
  longitude?: number;
  latitude?: number;
  phoneNumbers?: string[];
  logo?: string;
};

export default function NurseriesPage({ nursery }: { nursery?: Nursery }) {
  const { data, isLoading, isError, error, refetch } = useGetNurseries();

  // If nursery prop is provided, use it; otherwise use data from query
  const nurseries = nursery ? [nursery] : (data ?? []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
        <div className="w-full max-w-4xl mx-auto">
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/20">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-1/3" />
              <div className="h-64 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 p-6">
        <div className="w-full max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-red-100">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Failed to load nursery
              </h2>
              <p className="text-red-600 mb-6">
                {(error as Error)?.message || "Something went wrong"}
              </p>
              <button
                onClick={() => refetch()}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="w-full max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            My Nursery
          </h1>
          <p className="text-gray-600">
            Manage your nursery information and settings
          </p>
        </div>

        {nurseries.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-12 shadow-lg border border-white/20 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Building2 className="w-12 h-12 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No nursery found
            </h3>
            <p className="text-gray-600">You haven't created a nursery yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {nurseries.map((n: Nursery) => (
              <NurseryCard key={n.id} nursery={n} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function NurseryCard({ nursery }: { nursery: Nursery }) {
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient(); // React Query client for invalidating queries

  const handleEditClose = () => {
    setIsEditing(false);
    queryClient.invalidateQueries(["my-nursery"]); // Refetch the nursery data
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              {nursery.logo ? (
                <div className="relative">
                  <img
                    src={nursery.logo}
                    alt={nursery.title ?? "Nursery logo"}
                    className="w-20 h-20 rounded-2xl object-cover border-4 border-white/30 shadow-lg"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                </div>
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-white/20 border-4 border-white/30 flex items-center justify-center">
                  <Building2 className="w-10 h-10 text-white/80" />
                </div>
              )}
              <div>
                <h2 className="text-3xl font-bold mb-2">{nursery.title}</h2>
                <div className="flex items-center gap-2 text-white/90">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    Created{" "}
                    {typeof nursery.createdAt === "string"
                      ? new Date(nursery.createdAt).toLocaleDateString()
                      : nursery.createdAt
                        ? new Date(
                            nursery.createdAt as any
                          ).toLocaleDateString()
                        : "—"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 border border-white/30"
              >
                <Edit3 className="w-4 h-4" />
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {nursery.description && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              About
            </h3>
            <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl">
              {nursery.description}
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Location */}
          {nursery.address && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                Location
              </h4>
              <p className="text-gray-700">{nursery.address}</p>
              {(nursery.latitude || nursery.longitude) && (
                <p className="text-sm text-gray-500 mt-1">
                  {nursery.latitude}, {nursery.longitude}
                </p>
              )}
            </div>
          )}

          {/* Contact */}
          {nursery.phoneNumbers &&
            nursery.phoneNumbers.length > 0 &&
            nursery.phoneNumbers.some((phone) => phone) && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-green-600" />
                  Contact
                </h4>
                <div className="space-y-1">
                  {nursery.phoneNumbers
                    .filter((phone) => phone)
                    .map((phone, idx) => (
                      <a
                        key={idx}
                        href={`tel:${phone}`}
                        className="block text-gray-700 hover:text-green-600 transition-colors"
                      >
                        {phone}
                      </a>
                    ))}
                </div>
              </div>
            )}
        </div>
      </div>

      {/* Edit Form */}
      {isEditing && (
        <EditNurseryForm
          key={`edit-${nursery.id}`}
          initial={nursery}
          onClose={handleEditClose} // Close and refetch data
        />
      )}
    </div>
  );
}

function EditNurseryForm({
  initial,
  onClose,
}: {
  initial: Nursery;
  onClose: () => void;
}) {
  const [form, setForm] = useState<UpdateNurseryInput>({
    id: initial.id,
    title: initial.title ?? "",
    description: initial.description ?? "",
    address: initial.address ?? "",
    longitude: initial.longitude ?? undefined,
    latitude: initial.latitude ?? undefined,
    phoneNumbers: Array.isArray(initial.phoneNumbers)
      ? [...initial.phoneNumbers]
      : [],
    logo: initial.logo ?? "",
  });
  const [localError, setLocalError] = useState<string | null>(null);

  const { mutateAsync, isPending } = useUpdateNursery();

  // Define the buildPatch function
  const buildPatch = (initial: Nursery, current: UpdateNurseryInput) => {
    const patch: Record<string, unknown> = {};

    if (current.title !== initial.title) patch.title = current.title;
    if (current.description !== initial.description)
      patch.description = current.description;
    if (current.address !== initial.address) patch.address = current.address;
    if (current.longitude !== initial.longitude)
      patch.longitude = current.longitude;
    if (current.latitude !== initial.latitude)
      patch.latitude = current.latitude;
    if (
      JSON.stringify(current.phoneNumbers) !==
      JSON.stringify(initial.phoneNumbers)
    )
      patch.phoneNumbers = current.phoneNumbers;
    if (current.logo !== initial.logo) patch.logo = current.logo;

    return patch;
  };

  const onChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "longitude" || name === "latitude") {
      setForm((f) => ({
        ...f,
        [name]: value === "" ? undefined : Number(value),
      }));
    } else if (name === "phoneNumbers") {
      const arr = value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
      setForm((f) => ({ ...f, phoneNumbers: arr }));
    } else if (name === "logo") {
      setForm((f) => ({ ...f, logo: value || "" }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    try {
      const patch = buildPatch(initial, form);

      if (Object.keys(patch).length === 0) {
        setLocalError("No changes to save");
        return;
      }

      await mutateAsync({ id: form.id, patch });
      onClose();
    } catch (err) {
      setLocalError((err as Error)?.message ?? "Failed to update nursery");
    }
  };

  return (
    <div className="border-t border-gray-200 bg-gray-50/50 backdrop-blur-sm">
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-indigo-600" />
            Edit Nursery Details
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {localError && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
            <X className="w-4 h-4" />
            {localError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nursery Name *
              </label>
              <input
                name="title"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                value={form.title ?? ""}
                onChange={onChange}
                placeholder="e.g. Sunshine Nursery"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                rows={4}
                value={form.description ?? ""}
                onChange={onChange}
                placeholder="Tell us about your nursery..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                name="address"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                value={form.address ?? ""}
                onChange={onChange}
                placeholder="123 Main Street, City"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Longitude
              </label>
              <input
                name="longitude"
                type="number"
                step="any"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                value={form.longitude ?? ""}
                onChange={onChange}
                placeholder="e.g. 80.7718"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Latitude
              </label>
              <input
                name="latitude"
                type="number"
                step="any"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                value={form.latitude ?? ""}
                onChange={onChange}
                placeholder="e.g. 7.2906"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Numbers
              </label>
              <input
                name="phoneNumbers"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                value={(form.phoneNumbers ?? []).join(", ")}
                onChange={onChange}
                placeholder="0771234567, 0712345678"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo URL
              </label>
              <div className="flex items-center gap-4">
                {/* Image Preview */}
                {form.logo && (
                  <img
                    src={form.logo}
                    alt="Logo Preview"
                    className="w-16 h-16 rounded-lg object-cover border border-gray-300"
                  />
                )}

                {/* File Picker */}
                <input
                  type="file"
                  accept="image/*"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => {
                        setForm((f) => ({
                          ...f,
                          logo: reader.result as string,
                        }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition-colors"
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-60 disabled:hover:scale-100 flex items-center gap-2"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
