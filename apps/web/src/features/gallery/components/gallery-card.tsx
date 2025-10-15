"use client";

import { Button } from "@repo/ui/components/button";
import Link from "next/link";
import { useState } from "react";
import { GalleriesList } from "../actions/get-all-gallery";

export default function GalleryCard() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: "",
    sort: "desc",
  });

  const { data, isLoading, error } = GalleriesList(filters);

  if (isLoading) {
    return <p>Loading galleries...</p>;
  }

  if (error) {
    return <p>Error loading galleries: {error.message}</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Gallery</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.data.map((gallery) => (
          <Link
            key={gallery.id}
            href={`/account/manage/gallery/${gallery.id}`}
            className="block"
          >
            <div className="border rounded-lg shadow-lg p-4 bg-white hover:shadow-xl transition-shadow duration-300 cursor-pointer">
              <h3 className="text-lg font-semibold mb-2">{gallery.title}</h3>
              <p className="text-sm text-gray-600 mb-4">
                {gallery.description}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {gallery.images?.slice(0, 3).map((image, index) => (
                  <img
                    key={index}
                    src={image || "/placeholder.png"}
                    alt={`Gallery image ${index + 1}`}
                    className="w-full h-24 object-cover rounded-md"
                  />
                ))}
              </div>
              <div className="mt-4 text-center">
                <span className="text-purple-600 hover:text-purple-700 font-medium">
                  View Details →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="flex justify-between items-center mt-8">
        <Button
          variant="outline"
          disabled={filters.page === 1}
          onClick={() =>
            setFilters((prev) => ({ ...prev, page: prev.page - 1 }))
          }
        >
          Previous
        </Button>
        <span className="text-sm text-gray-600">
          Page {filters.page} of {data?.meta.totalPages}
        </span>
        <Button
          variant="outline"
          disabled={filters.page === data?.meta.totalPages}
          onClick={() =>
            setFilters((prev) => ({ ...prev, page: prev.page + 1 }))
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
}
