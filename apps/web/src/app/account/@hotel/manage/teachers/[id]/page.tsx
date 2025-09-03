// "use client";
// import { ClassesList } from "@/features/teachers/actions/get-class";
// import { TeachersList as useTeachersList } from "@/features/teachers/actions/get-teacher";
// import { updateTeacher } from "@/features/teachers/actions/update-teacher";
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
// import { Award, Users } from "lucide-react";
// import { useParams } from "next/navigation";
// import { useState } from "react";

// // All hooks must be inside the Page component
// export default function Page() {
//   const params = useParams();
//   const id = params?.id as string;
//   const queryClient = useQueryClient();
//   const { data, isLoading, error } = useTeachersList({});
//   const teacher = data?.data?.find((t: any) => t.id === id);

//   // Get all classes
//   const {
//     data: classesData,
//     isLoading: isClassesLoading,
//     error: classesError,
//   } = ClassesList({});
//   const classes = classesData?.data || [];

//   // State for selected class
//   const [selectedClassId, setSelectedClassId] = useState("");

//   // Mutation for updating teacher
//   const mutation = useMutation({
//     mutationFn: async (classId: string) => {
//       // Only send classId, matching your API usage
//       return await updateTeacher(id, { classId });
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["teacher"] });
//       queryClient.invalidateQueries({ queryKey: ["classes"] });
//       setSelectedClassId("");
//     },
//   });

//   // Handler for assigning class
//   const handleAssignClass = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (selectedClassId) {
//       mutation.mutate(selectedClassId);
//     }
//   };

//   let content;
//   if (isLoading || isClassesLoading) {
//     content = (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
//         <div className="flex flex-col items-center gap-4">
//           <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
//           <p className="text-slate-600 font-medium">
//             Loading teacher details...
//           </p>
//         </div>
//       </div>
//     );
//   } else if (error || classesError) {
//     content = (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 p-6">
//         <Card className="max-w-md w-full border-red-200 bg-white shadow-lg">
//           <CardContent className="flex flex-col items-center gap-4 p-8">
//             <Award className="w-12 h-12 text-red-500" />
//             <div className="text-center">
//               <h3 className="text-lg font-semibold text-red-800 mb-2">
//                 Error Loading Data
//               </h3>
//               <p className="text-red-600">
//                 {error?.message || classesError?.message}
//               </p>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   } else if (!teacher) {
//     content = (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 p-6">
//         <Card className="max-w-md w-full bg-white shadow-lg">
//           <CardContent className="flex flex-col items-center gap-4 p-8">
//             <Users className="w-12 h-12 text-slate-400" />
//             <div className="text-center">
//               <h3 className="text-lg font-semibold text-slate-800 mb-2">
//                 Teacher Not Found
//               </h3>
//               <p className="text-slate-600">
//                 No details found for this teacher.
//               </p>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   } else {
//     content = (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
//         <Card className="max-w-lg w-full bg-white/80 rounded-3xl shadow-xl p-8">
//           <CardHeader className="flex items-center gap-4">
//             <Avatar className="h-20 w-20 shadow-lg ring-4 ring-white">
//               <AvatarImage src={teacher.avatar || "/placeholder.svg"} />
//               <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold text-lg">
//                 {teacher.name
//                   .split(" ")
//                   .map((n: string) => n[0])
//                   .join("")}
//               </AvatarFallback>
//             </Avatar>
//             <div>
//               <CardTitle className="text-2xl font-bold text-gray-800">
//                 {teacher.name}
//               </CardTitle>
//               <p className="text-sm text-gray-600">{teacher.email}</p>
//               <p className="text-sm text-gray-600">{teacher.phoneNumber}</p>
//               <p className="text-sm text-gray-600">{teacher.address}</p>
//               <p className="text-xs text-gray-400">
//                 Organization: {teacher.organizationId}
//               </p>
//               <p className="text-xs text-gray-400">
//                 Created: {new Date(teacher.createdAt).toLocaleString()}
//               </p>
//               <p className="text-xs text-gray-400">
//                 Updated: {new Date(teacher.updatedAt).toLocaleString()}
//               </p>
//             </div>
//           </CardHeader>
//           <CardContent className="mt-4">
//             {/* Assign Class Section */}
//             <form onSubmit={handleAssignClass} className="mb-8">
//               <h4 className="font-semibold mb-2">Assign Class</h4>
//               <div className="mb-4">
//                 <select
//                   value={selectedClassId}
//                   onChange={(e) => setSelectedClassId(e.target.value)}
//                   className="w-full border rounded p-2"
//                 >
//                   <option value="">Select a class</option>
//                   {classes.map((cls: any) => (
//                     <option key={cls.id} value={cls.id}>
//                       {cls.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <button
//                 type="submit"
//                 className="bg-blue-600 text-white px-4 py-2 rounded shadow"
//                 disabled={mutation.isPending || !selectedClassId}
//               >
//                 {mutation.isPending ? "Assigning..." : "Assign Class"}
//               </button>
//               {mutation.isError && (
//                 <div className="text-red-600 mt-2">
//                   {mutation.error?.message}
//                 </div>
//               )}
//               {mutation.isSuccess && (
//                 <div className="text-green-600 mt-2">
//                   Class assigned successfully!
//                 </div>
//               )}
//             </form>

