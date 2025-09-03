// "use client";
// import { ChildrensList } from "@/features/children/actions/get-children";
// import { ParentsList as useParentsList } from "@/features/parents/actions/get-parent";
// import { updateParent } from "@/features/parents/actions/update-parent";
// import {
//   Avatar,
//   AvatarFallback,
//   AvatarImage,
// } from "@repo/ui/components/avatar";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@repo/ui/components/card";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { AlertCircle, CheckCircle, Users } from "lucide-react";
// import { useParams } from "next/navigation";
// import { useState } from "react";

// export default function Page() {
//   const params = useParams();
//   const id = params?.id as string;
//   const queryClient = useQueryClient();
//   const { data, isLoading, error } = useParentsList({});
//   const parent = data?.data?.find((p: any) => p.id === id);

//   // Student list for assignment
//   const {
//     data: childrenData,
//     isLoading: isChildrenLoading,
//     error: childrenError,
//   } = ChildrensList({});
//   const childrenList = childrenData?.data || [];

//   // State for selected children
//   const [selectedChildren, setSelectedChildren] = useState<string[]>([]);

//   // Mutation for updating parent
//   const mutation = useMutation({
//     mutationFn: async (childIds: string[]) => {
//       // parentUpdateType expects childId (single value)
//       return await updateParent(id, { childId: childIds[0] });
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["parents"] });
//       queryClient.invalidateQueries({ queryKey: ["children"] });
//       setSelectedChildren([]);
//     },
//   });

//   if (isLoading || isChildrenLoading) {
//     return <div className="p-8 text-center">Loading...</div>;
//   }
//   if (error || childrenError) {
//     return (
//       <div className="p-8 text-center text-red-600">
//         Error: {error?.message || childrenError?.message}
//       </div>
//     );
//   }
//   if (!parent) {
//     return <div className="p-8 text-center">No parent found.</div>;
//   }

//   // Handler for assigning children
//   const handleAssignChildren = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (selectedChildren.length) {
//       mutation.mutate(selectedChildren);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
//       <Card className="max-w-lg w-full bg-white/80 rounded-3xl shadow-xl p-8">
//         <CardHeader className="flex items-center gap-4">
//           <Avatar className="h-20 w-20 shadow-lg ring-4 ring-white">
//             <AvatarImage src={parent.avatar || "/placeholder.svg"} />
//             <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold text-lg">
//               {parent.name
//                 .split(" ")
//                 .map((n: string) => n[0])
//                 .join("")}
//             </AvatarFallback>
//           </Avatar>
//           <div>
//             <CardTitle className="text-2xl font-bold text-gray-800">
//               {parent.name}
//             </CardTitle>
//             <p className="text-sm text-gray-600">{parent.email}</p>
//             <p className="text-sm text-gray-600">{parent.phoneNumber}</p>
//             <p className="text-sm text-gray-600">{parent.address}</p>
//             <p className="text-xs text-gray-400">
//               Created: {new Date(parent.createdAt).toLocaleString()}
//             </p>
//             <p className="text-xs text-gray-400">
//               Updated: {new Date(parent.updatedAt).toLocaleString()}
//             </p>
//           </div>
//         </CardHeader>
//         <CardContent className="mt-4">
//           <h4 className="font-semibold mb-2">Children</h4>
//           <ul className="space-y-2">
//             {parent.children?.length ? (
//               parent.children.map((child: any) => (
//                 <li key={child.id} className="flex items-center gap-3">
//                   <Avatar className="h-8 w-8">
//                     <AvatarImage src={child.avatar || "/placeholder.svg"} />
//                     <AvatarFallback>
//                       {child.name
//                         .split(" ")
//                         .map((n: string) => n[0])
//                         .join("")}
//                     </AvatarFallback>
//                   </Avatar>
//                   <span className="font-medium text-gray-800">
//                     {child.name}
//                   </span>
//                   <span className="text-xs text-gray-500">{child.class}</span>
//                 </li>
//               ))
//             ) : (
//               <li className="text-gray-500">No children assigned</li>
//             )}
//           </ul>
//         </CardContent>
//       </Card>

//       {/* Separate section to assign children to parent (styled like Assign Parent/Class) */}
//       <Card className="max-w-lg w-full bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl mt-8">
//         <CardHeader className="pb-4">
//           <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-3">
//             <div className="p-2 bg-blue-100 rounded-lg">
//               <Users className="w-6 h-6 text-blue-600" />
//             </div>
//             Assign Student
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <form onSubmit={handleAssignChildren}>
//             <div className="space-y-2 mb-4">
//               <label className="text-sm font-medium text-slate-700">
//                 Select Student
//               </label>
//               <select
//                 className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                 value={selectedChildren[0] || ""}
//                 onChange={(e) => setSelectedChildren([e.target.value])}
//               >
//                 <option value="">Choose a student...</option>
//                 {childrenList.map((child: any) => (
//                   <option key={child.id} value={child.id}>
//                     {child.name} ({child.class})
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <button
//               type="submit"
//               className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
//               disabled={mutation.isPending || !selectedChildren[0]}
//             >
//               {mutation.isPending ? (
//                 <>
//                   <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                   Assigning...
//                 </>
//               ) : (
//                 <>
//                   <Users className="w-4 h-4" />
//                   Assign Student
//                 </>
//               )}
//             </button>
//             {mutation.isError && (
//               <div className="p-3 bg-red-50 border border-red-200 rounded-lg mt-2">
//                 <p className="text-red-700 text-sm flex items-center gap-2">
//                   <AlertCircle className="w-4 h-4" />
//                   {mutation.error?.message}
//                 </p>
//               </div>
//             )}
//             {mutation.isSuccess && (
//               <div className="p-3 bg-green-50 border border-green-200 rounded-lg mt-2">
//                 <p className="text-green-700 text-sm flex items-center gap-2">
//                   <CheckCircle className="w-4 h-4" />
//                   Student assigned successfully!
//                 </p>
//               </div>
//             )}
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

