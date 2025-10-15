"use client";

import { deleteEvent, EventForm, getEvent } from "@/features/event";
import type { EventType } from "@/features/event/schemas";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface EventPageProps {
  params: {
    id: string;
  };
}

export default function EventPage({ params }: EventPageProps) {
  const router = useRouter();
  const [event, setEvent] = useState<EventType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadEvent();
  }, [params.id]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      const result = await getEvent(params.id);

      if (!result.success || !result.data) {
        notFound();
        return;
      }

      setEvent(result.data);
    } catch (error) {
      console.error("Failed to load event:", error);
      toast.error("Failed to load event details");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!event || isDeleting) return;

    if (!confirm(`Are you sure you want to delete "${event.name}"?`)) {
      return;
    }

    try {
      setIsDeleting(true);
      const result = await deleteEvent(event.id);

      if (result.success) {
        toast.success("Event deleted successfully");
        router.push("/events");
      } else {
        toast.error(result.error || "Failed to delete event");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete event");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!event) {
    notFound();
  }

  // Parse dates with fallback
  const eventStartDate = event.startDate ? new Date(event.startDate) : null;
  const eventEndDate = event.endDate ? new Date(event.endDate) : null;
  const isUpcoming = eventStartDate ? eventStartDate > new Date() : false;
  const isPast = eventStartDate ? eventStartDate < new Date() : false;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Navigation */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/events">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Button>
        </Link>
      </div>

      {/* Event Details */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl mb-2">{event.name}</CardTitle>
              <div className="flex items-center gap-2 mb-4">
                <Badge
                  variant={
                    isUpcoming ? "default" : isPast ? "secondary" : "outline"
                  }
                >
                  {isUpcoming ? "Upcoming" : isPast ? "Past" : "Today"}
                </Badge>
                {event.status && (
                  <Badge variant="outline">
                    {event.status.charAt(0).toUpperCase() +
                      event.status.slice(1)}
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditOpen(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Event Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {eventStartDate && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Start Date
                    </label>
                    <p className="text-lg">
                      {eventStartDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                )}

                {eventEndDate && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      End Date
                    </label>
                    <p className="text-lg">
                      {eventEndDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                )}

                {event.venue && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Venue
                    </label>
                    <p className="text-lg">{event.venue}</p>
                  </div>
                )}

                {event.ticketPrice && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Ticket Price
                    </label>
                    <p className="text-lg">{event.ticketPrice}</p>
                  </div>
                )}

                {event.organizer && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Organizer
                    </label>
                    <p className="text-lg">{event.organizer}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {event.description && (
              <div>
                <h3 className="font-semibold text-lg mb-3">Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {event.description}
                </p>
              </div>
            )}

            {/* Images */}
            {event.coverImageUrl && (
              <div>
                <h3 className="font-semibold text-lg mb-3">Cover Image</h3>
                <img
                  src={event.coverImageUrl}
                  alt={event.name}
                  className="rounded-lg max-w-md"
                />
              </div>
            )}

            {/* Metadata */}
            <div className="pt-4 border-t">
              <h3 className="font-semibold text-lg mb-3">Details</h3>
              <div className="text-sm text-gray-600 space-y-1">
                {event.createdAt && (
                  <p>
                    Created: {new Date(event.createdAt).toLocaleDateString()}
                  </p>
                )}
                {event.updatedAt && (
                  <p>
                    Last updated:{" "}
                    {new Date(event.updatedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Event Dialog */}
      {event && (
        <EventForm
          open={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          onSuccess={() => {
            setIsEditOpen(false);
            loadEvent(); // Reload event data
          }}
          initialData={event}
        />
      )}
    </div>
  );
}
