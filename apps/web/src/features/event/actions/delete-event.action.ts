"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

type DeleteEventResult = { success: true } | { success: false; error: string };

export async function deleteEvent(id: string): Promise<DeleteEventResult> {
  try {
    if (!id) {
      return { success: false, error: "Event ID is required" };
    }

    console.log("Attempting to delete event with ID:", id);

    // Get authentication cookies
    const cookiesStore = await cookies();
    const cookieHeader = cookiesStore
      .getAll()
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");

    console.log("Using cookies for authentication");

    // Use authenticated fetch call
    const apiUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";
    const deleteUrl = `${apiUrl}/api/events/${id}`;

    console.log("Delete URL:", deleteUrl);

    const response = await fetch(deleteUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
    });

    console.log("Delete response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Delete error response:", errorData);
      return {
        success: false,
        error:
          (errorData as any).message ||
          `Failed to delete event (${response.status})`,
      };
    }

    console.log("Event deleted successfully");

    // Revalidate the page to show the updated list
    revalidatePath("/events");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Error deleting event:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete event",
    };
  }
}
