"use server";

import { getClient } from "@/lib/rpc/server";

type GetEventsResult =
  | { success: true; data: any[] }
  | { success: false; error: string };

export async function getEvents(): Promise<GetEventsResult> {
  try {
    const client = await getClient();

    const response = await client.api.events.$get({
      query: {},
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: (errorData as any).message || "Failed to fetch events",
      };
    }

    const result = await response.json();
    const events = result.data || [];

    return { success: true, data: events };
  } catch (error) {
    console.error("Error fetching events:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch events",
    };
  }
}
