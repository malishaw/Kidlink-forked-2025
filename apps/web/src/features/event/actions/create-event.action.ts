"use server";

import { getClient } from "@/lib/rpc/server";
import { revalidatePath } from "next/cache";
import type { EventInsertType } from "../schemas";

type AddEventResult = 
  | { success: true; data: any }
  | { success: false; error: string };

type Options = {
  /** Which route to revalidate after creating an event */
  revalidate?: string;
};

export async function addEvent(data: EventInsertType, opts?: Options): Promise<AddEventResult> {
  try {
    // Basic validation
    if (!data?.name) {
      return { success: false, error: "Event name is required" };
    }

    const client = await getClient();

    const response = await client.api.events.$post({
      json: data,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { 
        success: false, 
        error: (errorData as any).message || "Failed to create event" 
      };
    }

    const result = await response.json();

    // Revalidate the specified path or default to events list
    const revalidatePath_ = opts?.revalidate || "/events";
    revalidatePath(revalidatePath_);

    return { success: true, data: result };
  } catch (error) {
    console.error("Error creating event:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to create event" 
    };
  }
}