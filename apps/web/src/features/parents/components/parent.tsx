"use client";

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
import {
  AlertCircle,
  Eye,
  Mail,
  MapPin,
  Phone,
  Search,
  Users,
} from "lucide-react";
import { useState } from "react";

import { createParent } from "@/features/parents/actions/create-parent"; // your async create function
import { ParentsList as useParentsList } from "@/features/parents/actions/get-parent";

export function ParentsList() {
  const [selectedChild, setSelectedChild] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading, error } = useParentsList({});

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    avatar: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createParent(formData); // call your backend
      setIsModalOpen(false);
      setFormData({
        name: "",
        email: "",
        phoneNumber: "",
        address: "",
        avatar: "",
      });
      window.location.reload(); // reload list after creation
    } catch (err) {
      console.error(err);
      alert("Failed to create parent");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center py-20 space-y-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-300 rounded-full animate-spin animate-reverse"></div>
        </div>
        <div className="text-center space-y-2">
          <p className="text-lg font-medium text-gray-700">
            Loading parents...
          </p>
          <p className="text-sm text-gray-500">
            Please wait while we fetch parent information
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-red-50 via-pink-50 to-red-100 border border-red-200 rounded-2xl p-8 text-center shadow-lg">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full mb-6 shadow-inner">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-xl font-bold text-red-800 mb-3">
          Failed to load parents
        </h3>
        <p className="text-red-600 mb-6 max-w-md mx-auto">
          Error: {error.message}
        </p>
      </div>
    );
  }

  const parentsData = data?.data || [];

  const filteredParents = parentsData.filter(
    (parent: any) =>
      parent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parent.children?.some((child: any) =>
        child.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 via-white to-purple-50 rounded-2xl p-8 shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl shadow-sm">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Parents List
              </h2>
            </div>
            <p className="text-gray-600">
              Manage and view all parent information
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 text-base font-semibold shadow-md">
              {filteredParents.length}{" "}
              {filteredParents.length === 1 ? "Family" : "Parents"}
            </Badge>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
            >
              + Create Parent
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search parents or children..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Create Parent Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-lg relative">
            <h2 className="text-2xl font-bold mb-4">Create New Parent</h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleFormChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleFormChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2"
                required
              />
              <input
                type="text"
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleFormChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2"
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleFormChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2"
              />
              <input
                type="text"
                name="avatar"
                placeholder="Avatar URL"
                value={formData.avatar}
                onChange={handleFormChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2"
              />
              <div className="flex justify-end gap-4 mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save Parent"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Parents Grid */}
      {filteredParents.length === 0 ? (
        <div className="bg-gradient-to-br from-gray-50 via-white to-gray-100 rounded-2xl p-12 text-center shadow-lg border border-gray-200">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-6 shadow-inner">
            <Users className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">
            No parents found
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            {searchTerm
              ? "No parents match your search criteria."
              : "No parents have been added yet."}
          </p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredParents.map((parent: any) => (
            <Card
              key={parent.id}
              className="group relative overflow-hidden border-0 bg-gradient-to-br from-white via-gray-50 to-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 rounded-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-transparent to-purple-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <CardHeader className="relative z-10 pb-6">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Avatar className="h-16 w-16 shadow-lg ring-4 ring-white group-hover:ring-blue-100 transition-all duration-300">
                      <AvatarImage
                        src={
                          parent.avatar ||
                          `/parent-.png?height=64&width=64&query=parent ${parent.name}`
                        }
                      />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-lg font-bold">
                        {parent.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-blue-700 transition-colors duration-200">
                      {parent.name}
                    </CardTitle>
                    <p className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full inline-block mt-1">
                      Parent
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="relative z-10 space-y-6">
                {/* Contact Information */}
                <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 space-y-3">
                  <div className="flex items-center text-gray-700 group-hover:text-gray-800 transition-colors duration-200">
                    <div className="p-2 bg-blue-100 rounded-lg mr-3">
                      <Mail className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium truncate">
                      {parent.email}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-700 group-hover:text-gray-800 transition-colors duration-200">
                    <div className="p-2 bg-green-100 rounded-lg mr-3">
                      <Phone className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-sm font-medium">
                      {parent.phoneNumber}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-700 group-hover:text-gray-800 transition-colors duration-200">
                    <div className="p-2 bg-orange-100 rounded-lg mr-3">
                      <MapPin className="h-4 w-4 text-orange-600" />
                    </div>
                    <span className="text-sm font-medium truncate">
                      {parent.address}
                    </span>
                  </div>
                </div>

                {/* Children Section */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4">
                  <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    Children ({parent.children?.length || 0})
                  </h4>
                  <div className="space-y-3">
                    {parent.children?.map((child: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10 shadow-md">
                            <AvatarImage
                              src={child.avatar || "/placeholder.svg"}
                            />
                            <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white text-sm font-bold">
                              {child.name
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-sm text-gray-800">
                              {child.name}
                            </p>
                            <p className="text-xs text-gray-600 font-medium">
                              {child.class} • Age {child.age}
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => setSelectedChild(child)}
                          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-xs px-3"
                        >
                          <Eye className="h-3 w-3 mr-2" />
                          Progress
                        </Button>
                      </div>
                    )) || (
                      <div className="text-center py-6">
                        <p className="text-gray-500 text-sm">
                          No children assigned
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
