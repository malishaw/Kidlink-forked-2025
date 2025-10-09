"use client";

import { createParent } from "@/features/parents/actions/create-parent";
import { useGetParentByUserId } from "@/features/parents/actions/get-parent-by-user-id";
import { updateParent } from "@/features/parents/actions/update-parent";
import { authClient } from "@/lib/auth-client";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Skeleton } from "@repo/ui/components/skeleton";
import {
  AlertCircle,
  Edit,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function ParentParentsPage() {
  const { data: session } = authClient.useSession();
  const [activeMember, setActiveMember] = useState<any>(null);
  const [isLoadingMember, setIsLoadingMember] = useState(true);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingParent, setEditingParent] = useState<any>(null);

  // Form data
  const [createFormData, setCreateFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
  });

  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
  });

  // Loading states
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch active member to get the userId
  useEffect(() => {
    const fetchActiveMember = async () => {
      try {
        setIsLoadingMember(true);
        const response = await fetch(
          "/api/auth/organization/get-active-member"
        );
        if (response.ok) {
          const memberData = await response.json();
          setActiveMember(memberData);
        }
      } catch (error) {
        console.error("Failed to fetch active member:", error);
      } finally {
        setIsLoadingMember(false);
      }
    };
    fetchActiveMember();
  }, []);

  // Get parents by userId
  const {
    data: parentsData,
    isLoading: parentsLoading,
    error: parentsError,
    refetch: refetchParents,
  } = useGetParentByUserId(activeMember?.userId || "");

  const handleCreateFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreateFormData({
      ...createFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateParent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      await createParent({
        ...createFormData,
        userId: activeMember?.userId,
        organizationId: activeMember?.organizationId,
      });
      setIsCreateModalOpen(false);
      setCreateFormData({ name: "", email: "", phoneNumber: "", address: "" });
      refetchParents();
    } catch (error) {
      console.error("Failed to create parent:", error);
      alert("Failed to create parent");
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditParent = (parent: any) => {
    setEditingParent(parent);
    setEditFormData({
      name: parent.name,
      email: parent.email,
      phoneNumber: parent.phoneNumber,
      address: parent.address,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateParent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingParent) return;

    setIsUpdating(true);
    try {
      await updateParent(editingParent.id, editFormData);
      setIsEditModalOpen(false);
      setEditingParent(null);
      refetchParents();
    } catch (error) {
      console.error("Failed to update parent:", error);
      alert("Failed to update parent");
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoadingMember || parentsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-12 w-64" />
            <Skeleton className="h-6 w-96" />
            <Skeleton className="h-10 w-80" />
          </div>

          {/* Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6">
                <Skeleton className="h-16 w-16 rounded-full mb-4" />
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-24 mb-4" />
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (parentsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
        <Card className="p-8 text-center max-w-md">
          <div className="text-red-500 mb-4">
            <AlertCircle className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Error Loading Parents
          </h2>
          <p className="text-slate-600">{parentsError.message}</p>
        </Card>
      </div>
    );
  }

  const parents = parentsData?.data || [];
  const filteredParents = parents.filter(
    (parent: any) =>
      parent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parent.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-full">
                  <Users className="w-8 h-8" />
                </div>
                <h1 className="text-4xl font-bold">Parent Management</h1>
              </div>
              <p className="text-xl text-blue-100 max-w-2xl">
                Manage parent profiles and contact information
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge className="bg-white/20 text-white px-4 py-2 text-base font-semibold">
                {filteredParents.length}{" "}
                {filteredParents.length === 1 ? "Parent" : "Parents"}
              </Badge>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-white text-blue-600 hover:bg-blue-50"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Parent
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-8">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search parents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-white/20 rounded-xl focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-200 bg-white/10 backdrop-blur-sm text-white placeholder-white/70"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {filteredParents.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-slate-400 mb-6">
              <Users className="w-24 h-24 mx-auto" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              {searchTerm ? "No Parents Found" : "No Parents Yet"}
            </h2>
            <p className="text-slate-600 text-lg mb-6">
              {searchTerm
                ? "No parents match your search criteria."
                : "Get started by adding your first parent profile."}
            </p>
            {!searchTerm && (
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Parent
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredParents.map((parent: any) => (
              <Card
                key={parent.id}
                className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 border-0 shadow-lg"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16 ring-4 ring-blue-100 group-hover:ring-blue-200 transition-all duration-300">
                      <AvatarImage src="" alt={parent.name} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold text-xl">
                        {parent.name?.charAt(0)?.toUpperCase() || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-xl font-bold text-slate-800">
                        {parent.name}
                      </CardTitle>
                      <p className="text-slate-600 text-sm">
                        Joined {formatDate(parent.createdAt)}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditParent(parent)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Contact Information */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <Mail className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-blue-800">
                          Email
                        </p>
                        <p className="text-sm text-blue-700">{parent.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <Phone className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-green-800">
                          Phone
                        </p>
                        <p className="text-sm text-green-700">
                          {parent.phoneNumber}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                      <MapPin className="w-5 h-5 text-orange-600" />
                      <div>
                        <p className="text-sm font-medium text-orange-800">
                          Address
                        </p>
                        <p className="text-sm text-orange-700">
                          {parent.address}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create Parent Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Add New Parent
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <form onSubmit={handleCreateParent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={createFormData.name}
                  onChange={handleCreateFormChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={createFormData.email}
                  onChange={handleCreateFormChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter email address"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={createFormData.phoneNumber}
                  onChange={handleCreateFormChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={createFormData.address}
                  onChange={handleCreateFormChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter address"
                />
              </div>

              <div className="flex gap-3 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1"
                  disabled={isCreating}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  disabled={isCreating}
                >
                  {isCreating ? "Creating..." : "Create Parent"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Parent Modal */}
      {isEditModalOpen && editingParent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Edit Parent</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <form onSubmit={handleUpdateParent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditFormChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={editFormData.email}
                  onChange={handleEditFormChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter email address"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={editFormData.phoneNumber}
                  onChange={handleEditFormChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={editFormData.address}
                  onChange={handleEditFormChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter address"
                />
              </div>

              <div className="flex gap-3 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1"
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  disabled={isUpdating}
                >
                  {isUpdating ? "Updating..." : "Update Parent"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
