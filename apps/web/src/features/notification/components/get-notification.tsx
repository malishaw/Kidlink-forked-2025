// "use client";

// import { Badge } from "@repo/ui/components/badge";
// import { Button } from "@repo/ui/components/button";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@repo/ui/components/card";
// import { Bell, Calendar, DollarSign, Info, Loader2, Users } from "lucide-react";
// import { useEffect, useState } from "react";
// import { useGetNotifications } from "../actions/get-notification";

// type NotificationStatus =
//   | "event"
//   | "parents meeting"
//   | "fund collection"
//   | "others";

// interface Notification {
//   id: string;
//   type: NotificationStatus;
//   senderId: string;
//   receiverId: string[];
//   topic: string;
//   description: string;
//   createdAt: string | null;
// }

// export default function GetNotificationsList({
//   refreshTrigger,
// }: {
//   refreshTrigger?: number; // allows reloading when new notifications are sent
// }) {
//   const [page, setPage] = useState(1);
//   const limit = 10;

//   const { data, isLoading, isError, refetch } = useGetNotifications({
//     page,
//     limit,
//     search: "",
//     sort: "desc",
//   });

//   // Re-fetch whenever `refreshTrigger` changes
//   useEffect(() => {
//     if (refreshTrigger !== undefined) {
//       refetch();
//     }
//   }, [refreshTrigger, refetch]);

//   const meta = data?.meta;
//   const hasNextPage = meta ? meta.currentPage < meta.totalPages : false;
//   const hasPrevPage = meta ? meta.currentPage > 1 : false;

//   const getTypeIcon = (type: NotificationStatus) => {
//     switch (type) {
//       case "event":
//         return <Calendar className="h-4 w-4" />;
//       case "parents meeting":
//         return <Users className="h-4 w-4" />;
//       case "fund collection":
//         return <DollarSign className="h-4 w-4" />;
//       case "others":
//         return <Info className="h-4 w-4" />;
//       default:
//         return <Bell className="h-4 w-4" />;
//     }
//   };

//   const getTypeColor = (type: NotificationStatus) => {
//     switch (type) {
//       case "event":
//         return "bg-blue-500/10 text-blue-600 border-blue-200";
//       case "parents meeting":
//         return "bg-green-500/10 text-green-600 border-green-200";
//       case "fund collection":
//         return "bg-orange-500/10 text-orange-600 border-orange-200";
//       case "others":
//         return "bg-purple-500/10 text-purple-600 border-purple-200";
//       default:
//         return "bg-gray-500/10 text-gray-600 border-gray-200";
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center py-10">
//         <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="text-center text-red-500 py-6">
//         Failed to load notifications.
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-4">
//       {data?.data?.length ? (
//         <>
//           {data.data.map((n: notification) => (
//             <Card
//               key={n.id}
//               className="shadow-sm border-0 bg-white/70 backdrop-blur-sm hover:shadow-md transition"
//             >
//               <CardHeader className="flex flex-row items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <div className={`p-2 rounded-lg ${getTypeColor(n.type)}`}>
//                     {getTypeIcon(n.type)}
//                   </div>
//                   <CardTitle className="text-lg">{n.topic}</CardTitle>
//                 </div>
//                 <Badge variant="outline" className="capitalize">
//                   {n.type}
//                 </Badge>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-gray-600 mb-2">{n.description}</p>
//                 <p className="text-xs text-gray-400">
//                   {n.createdAt
//                     ? new Date(n.createdAt).toLocaleString()
//                     : "No date"}
//                 </p>
//               </CardContent>
//             </Card>
//           ))}

//           {/* Pagination */}
//           {meta && (
//             <div className="flex justify-between items-center pt-4">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 disabled={!hasPrevPage}
//                 onClick={() => setPage((p) => Math.max(p - 1, 1))}
//               >
//                 Previous
//               </Button>
//               <span className="text-sm text-gray-600">
//                 Page {meta.currentPage} of {meta.totalPages}
//               </span>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 disabled={!hasNextPage}
//                 onClick={() => setPage((p) => p + 1)}
//               >
//                 Next
//               </Button>
//             </div>
//           )}
//         </>
//       ) : (
//         <p className="text-gray-500 text-center py-6">
//           No notifications found.
//         </p>
//       )}
//     </div>
//   );
// }
"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useGetNotifications } from "../actions/get-notification";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  createdAt: string;
  read: boolean;
}

const GetNotification: React.FC = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search] = useState("");
  const [sort] = useState<"desc" | "asc">("desc");

  const { data, isLoading, error, refetch } = useGetNotifications({
    page,
    limit,
    search: search || null,
    sort,
  });

  const [notifications, setNotifications] = useState<Notification[]>(
    data?.data?.map((n: any) => ({
      id: n.id,
      title: n.topic,
      message: n.description,
      type: "info",
      createdAt: n.createdAt ?? new Date().toISOString(),
      read: false,
    })) ?? []
  );

  React.useEffect(() => {
    if (data?.data) {
      setNotifications(
        data.data.map((n: any) => ({
          id: n.id,
          title: n.topic,
          message: n.description,
          type: "info",
          createdAt: n.createdAt ?? new Date().toISOString(),
          read: false,
        }))
      );
    }
  }, [data]);

  const totalPages = data?.totalPages || 1;
  const totalCount = data?.total || 0;

  const getNotificationTypeColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-100 border-green-500 text-green-700";
      case "warning":
        return "bg-yellow-100 border-yellow-500 text-yellow-700";
      case "error":
        return "bg-red-100 border-red-500 text-red-700";
      default:
        return "bg-blue-100 border-blue-500 text-blue-700";
    }
  };

  const handleUpdate = (id: string) => {
    router.push(`/notifications/update/${id}`);
  };

  const deleteNotification = (id: string) => {
    // Remove from UI instantly
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading notifications...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error.message}</span>
        <button
          onClick={() => refetch()}
          className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-600 mt-1">
            {totalCount} total notifications
          </p>
        </div>

        {/* List */}
        <div className="px-6 py-4">
          {notifications.length === 0 ? (
            <p className="text-center text-gray-500">No notifications found</p>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`border-l-4 p-4 rounded-r-lg ${getNotificationTypeColor(
                    notification.type
                  )} ${!notification.read ? "font-medium" : "opacity-75"}`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {notification.title}
                      </h3>
                      <p>{notification.message}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdate(notification.id)}
                        className="px-3 py-1 bg-black hover:bg-gray-800 text-white text-sm rounded"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GetNotification;
