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
  Mail,
  Phone,
  Search,
  Users
} from "lucide-react";
import { useState } from "react";

import { ParentsList } from "@/features/parents/actions/get-parent";

export default function AdminParentsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all parents
  const { data: parentsData, isLoading: parentsLoading, error: parentsError } = ParentsList({
    page: 1,
    limit: 1000,
  });

  const parents = Array.isArray(parentsData?.data) ? parentsData.data : [];

  // Filter parents based on search
  const filteredParents = parents.filter((parent: any) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (parent.name?.toLowerCase() || "").includes(searchLower) ||
      (parent.email?.toLowerCase() || "").includes(searchLower) ||
      (parent.phoneNumber?.toLowerCase() || "").includes(searchLower)
    );
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Parents</h1>
          <p className="text-slate-500">Manage all registered parents and guardians</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-full">
              <Users className="h-8 w-8 text-white" />
            </div>
            <div>
              <p className="text-purple-100 font-medium">Total Parents</p>
              <h3 className="text-3xl font-bold">{parentsLoading ? "..." : parentsData?.meta?.totalCount || 0}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <CardTitle>Parents Directory</CardTitle>
              <CardDescription>
                List of all registered parents
              </CardDescription>
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search parents..."
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                  <th className="px-4 py-3">Parent Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Joined Date</th>
                  <th className="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {parentsLoading ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-slate-500">
                      Loading parents...
                    </td>
                  </tr>
                ) : filteredParents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">
                      No parents found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredParents.map((parent: any) => (
                    <tr key={parent.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
                            {(parent.name?.[0] || "?").toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">{parent.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Mail className="h-3 w-3" />
                          {parent.email || "N/A"}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {parent.phoneNumber ? (
                          <div className="flex items-center gap-1.5">
                            <Phone className="h-3 w-3" />
                            {parent.phoneNumber}
                          </div>
                        ) : "-"}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {parent.createdAt ? new Date(parent.createdAt).toLocaleDateString() : "-"}
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
