"use server";

import { getClient } from "@/lib/rpc/server";

type GetEventResult =
  | { success: true; data: any }
  | { success: false; error: string };

export async function getEvent(id: string): Promise<GetEventResult> {
  try {
    if (!id) {
      return { success: false, error: "Event ID is required" };
    }

    const client = await getClient();

    const response = await client.api.events[":id"].$get({
      param: { id },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: (errorData as any).message || "Failed to fetch event",
      };
    }

    const event = await response.json();

    return { success: true, data: event };
  } catch (error) {
    console.error("Error fetching event:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch event",
    };
  }
}
