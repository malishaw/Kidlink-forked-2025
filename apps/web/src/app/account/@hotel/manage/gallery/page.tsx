"use client";

import { GalleriesList } from "@/features/gallery/actions/get-all-gallery";
import GalleryForm from "@/features/gallery/components/gallery-form";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Grid, List, Plus, Search } from "lucide-react";
import Link from "next/link"; // Add this import
import { useState } from "react";

export default function GalleryPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    search: "",
    sort: "desc" as "desc" | "asc",
  });

  const { data, isLoading, error, refetch } = GalleriesList(filters);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({
      ...prev,
      search: e.target.value,
      page: 1, // Reset to first page when searching
    }));
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    refetch(); // Refresh the gallery list after adding a new gallery
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading galleries...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">
          Error loading galleries: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gallery</h1>
              <p className="text-gray-600 mt-1">
                Manage and view your photo galleries
              </p>
            </div>
            <Button
              onClick={() => setIsFormOpen(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Gallery
            </Button>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search galleries..."
                  value={filters.search}
                  onChange={handleSearchChange}
                  className="pl-10"
                />
              </div>
              <select
                value={filters.sort}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    sort: e.target.value as "desc" | "asc",
                  }))
                }
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Galleries Grid */}
        {data?.data && data.data.length > 0 ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            {data.data.map((gallery) => (
              <Link
                key={gallery.id}
                href={`/account/manage/gallery/${gallery.id}`}
                className="block"
              >
                <div
                  className={
                    viewMode === "grid"
                      ? "bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                      : "bg-white rounded-lg shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer"
                  }
                >
                  {viewMode === "grid" ? (
                    <>
                      {/* Gallery Images Preview */}
                      <div className="relative h-48 bg-gray-100">
                        {gallery.images && gallery.images.length > 0 ? (
                          <div className="grid grid-cols-2 h-full gap-1">
                            {gallery.images.slice(0, 4).map((image, index) => (
                              <img
                                key={index}
                                src={image || "/placeholder.png"}
                                alt={`Gallery ${gallery.title} - Image ${index + 1}`}
                                className={`object-cover ${
                                  gallery.images.length === 1
                                    ? "col-span-2 h-full"
                                    : gallery.images.length === 2 && index < 2
                                      ? "col-span-1 h-full"
                                      : gallery.images.length === 3 &&
                                          index === 0
                                        ? "col-span-2 h-full"
                                        : "h-full"
                                }`}
                              />
                            ))}
                            {gallery.images.length > 4 && (
                              <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                                +{gallery.images.length - 4}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <div className="text-gray-400 text-4xl">📷</div>
                          </div>
                        )}
                      </div>

                      {/* Gallery Info */}
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
                          {gallery.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {gallery.description || "No description"}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">
                            {gallery.type}
                          </span>
                          <span>
                            {gallery.images?.length || 0} photo
                            {(gallery.images?.length || 0) !== 1 ? "s" : ""}
                          </span>
                        </div>
                        <div className="mt-3 text-center">
                          <span className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                            Click to view gallery →
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* List View */}
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {gallery.images && gallery.images.length > 0 ? (
                          <img
                            src={gallery.images[0] || "/placeholder.png"}
                            alt={gallery.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <div className="text-gray-400 text-xl">📷</div>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {gallery.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {gallery.description || "No description"}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">
                            {gallery.type}
                          </span>
                          <span>{gallery.images?.length || 0} photos</span>
                        </div>
                      </div>
                      <div className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                        View Gallery →
                      </div>
                    </>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl text-gray-300 mb-4">📷</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No galleries found
            </h3>
            <p className="text-gray-500 mb-4">
              Create your first gallery to get started
            </p>
            <Button
              onClick={() => setIsFormOpen(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Gallery
            </Button>
          </div>
        )}

        {/* Pagination */}
        {data?.data && data.data.length > 0 && (
          <div className="flex justify-between items-center mt-8 bg-white p-4 rounded-lg shadow-sm">
            <Button
              variant="outline"
              disabled={filters.page === 1}
              onClick={() =>
                setFilters((prev) => ({ ...prev, page: prev.page - 1 }))
              }
            >
              Previous
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                Page {filters.page} of {data?.meta.totalPages || 1}
              </span>
              <span className="text-xs text-gray-500">
                ({data?.meta.totalCount || 0} total galleries)
              </span>
            </div>
            <Button
              variant="outline"
              disabled={filters.page === (data?.meta.totalPages || 1)}
              onClick={() =>
                setFilters((prev) => ({ ...prev, page: prev.page + 1 }))
              }
            >
              Next
            </Button>
          </div>
        )}

        {/* Gallery Form Modal */}
        {isFormOpen && <GalleryForm onClose={handleFormClose} />}
      </div>
    </div>
  );
}
