"use client";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import {
  Baby,
  Calendar,
  Eye,
  Mail,
  Phone,
  Search
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { ChildrensList } from "@/features/children/actions/get-children";

export default function AdminChildrenPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all children
  const { data: childrenData, isLoading: childrenLoading, error: childrenError } = ChildrensList({
    page: 1,
    limit: 1000,
    search: searchTerm,
  });

  const children = Array.isArray(childrenData?.data) ? childrenData.data : [];

  // Filter children based on search
  const filteredChildren = children.filter((child: any) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (child.name?.toLowerCase() || "").includes(searchLower) ||
      (child.email?.toLowerCase() || "").includes(searchLower) ||
      (child.phoneNumber?.toLowerCase() || "").includes(searchLower)
    );
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Children</h1>
          <p className="text-slate-500">Manage all registered children</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-full">
              <Baby className="h-8 w-8 text-white" />
            </div>
            <div>
              <p className="text-blue-100 font-medium">Total Children</p>
              <h3 className="text-3xl font-bold">{childrenLoading ? "..." : childrenData?.meta?.totalCount || 0}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <CardTitle>Children Directory</CardTitle>
              <CardDescription>
                List of all children across nurseries
              </CardDescription>
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search children..."
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  <th className="px-4 py-3">Child Name</th>
                  <th className="px-4 py-3">Contact Info</th>
                  <th className="px-4 py-3">DOB</th>
                  <th className="px-4 py-3">Gender</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {childrenLoading ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-slate-500">
                      Loading children...
                    </td>
                  </tr>
                ) : filteredChildren.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">
                      No children found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredChildren.map((child: any) => (
                    <tr key={child.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                            {(child.name?.[0] || "?").toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">{child.name}</div>
                            {/* <div className="text-xs text-slate-500">ID: {child.id.slice(0, 8)}</div> */}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-0.5">
                          {child.email && (
                            <div className="flex items-center gap-1.5 text-slate-600">
                              <Mail className="h-3 w-3" />
                              {child.email}
                            </div>
                          )}
                          {child.phoneNumber && (
                            <div className="flex items-center gap-1.5 text-slate-600">
                              <Phone className="h-3 w-3" />
                              {child.phoneNumber}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {child.dateOfBirth ? (
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3 w-3" />
                            {new Date(child.dateOfBirth).toLocaleDateString()}
                          </div>
                        ) : "-"}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary" className="font-normal">
                          {child.gender || "Not specified"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Link href={`/account/manage/children/${child.id}`}>
                           <Button variant="ghost" size="sm" className="h-8 px-2 text-slate-500 hover:text-blue-600">
                            <Eye className="h-4 w-4 mr-1.5" />
                            View
                          </Button>
                        </Link>
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
