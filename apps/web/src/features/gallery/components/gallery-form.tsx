"use client";

import GalleryView from "@/modules/media/components/gallery-view";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Textarea } from "@repo/ui/components/textarea";
import { useState } from "react";
import { createGallery } from "../actions/create-gallery";

export default function GalleryForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    type: "",
    title: "",
    description: "",
    images: [],
    childId: "",
    classId: "",
    eventId: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGalleryOpen, setGalleryOpen] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const galleryData = {
        ...formData,
        images: formData.images.filter((image) => image !== ""), // Filter valid images
      };

      await createGallery(galleryData);
      alert("Gallery created successfully!");
      setFormData({
        type: "",
        title: "",
        description: "",
        images: [],
        childId: "",
        classId: "",
        eventId: "",
      });
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error creating gallery:", error);
      alert("Failed to create gallery.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] m-4 flex flex-col">
        {/* Header - Fixed */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Create Gallery</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            ×
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium mb-2 text-gray-700"
              >
                Type *
              </label>
              <Input
                id="type"
                name="type"
                type="text"
                required
                value={formData.type}
                onChange={handleChange}
                placeholder="Enter gallery type"
                className="w-full"
              />
            </div>

            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium mb-2 text-gray-700"
              >
                Title *
              </label>
              <Input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter gallery title"
                className="w-full"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium mb-2 text-gray-700"
              >
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter gallery description"
                className="w-full resize-none"
              />
            </div>

            <div>
              <label
                htmlFor="images"
                className="block text-sm font-medium mb-2 text-gray-700"
              >
                Images *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setGalleryOpen(true)}
                  className="mb-4 w-full py-3 border-2 border-purple-300 text-purple-600 hover:bg-purple-50"
                >
                  📷 Select Images from Gallery
                </Button>

                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Selected image ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              images: prev.images.filter((_, i) => i !== index),
                            }))
                          }
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600 shadow-lg"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {formData.images.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">📷</div>
                    <p>No images selected yet</p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="childId"
                  className="block text-sm font-medium mb-2 text-gray-700"
                >
                  Child ID
                </label>
                <Input
                  id="childId"
                  name="childId"
                  type="text"
                  value={formData.childId}
                  onChange={handleChange}
                  placeholder="Child ID (optional)"
                  className="w-full"
                />
              </div>

              <div>
                <label
                  htmlFor="classId"
                  className="block text-sm font-medium mb-2 text-gray-700"
                >
                  Class ID
                </label>
                <Input
                  id="classId"
                  name="classId"
                  type="text"
                  value={formData.classId}
                  onChange={handleChange}
                  placeholder="Class ID (optional)"
                  className="w-full"
                />
              </div>

              <div>
                <label
                  htmlFor="eventId"
                  className="block text-sm font-medium mb-2 text-gray-700"
                >
                  Event ID
                </label>
                <Input
                  id="eventId"
                  name="eventId"
                  type="text"
                  value={formData.eventId}
                  onChange={handleChange}
                  placeholder="Event ID (optional)"
                  className="w-full"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Footer - Fixed */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-6 py-2 border-2 border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                "Create Gallery"
              )}
            </Button>
          </div>
        </div>

        {/* Gallery View Modal */}
        <GalleryView
          modal={true}
          modalOpen={isGalleryOpen}
          setModalOpen={setGalleryOpen}
          activeTab="library"
          onUseSelected={(selectedImages) => {
            const imageUrls = selectedImages.map((image) => image.url || "");
            setFormData((prev) => ({
              ...prev,
              images: [...prev.images, ...imageUrls],
            }));
            setGalleryOpen(false);
          }}
        />
      </div>
    </div>
  );
}
