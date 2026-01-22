"use client";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { CalendarDays, Edit, MapPin, Trash2, User, X } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteEvent } from "../actions/delete-event.action";
import type { EventType } from "../schemas";

interface EventCardProps {
  event: EventType;
  onEdit?: (event: EventType) => void;
  onDelete?: () => void;
}

export function EventCard({ event, onEdit, onDelete }: EventCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const result = await deleteEvent(event.id);

        if (result.success) {
          toast.success("Event deleted successfully");
          setShowDeleteDialog(false);
          onDelete?.(); // Call the refresh callback
        } else {
          toast.error(result.error || "Failed to delete event");
        }
      } catch (error) {
        console.error("Delete error in component:", error);
        toast.error("Failed to delete event");
      }
    });
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not set";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  return (
    <>
      <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
        {/* Cover Image */}
        {event.coverImageUrl && (
          <div className="w-full h-48 overflow-hidden rounded-t-lg">
            <img
              src={event.coverImageUrl}
              alt={event.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        )}

        <CardHeader>
          <div className="flex justify-between items-start gap-2">
            <CardTitle className="line-clamp-2 text-lg">{event.name}</CardTitle>
            <Badge variant="outline" className={getStatusColor(event.status)}>
              published
            </Badge>
          </div>
          {event.description && (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {event.description}
            </p>
          )}
        </CardHeader>

        <CardContent className="flex-1 space-y-3">
          {event.startDate && (
            <div className="flex items-center gap-2 text-sm">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <span>Starts: {formatDate(event.startDate)}</span>
            </div>
          )}

          {event.endDate && (
            <div className="flex items-center gap-2 text-sm">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <span>Ends: {formatDate(event.endDate)}</span>
            </div>
          )}

          {event.venue && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{event.venue}</span>
            </div>
          )}

          {event.organizer && (
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{event.organizer}</span>
            </div>
          )}

          {event.ticketPrice && (
            <div className="text-sm">
              <span className="font-medium">Price: </span>
              <span>${event.ticketPrice}</span>
            </div>
          )}

          {event.description&& (
            <div>
              <span className="line-clamp-4" >{event.description}</span>
            </div>
          )}
        </CardContent>

        <CardFooter className="gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit?.(event)}
            className="flex-1"
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
            className="flex-1 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </CardFooter>
      </Card>

      {/* Simple Delete Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Delete Event</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowDeleteDialog(false)}
                disabled={isPending}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Are you sure you want to delete "{event.name}"? This action
                cannot be undone.
              </p>
            </CardContent>
            <CardFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
                disabled={isPending}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                disabled={isPending}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                {isPending ? "Deleting..." : "Delete"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
}