//             <h4 className="font-semibold mb-2">Students</h4>
//             <ul className="space-y-2">
//               {teacher.children?.length ? (
//                 teacher.children.map((child: any) => (
//                   <li key={child.id} className="flex items-center gap-3">
//                     <Avatar className="h-8 w-8">
//                       <AvatarImage src={child.avatar || "/placeholder.svg"} />
//                       <AvatarFallback>
//                         {child.name
//                           .split(" ")
//                           .map((n: string) => n[0])
//                           .join("")}
//                       </AvatarFallback>
//                     </Avatar>
//                     <span className="font-medium text-gray-800">
//                       {child.name}
//                     </span>
//                     <span className="text-xs text-gray-500">{child.class}</span>
//                   </li>
//                 ))
//               ) : (
//                 <li className="text-gray-500">No students assigned</li>
//               )}
//             </ul>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   return content;
// }

"use client";
import { ClassesList } from "@/features/teachers/actions/get-class";
import type React from "react";

import { TeachersList as useTeachersList } from "@/features/teachers/actions/get-teacher";
import { updateTeacher } from "@/features/teachers/actions/update-teacher";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Award,
  Building,
  Calendar,
  GraduationCap,
  Loader2,
  Mail,
  MapPin,
  Phone,
  UserCheck,
  Users,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