"use client";
import { ChildrensList } from "@/features/children/actions/get-children";
import type React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/components/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/card";
import { ParentsList as useParentsList } from "@/features/parents/actions/get-parent";
import { updateParent } from "@/features/parents/actions/update-parent";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Mail,
  MapPin,
  Phone,
  UserCheck,
  Users,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const params = useParams();
  const id = params?.id as string;
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useParentsList({});
  const parent = data?.data?.find((p: any) => p.id === id);

  // Student list for assignment
  const {
    data: childrenData,
    isLoading: isChildrenLoading,
    error: childrenError,
  } = ChildrensList({});
  const childrenList = childrenData?.data || [];

  // State for selected children
  const [selectedChildren, setSelectedChildren] = useState<string[]>([]);

  // Mutation for updating parent
  const mutation = useMutation({
    mutationFn: async (childIds: string[]) => {
      // parentUpdateType expects childId (single value)
      return await updateParent(id, { childId: childIds[0] });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parents"] });
      queryClient.invalidateQueries({ queryKey: ["children"] });
      setSelectedChildren([]);
    },
  });

  if (isLoading || isChildrenLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-600 font-medium">
            Loading parent details...
          </p>
        </div>
      </div>
    );
  }

  if (error || childrenError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Error Loading Data
            </h3>
            <p className="text-red-600">
              {error?.message || childrenError?.message}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!parent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
            <Users className="w-8 h-8 text-slate-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Parent Not Found
            </h3>
            <p className="text-slate-600">
              The requested parent could not be found.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Handler for assigning children
  const handleAssignChildren = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedChildren.length) {
      mutation.mutate(selectedChildren);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24 shadow-lg ring-4 ring-white/20">
                <AvatarImage src={parent.avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-white/20 text-white font-bold text-xl">
                  {parent.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{parent.name}</h1>
                <div className="flex items-center gap-2 text-blue-100">
                  <UserCheck className="w-4 h-4" />
                  <span className="text-sm">Parent Profile</span>
                </div>
              </div>
            </div>
          </div>

          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Mail className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide">
                        Email
                      </p>
                      <p className="font-medium text-slate-800">
                        {parent.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Phone className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide">
                        Phone
                      </p>
                      <p className="font-medium text-slate-800">
                        {parent.phoneNumber}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <MapPin className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide">
                        Address
                      </p>
                      <p className="font-medium text-slate-800">
                        {parent.address}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                  Account Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Calendar className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide">
                        Created
                      </p>
                      <p className="font-medium text-slate-800">
                        {new Date(parent.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Calendar className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wide">
                        Last Updated
                      </p>
                      <p className="font-medium text-slate-800">
                        {new Date(parent.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                Assigned Children
              </h3>
              {parent.children?.length ? (
                <div className="grid gap-3">
                  {parent.children.map((child: any) => (
                    <div
                      key={child.id}
                      className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100"
                    >
                      <Avatar className="h-12 w-12 shadow-md">
                        <AvatarImage src={child.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-500 text-white font-semibold">
                          {child.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-800">
                          {child.name}
                        </p>
                        <p className="text-sm text-slate-600">{child.class}</p>
                      </div>
                      <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                        Active
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-slate-50 rounded-xl">
                  <Users className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">
                    No children assigned yet
                  </p>
                  <p className="text-sm text-slate-400">
                    Use the form below to assign a student
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              Assign Student
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleAssignChildren}>
              <div className="space-y-2 mb-4">
                <label className="text-sm font-medium text-slate-700">
                  Select Student
                </label>
                <select
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={selectedChildren[0] || ""}
                  onChange={(e) => setSelectedChildren([e.target.value])}
                >
                  <option value="">Choose a student...</option>
                  {childrenList.map((child: any) => (
                    <option key={child.id} value={child.id}>
                      {child.name} ({child.class})
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                disabled={mutation.isPending || !selectedChildren[0]}
              >
                {mutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Assigning...
                  </>
                ) : (
                  <>
                    <Users className="w-4 h-4" />
                    Assign Student
                  </>
                )}
              </button>
              {mutation.isError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg mt-2">
                  <p className="text-red-700 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {mutation.error?.message}
                  </p>
                </div>
              )}
              {mutation.isSuccess && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg mt-2">
                  <p className="text-green-700 text-sm flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Student assigned successfully!
                  </p>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
