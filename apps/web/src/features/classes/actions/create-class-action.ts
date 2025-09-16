"use server";

import { getClient } from "@/lib/rpc/server";

export interface Class {
  id: string;
  nurseryId: string;
  name: string;
  mainTeacherId?: string | null;
  teacherIds: string[];
  childIds: string[];
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface CreateClassInput {
  nurseryId: string;
  name: string;
  mainTeacherId?: string | null;
  teacherIds?: string[];
  childIds?: string[];
}

export async function createClass(data: CreateClassInput) {
  try {
    const rpcClient = await getClient();

    // Ensure required fields are present
    if (!data.nurseryId) {
      throw new Error("Nursery ID is required");
    }

    if (!data.name?.trim()) {
      throw new Error("Class name is required");
    }

    const response = await rpcClient.api.classes.$post({
      json: {
        nurseryId: data.nurseryId,
        name: data.name.trim(),
        mainTeacherId: data.mainTeacherId || null,
        teacherIds: data.teacherIds ?? [],
        childIds: data.childIds ?? [],
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || "Failed to create class");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating class:", error);
    throw error;
  }
}
