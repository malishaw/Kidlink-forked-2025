"use client";

import Link from "next/link";
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

export default function NurseriesPage() {
  const { data, isLoading, isError, error, refetch } = useGetNurseries();

  if (isLoading) {
    return (
      <div className="w-full max-w-5xl p-6">
        <h1 className="text-2xl font-bold mb-4">Nurseries</h1>
        <div className="animate-pulse space-y-3">
          <div className="h-20 bg-gray-100 rounded" />
          <div className="h-20 bg-gray-100 rounded" />
          <div className="h-20 bg-gray-100 rounded" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full max-w-5xl p-6">
        <h1 className="text-2xl font-bold mb-4">Nurseries</h1>
        <div className="bg-red-50 text-red-700 p-4 rounded">
          {(error as Error)?.message || "Failed to load nurseries"}
        </div>
        <button
          onClick={() => refetch()}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  const nurseries = data ?? [];

  return (
    <div className="w-full max-w-5xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Nurseries</h1>
      </div>

      {nurseries.length === 0 ? (
        <div className="text-gray-600">No nurseries found.</div>
      ) : (
        <ul className="grid md:grid-cols-2 gap-4">
          {nurseries.map((n: Nursery) => (
            <NurseryListItem key={n.id} n={n} />
          ))}
        </ul>
      )}
    </div>
  );
}

function NurseryListItem({ n }: { n: Nursery }) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <li className="border rounded-lg p-4 shadow-sm">
      <div className="flex items-start gap-3">
        {n.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={n.logo}
            alt={n.title ?? "Nursery logo"}
            className="w-14 h-14 rounded object-cover border"
          />
        ) : (
          <div className="w-14 h-14 rounded bg-gray-100 border" />
        )}
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold">{n.title}</h2>
              {n.address && (
                <p className="text-sm text-gray-600">{n.address}</p>
              )}
              <div className="mt-2 text-xs text-gray-500">
                <span>
                  Created:{" "}
                  {typeof n.createdAt === "string"
                    ? n.createdAt
                    : n.createdAt
                      ? new Date(n.createdAt as any).toLocaleString()
                      : "—"}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="text-sm bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded"
              >
                Update
              </button>
              <Link
                href={`/account/nurseries/${n.id}`}
                className="text-blue-600 text-sm self-start"
              >
                View details →
              </Link>
            </div>
          </div>

          {n.description && (
            <p className="mt-3 text-sm text-gray-700 line-clamp-3">
              {n.description}
            </p>
          )}
        </div>
      </div>

      {isEditing && (
        <EditNurseryForm
          key={`edit-${n.id}`}
          initial={n}
          onClose={() => setIsEditing(false)}
        />
      )}
    </li>
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

  // ---------- helpers for patch/diff ----------
  function toNullIfEmpty(v: string | null | undefined) {
    const t = (v ?? "").trim();
    return t === "" ? null : t;
  }

  function cleanPhones(arr: string[] | undefined) {
    return (arr ?? []).map((s) => s.trim()).filter(Boolean);
  }

  function buildPatch(initialN: Nursery, current: UpdateNurseryInput) {
    const patch: Record<string, unknown> = {};

    const title = toNullIfEmpty(current.title) ?? undefined;
    if (title !== (initialN.title ?? undefined)) patch.title = title;

    const description = toNullIfEmpty(current.description);
    if (description !== (initialN.description ?? null))
      patch.description = description;

    const address = toNullIfEmpty(current.address);
    if (address !== (initialN.address ?? null)) patch.address = address;

    const longitude = current.longitude ?? null;
    if (longitude !== (initialN.longitude ?? null)) patch.longitude = longitude;

    const latitude = current.latitude ?? null;
    if (latitude !== (initialN.latitude ?? null)) patch.latitude = latitude;

    const logo = toNullIfEmpty(current.logo);
    if (logo !== (initialN.logo ?? null)) patch.logo = logo;

    const phoneNumbers = cleanPhones(current.phoneNumbers);
    if (
      JSON.stringify(phoneNumbers) !==
      JSON.stringify(initialN.phoneNumbers ?? [])
    ) {
      patch.phoneNumbers = phoneNumbers;
    }

    // add photos/attachments here if you expose them in the form
    return patch;
  }
  // -------------------------------------------

  const onChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "longitude" || name === "latitude") {
      setForm((f: any) => ({
        ...f,
        [name]: value === "" ? undefined : Number(value),
      }));
    } else if (name === "phoneNumbers") {
      const arr = value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
      setForm((f: any) => ({ ...f, phoneNumbers: arr }));
    } else if (name === "logo") {
      setForm((f: any) => ({ ...f, logo: value || "" }));
    } else if (
      name === "description" ||
      name === "address" ||
      name === "title"
    ) {
      setForm((f: any) => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    try {
      const patch = buildPatch(initial, {
        ...form,
        title: form.title,
        description: form.description,
        address: form.address,
        logo: form.logo,
        phoneNumbers: form.phoneNumbers,
      });

      if (Object.keys(patch).length === 0) {
        setLocalError("No changes to save");
        return;
      }

      // KEY FIX: send { id, patch }
      await mutateAsync({ id: form.id, patch });
      onClose();
    } catch (err) {
      setLocalError((err as Error)?.message ?? "Failed to update nursery");
    }
  };

  return (
    <div className="mt-4 border-t pt-4">
      <h3 className="text-base font-semibold mb-3">Edit nursery</h3>
      {localError && (
        <div className="mb-3 bg-red-50 text-red-700 p-2 rounded">
          {localError}
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-3"
      >
        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-700">Title</span>
          <input
            name="title"
            className="border rounded px-3 py-2"
            value={form.title ?? ""}
            onChange={onChange}
            placeholder="e.g. Hilltop Nursery"
            required
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-700">Address</span>
          <input
            name="address"
            className="border rounded px-3 py-2"
            value={form.address ?? ""}
            onChange={onChange}
            placeholder="123 Main Rd, Kandy"
          />
        </label>

        <label className="md:col-span-2 flex flex-col gap-1">
          <span className="text-sm text-gray-700">Description</span>
          <textarea
            name="description"
            className="border rounded px-3 py-2"
            rows={3}
            value={form.description ?? ""}
            onChange={onChange}
            placeholder="Short description..."
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-700">Longitude</span>
          <input
            name="longitude"
            type="number"
            step="any"
            className="border rounded px-3 py-2"
            value={form.longitude ?? ""}
            onChange={onChange}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-700">Latitude</span>
          <input
            name="latitude"
            type="number"
            step="any"
            className="border rounded px-3 py-2"
            value={form.latitude ?? ""}
            onChange={onChange}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-700">Phone numbers</span>
          <input
            name="phoneNumbers"
            className="border rounded px-3 py-2"
            value={(form.phoneNumbers ?? []).join(", ")}
            onChange={onChange}
            placeholder="0771234567, 0712345678"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-gray-700">Logo URL</span>
          <input
            name="logo"
            className="border rounded px-3 py-2"
            value={form.logo ?? ""}
            onChange={onChange}
            placeholder="https://..."
          />
        </label>

        <div className="md:col-span-2 flex items-center justify-end gap-2 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded border"
            disabled={isPending}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-60"
            disabled={isPending}
          >
            {isPending ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
