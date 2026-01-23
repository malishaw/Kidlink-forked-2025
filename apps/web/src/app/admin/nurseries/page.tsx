"use client";

import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import {
  Building2,
  MapPin,
  Phone,
  Search,
  Trash2
} from "lucide-react";
import { useState } from "react";

import { useDeleteNursery } from "@/features/nursery/actions/delete-nursery.action";
import { useGetNurseries } from "@/features/nursery/actions/get-nursery-action";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@repo/ui/components/alert-dialog";

export default function AdminNurseriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: nurseriesData, isLoading: nurseriesLoading, error: nurseriesError } = useGetNurseries();
  const deleteNurseryMutation = useDeleteNursery();

  console.log('Nurseries API Response:', nurseriesData);
  console.log('Nurseries Error:', nurseriesError);
  console.log('Nurseries Loading:', nurseriesLoading);

  const nurseries = Array.isArray(nurseriesData?.data) ? nurseriesData.data : [];

  // Filter nurseries based on search
  const filteredNurseries = nurseries.filter((nursery: any) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (nursery.title?.toLowerCase() || "").includes(searchLower) ||
      (nursery.address?.toLowerCase() || "").includes(searchLower)
    );
  });

  const handleDelete = (id: string) => {
    deleteNurseryMutation.mutate(id);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Nurseries</h1>
          <p className="text-slate-500">Manage all registered nurseries</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-full">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <div>
              <p className="text-indigo-100 font-medium">Total Nurseries</p>
              <h3 className="text-3xl font-bold">{nurseriesLoading ? "..." : nurseriesData?.meta?.totalCount || 0}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <CardTitle>Nursery Directory</CardTitle>
              <CardDescription>
                List of all nurseries in the platform
              </CardDescription>
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search nurseries..."
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  <th className="px-4 py-3">Nursery Name</th>
                  <th className="px-4 py-3">Address</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Joined Date</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {nurseriesLoading ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-slate-500">
                      Loading nurseries...
                    </td>
                  </tr>
                ) : filteredNurseries.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">
                      No nurseries found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredNurseries.map((nursery: any) => (
                    <tr key={nursery.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                            <Building2 className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">{nursery.title}</div>
                            <div className="text-xs text-slate-500 truncate max-w-[200px]">{nursery.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {nursery.address ? (
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3 w-3" />
                            {nursery.address}
                          </div>
                        ) : "-"}
                      </td>
                      <td className="px-4 py-3">
                        {nursery.phoneNumbers && nursery.phoneNumbers.length > 0 ? (
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <Phone className="h-3 w-3" />
                            {nursery.phoneNumbers[0]}
                          </div>
                        ) : "-"}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {nursery.createdAt ? new Date(nursery.createdAt).toLocaleDateString() : "-"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Nursery?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the nursery
                                  "{nursery.title}" and remove its data from our servers.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-red-500 hover:bg-red-600"
                                  onClick={() => handleDelete(nursery.id)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
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
