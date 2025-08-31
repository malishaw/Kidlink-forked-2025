"use server";

import { getClient } from "@/lib/rpc/server";
import type { teacherInsertType } from "../schemas";

export async function createTeacher(data: teacherInsertType) {
  try {
    const rpcClient = await getClient();

    const response = await rpcClient.api.teacher.$post({
      json: data,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || "Failed to create teacher");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating teacher:", error);
    throw error;
  }
}
