"use client";

import { Badge } from "@repo/ui/components/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import {
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Search,
} from "lucide-react";
import { useState } from "react";

import { TeachersList } from "@/features/teachers/actions/get-teacher";

export default function AdminTeachersPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all teachers
  const { data: teachersData, isLoading: teachersLoading, error: teachersError } = TeachersList({
    page: 1,
    limit: 1000,
  });

  const teachers = Array.isArray(teachersData?.data) ? teachersData.data : [];

  // Filter teachers based on search
  const filteredTeachers = teachers.filter((teacher: any) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (teacher.name?.toLowerCase() || "").includes(searchLower) ||
      (teacher.email?.toLowerCase() || "").includes(searchLower) ||
      (teacher.phoneNumber?.toLowerCase() || "").includes(searchLower)
    );
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Teachers</h1>
          <p className="text-slate-500">Manage all teaching staff</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-full">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <div>
              <p className="text-green-100 font-medium">Total Teachers</p>
              <h3 className="text-3xl font-bold">{teachersLoading ? "..." : teachersData?.meta?.totalCount || 0}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <CardTitle>Teachers Directory</CardTitle>
              <CardDescription>
                List of all teachers across nurseries
              </CardDescription>
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search teachers..."
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b">
                <tr>
                  <th className="px-4 py-3">Teacher Name</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Address</th>
                  <th className="px-4 py-3">Joined Date</th>
                  <th className="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {teachersLoading ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-slate-500">
                      Loading teachers...
                    </td>
                  </tr>
                ) : filteredTeachers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">
                      No teachers found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredTeachers.map((teacher: any) => (
                    <tr key={teacher.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">
                            {(teacher.name?.[0] || "?").toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">{teacher.name}</div>
                            <div className="text-xs text-slate-500">ID: {teacher.id?.slice(0, 8) || "N/A"}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        <div className="space-y-0.5">
                          {teacher.email && (
                            <div className="flex items-center gap-1.5">
                              <Mail className="h-3 w-3" />
                              {teacher.email}
                            </div>
                          )}
                          {teacher.phoneNumber && (
                            <div className="flex items-center gap-1.5">
                              <Phone className="h-3 w-3" />
                              {teacher.phoneNumber}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {teacher.address ? (
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3 w-3" />
                            {teacher.address}
                          </div>
                        ) : "-"}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {teacher.createdAt ? new Date(teacher.createdAt).toLocaleDateString() : "-"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Active
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
