"use server";

import { getClient } from "@/lib/rpc/server";
import { revalidatePath } from "next/cache";
import type { EventUpdateType } from "../schemas";

type UpdateEventResult =
  | { success: true; data: any }
  | { success: false; error: string };

type Options = {
  /** Which route to revalidate after updating an event */
  revalidate?: string;
};

export async function updateEvent(
  id: string,
  data: EventUpdateType,
  opts?: Options
): Promise<UpdateEventResult> {
  try {
    // Basic validation
    if (!id) {
      return { success: false, error: "Event ID is required" };
    }

    if (!data || Object.keys(data).length === 0) {
      return { success: false, error: "No data provided for update" };
    }

    const client = await getClient();

    const response = await client.api.events[":id"].$patch({
      param: { id },
      json: data,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: (errorData as any).message || "Failed to update event",
      };
    }

    const result = await response.json();

    // Revalidate the specified path or default to events list
    const revalidatePath_ = opts?.revalidate || "/events";
    revalidatePath(revalidatePath_);

    return { success: true, data: result };
  } catch (error) {
    console.error("Error updating event:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update event",
    };
  }
}
