"use server";

import { getEvent } from "@/features/event/actions/get-event.action";
import { getClient } from "@/lib/rpc/server";
import { format } from "date-fns";
import {
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  Sparkles,
  User,
} from "lucide-react";

type EventItem = any;

async function fetchEvents(): Promise<EventItem[]> {
  const client = await getClient();
  const res = await client.api.events.$get();
  if (!res.ok) {
    const err = await res
      .json()
      .catch(() => ({ message: "Failed to load events" }));
    throw new Error(err.message || "Failed to load events");
  }
  const payload = await res.json();
  // payload may be paginated { data: [...] }
  return Array.isArray(payload) ? payload : payload?.data || [];
}

export default async function Page() {
  let events: EventItem[] = [];
  try {
    const list = await fetchEvents();

    // Use getEvent action to ensure we use the single-event action as requested.
    // We fetch details in parallel but fall back to list item if getEvent fails.
    const detailed = await Promise.all(
      list.map(async (ev: any) => {
        try {
          const r = await getEvent(ev.id);
          return r.success ? r.data : ev;
        } catch {
          return ev;
        }
      })
    );

    events = detailed;
  } catch (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-red-50 to-pink-50">
        <div className="max-w-xl text-center bg-white rounded-2xl shadow-xl p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Unable to load events
          </h2>
          <p className="text-slate-600">
            {(error as Error)?.message ||
              "Something went wrong while fetching events."}
          </p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "upcoming":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "completed":
      case "finished":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  const formatEventDate = (startDate: string, endDate: string) => {
    if (!startDate) return "Date TBA";

    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;

    if (end && start.toDateString() !== end.toDateString()) {
      return `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`;
    }

    return format(start, "MMM d, yyyy 'at' h:mm a");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-white/20 rounded-full">
                <Sparkles className="w-8 h-8" />
              </div>
              <h1 className="text-5xl font-bold">Upcoming Events</h1>
            </div>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Discover exciting events, activities, and important dates for your
              children. Join us for memorable experiences and educational
              adventures!
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-blue-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Scheduled Events</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Multiple Venues</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>All Ages Welcome</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {events.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-12 h-12 text-slate-400" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              No Events Yet
            </h2>
            <p className="text-slate-600 text-lg max-w-md mx-auto">
              Stay tuned! We'll be announcing exciting events and activities
              soon.
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">
                Join Us for Amazing Events! 🎉
              </h2>
              <p className="text-slate-600 text-lg">
                We have{" "}
                <span className="font-semibold text-purple-600">
                  {events.length}
                </span>
                {events.length === 1 ? " event" : " events"} planned for you
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event: any) => (
                <article
                  key={event.id}
                  className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0"
                >
                  {/* Event Image */}
                  <div className="relative h-48 overflow-hidden">
                    {event.coverImageUrl ? (
                      <img
                        src={event.coverImageUrl}
                        alt={event.name || "Event image"}
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="h-full bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 flex items-center justify-center">
                        <div className="text-center text-white">
                          <Calendar className="w-12 h-12 mx-auto mb-2 opacity-80" />
                          <span className="font-semibold text-lg">
                            {event.name?.slice(0, 20) || "Event"}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(event.status)}`}
                      >
                        {event.status || "Scheduled"}
                      </span>
                    </div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Event Content */}
                  <div className="p-6 space-y-4">
                    {/* Event Title */}
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors duration-200">
                        {event.name || "Untitled Event"}
                      </h3>
                      <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed">
                        {event.description ||
                          "Join us for an exciting event filled with fun activities and learning opportunities."}
                      </p>
                    </div>

                    {/* Event Details */}
                    <div className="space-y-3">
                      {/* Date & Time */}
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-blue-800">
                            Date & Time
                          </p>
                          <p className="text-sm text-blue-700">
                            {formatEventDate(event.startDate, event.endDate)}
                          </p>
                        </div>
                      </div>

                      {/* Venue */}
                      {event.venue && (
                        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                          <MapPin className="w-5 h-5 text-green-600 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-green-800">
                              Venue
                            </p>
                            <p className="text-sm text-green-700">
                              {event.venue}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Organizer */}
                      {event.organizer && (
                        <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                          <User className="w-5 h-5 text-purple-600 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-purple-800">
                              Organizer
                            </p>
                            <p className="text-sm text-purple-700">
                              {event.organizer}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Ticket Price */}
                      {event.ticketPrice && (
                        <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                          <DollarSign className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-yellow-800">
                              Ticket Price
                            </p>
                            <p className="text-sm text-yellow-700 font-semibold">
                              ${event.ticketPrice}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="pt-4">
                      <a
                        href={`/account/parent/events/${event.id}`}
                        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                      >
                        <Clock className="w-4 h-4" />
                        View Event Details
                      </a>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-gradient-to-br from-pink-200 to-purple-200 opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
                  <div className="absolute -left-4 -bottom-4 w-16 h-16 rounded-full bg-gradient-to-br from-blue-200 to-cyan-200 opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