// All hooks must be inside the Page component
export default function Page() {
  const params = useParams();
  const id = params?.id as string;
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useTeachersList({});
  const teacher = data?.data?.find((t: any) => t.id === id);

  // Get all classes
  const {
    data: classesData,
    isLoading: isClassesLoading,
    error: classesError,
  } = ClassesList({});
  const classes = classesData?.data || [];

  // State for selected class
  const [selectedClassId, setSelectedClassId] = useState("");

  // Mutation for updating teacher
  const mutation = useMutation({
    mutationFn: async (classId: string) => {
      // Only send classId, matching your API usage
      return await updateTeacher(id, { classId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher"] });
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      setSelectedClassId("");
    },
  });

  // Handler for assigning class
  const handleAssignClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedClassId) {
      mutation.mutate(selectedClassId);
    }
  };

  let content;
  if (isLoading || isClassesLoading) {
    content = (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 p-6">
        <Card className="max-w-md w-full bg-white/90 backdrop-blur-sm border-0 shadow-2xl rounded-3xl">
          <CardContent className="flex flex-col items-center gap-6 p-12">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
              <GraduationCap className="w-8 h-8 text-emerald-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                Loading Teacher Details
              </h3>
              <p className="text-slate-600">
                Please wait while we fetch the information...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  } else if (error || classesError) {
    content = (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 p-6">
        <Card className="max-w-md w-full border-0 bg-white/90 backdrop-blur-sm shadow-2xl rounded-3xl">
          <CardContent className="flex flex-col items-center gap-6 p-12">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <Award className="w-8 h-8 text-red-600" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-red-800 mb-2">
                Error Loading Data
              </h3>
              <p className="text-red-600 leading-relaxed">
                {error?.message ||
                  classesError?.message ||
                  "Something went wrong while loading teacher details."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  } else if (!teacher) {
    content = (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 p-6">
        <Card className="max-w-md w-full bg-white/90 backdrop-blur-sm border-0 shadow-2xl rounded-3xl">
          <CardContent className="flex flex-col items-center gap-6 p-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-slate-500" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                Teacher Not Found
              </h3>
              <p className="text-slate-600 leading-relaxed">
                We couldn't find any details for this teacher. Please check the
                ID and try again.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  } else {
    content = (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Teacher Profile Header */}
          <Card className="bg-gradient-to-r from-emerald-600 to-teal-600 border-0 shadow-2xl rounded-3xl overflow-hidden">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <Avatar className="h-24 w-24 shadow-2xl ring-4 ring-white/30">
                  <AvatarImage src={teacher.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-white/20 text-white font-bold text-2xl backdrop-blur-sm">
                    {teacher.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center md:text-left">
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {teacher.name}
                  </h1>
                  <div className="flex flex-wrap gap-4 text-white/90">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{teacher.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{teacher.phoneNumber}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Information */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-slate-800">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                  </div>
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <MapPin className="w-5 h-5 text-slate-500" />
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Address
                    </p>
                    <p className="text-slate-600">{teacher.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <Building className="w-5 h-5 text-slate-500" />
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Organization
                    </p>
                    <p className="text-slate-600">{teacher.organizationId}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Details */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-slate-800">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  Account Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <Calendar className="w-5 h-5 text-slate-500" />
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Created
                    </p>
                    <p className="text-slate-600">
                      {new Date(teacher.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <Calendar className="w-5 h-5 text-slate-500" />
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Last Updated
                    </p>
                    <p className="text-slate-600">
                      {new Date(teacher.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Class Assignment */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-slate-800">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-purple-600" />
                </div>
                Assign Class
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAssignClass} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Select Class
                  </label>
                  <select
                    value={selectedClassId}
                    onChange={(e) => setSelectedClassId(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  >
                    <option value="">Choose a class to assign...</option>
                    {classes.map((cls: any) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  disabled={mutation.isPending || !selectedClassId}
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Assigning Class...
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-4 h-4" />
                      Assign Class
                    </>
                  )}
                </button>

                {mutation.isError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-red-700 text-sm font-medium">
                      {mutation.error?.message ||
                        "Failed to assign class. Please try again."}
                    </p>
                  </div>
                )}

                {mutation.isSuccess && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <p className="text-emerald-700 text-sm font-medium flex items-center gap-2">
                      <UserCheck className="w-4 h-4" />
                      Class assigned successfully!
                    </p>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Students List */}
          {/* <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-slate-800">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-orange-600" />
                </div>
                Students ({teacher.children?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {teacher.children?.length ? (
                <div className="grid gap-4">
                  {teacher.children.map((child: any) => (
                    <div
                      key={child.id}
                      className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                    >
                      <Avatar className="h-12 w-12 shadow-md">
                        <AvatarImage src={child.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-gradient-to-br from-orange-400 to-pink-400 text-white font-medium">
                          {child.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-800">
                          {child.name}
                        </h4>
                        <p className="text-sm text-slate-600">{child.class}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-500 font-medium">
                    No students assigned yet
                  </p>
                  <p className="text-slate-400 text-sm mt-1">
                    Students will appear here once assigned to this teacher
                  </p>
                </div>
              )}
            </CardContent>
          </Card> */}
        </div>
      </div>
    );
  }

  return content;
}
