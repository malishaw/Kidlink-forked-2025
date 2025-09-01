"use server";

import { getClient } from "@/lib/rpc/server";
import type { teacherUpdateType } from "../schemas"; // make sure you have this type

export async function updateTeacher(id: string, data: teacherUpdateType) {
  const rpcClient = await getClient();

  const response = await rpcClient.api.teacher[":id"].$patch({
    param: { id },
    json: data,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Unknown error");
  }

  const updatedTeacher = await response.json();
  return updatedTeacher;
}
