"use client";

import { useCreateNursery } from "@/app/account/actions/create-nursery.action";
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
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 max-w-lg mx-auto bg-white shadow rounded"
    >
      <h2 className="text-xl font-bold">Create Nursery</h2>

      <input
        type="text"
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Title"
        className="w-full border px-3 py-2 rounded"
        required
      />

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
        className="w-full border px-3 py-2 rounded"
      />

      <input
        type="text"
        name="address"
        value={form.address}
        onChange={handleChange}
        placeholder="Address"
        className="w-full border px-3 py-2 rounded"
      />

      <div className="flex gap-2">
        <input
          type="number"
          step="any"
          name="longitude"
          value={form.longitude}
          onChange={handleChange}
          placeholder="Longitude"
          className="w-1/2 border px-3 py-2 rounded"
        />
        <input
          type="number"
          step="any"
          name="latitude"
          value={form.latitude}
          onChange={handleChange}
          placeholder="Latitude"
          className="w-1/2 border px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="block font-medium">Phone Numbers</label>
        {form.phoneNumbers.map((phone, idx) => (
          <input
            key={idx}
            type="text"
            value={phone}
            onChange={(e) =>
              handleArrayChange("phoneNumbers", idx, e.target.value)
            }
            placeholder="Phone number"
            className="w-full border px-3 py-2 rounded mb-2"
          />
        ))}
        <button
          type="button"
          onClick={() => addArrayField("phoneNumbers")}
          className="text-sm text-blue-600"
        >
          + Add Phone
        </button>
      </div>

      <input
        type="text"
        name="logo"
        value={form.logo}
        onChange={handleChange}
        placeholder="Logo URL"
        className="w-full border px-3 py-2 rounded"
      />

      <div>
        <label className="block font-medium">Photos</label>
        {form.photos.map((photo, idx) => (
          <input
            key={idx}
            type="text"
            value={photo}
            onChange={(e) => handleArrayChange("photos", idx, e.target.value)}
            placeholder="Photo URL"
            className="w-full border px-3 py-2 rounded mb-2"
          />
        ))}
        <button
          type="button"
          onClick={() => addArrayField("photos")}
          className="text-sm text-blue-600"
        >
          + Add Photo
        </button>
      </div>

      <div>
        <label className="block font-medium">Attachments</label>
        {form.attachments.map((file, idx) => (
          <input
            key={idx}
            type="text"
            value={file}
            onChange={(e) =>
              handleArrayChange("attachments", idx, e.target.value)
            }
            placeholder="Attachment URL"
            className="w-full border px-3 py-2 rounded mb-2"
          />
        ))}
        <button
          type="button"
          onClick={() => addArrayField("attachments")}
          className="text-sm text-blue-600"
        >
          + Add Attachment
        </button>
      </div>

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded"
        disabled={isPending}
      >
        {isPending ? "Saving..." : "Save Nursery"}
      </button>
    </form>
  );
}
