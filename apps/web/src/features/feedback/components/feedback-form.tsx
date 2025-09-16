"use client";

import { ChildrensList } from "@/features/children/actions/get-children";
import { createFeedback } from "@/features/feedback/actions/create-feedback";
import { authClient } from "@/lib/auth-client";
import { Star, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function FeedbackForm({
  isOpen = false,
  onClose = () => {},
  childId = "",
}: {
  isOpen?: boolean;
  onClose?: () => void;
  childId?: string;
}) {
  const [formData, setFormData] = useState({
    childId: childId || "",
    teacherId: "",
    content: "",
    rating: "",
    images: [],
    teacherFeedback: "",
    reply: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update childId when prop changes
  useEffect(() => {
    if (childId) {
      setFormData((prev) => ({ ...prev, childId }));
    }
  }, [childId]);

  // Fetch children for the dropdown
  const { data: childrenData, isLoading: isChildrenLoading } = ChildrensList({
    page: 1,
    limit: 10,
  });

  // Get the current session for teacher information
  const { data: session } = authClient.useSession();

  // Display teacher email but we'll pass teacher ID in the body
  const teacherEmail = session?.user?.email || "";
  const teacherId = session?.user?.id || "";

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setFormData((prev) => ({
        ...prev,
        images: Array.from(files).map((file) => file.name),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Pass teacher ID in the body, not the email
      await createFeedback({ ...formData, teacherId });
      onClose();
      setFormData({
        childId: childId || "",
        teacherId: "",
        content: "",
        rating: "",
        images: [],
        teacherFeedback: "",
        reply: "",
      });
      alert("Feedback submitted successfully!");
      // Automatically refresh the page after successful submission
      setTimeout(() => {
        window.location.reload();
      }, 1000); // Wait 1 second to show the success message
    } catch (err) {
      alert("Failed to submit feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => setFormData({ ...formData, rating: i.toString() })}
          className={`p-2 transition-all duration-200 ${
            parseInt(formData.rating) >= i
              ? "text-black hover:text-gray-700"
              : "text-gray-300 hover:text-gray-500"
          }`}
        >
          <Star
            className={`w-6 h-6 ${
              parseInt(formData.rating) >= i ? "fill-current" : ""
            }`}
          />
        </button>
      );
    }
    return stars;
  };

  return (
    <>
      {/* Feedback Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg relative flex flex-col">
            {/* Exit Button */}
            <div className="sticky top-0 z-10 bg-white rounded-t-3xl">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div
              className="overflow-y-auto p-8"
              style={{
                maxHeight: "90vh", // Set max height for scrollable content
              }}
            >
              <h2 className="text-2xl font-bold mb-4">Submit Feedback</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Child Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Child
                  </label>
                  <select
                    name="childId"
                    value={formData.childId}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2"
                  >
                    <option value="" disabled>
                      {isChildrenLoading
                        ? "Loading children..."
                        : "Select a child"}
                    </option>
                    {childrenData?.data?.map((child: any) => (
                      <option key={child.id} value={child.id}>
                        {child.name} {/* Display the child name */}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Teacher Email (Pre-filled for display) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teacher Email
                  </label>
                  <input
                    type="text"
                    name="teacherEmail"
                    value={teacherEmail}
                    readOnly
                    className="w-full border border-gray-200 rounded-xl px-4 py-2 bg-gray-100 text-gray-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Teacher ID ({teacherId}) will be submitted with the feedback
                  </p>
                </div>

                <textarea
                  name="content"
                  placeholder="Your feedback..."
                  value={formData.content}
                  onChange={handleChange}
                  rows={4}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <div className="flex items-center gap-1 p-2 bg-gray-50 rounded-lg border-2 border-gray-300 w-fit">
                    {renderStars()}
                  </div>
                  {formData.rating && (
                    <p className="text-sm text-gray-600 mt-2">
                      You rated: {formData.rating} star
                      {parseInt(formData.rating) !== 1 ? "s" : ""}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Attach Images
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2"
                  />
                  {formData.images.length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg border mt-2">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Selected files: {formData.images.length}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {formData.images.map((image, index) => (
                          <span
                            key={index}
                            className="bg-white px-3 py-1 rounded border text-xs text-gray-600"
                          >
                            {image}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <textarea
                  name="teacherFeedback"
                  placeholder="Teacher's feedback or comments..."
                  value={formData.teacherFeedback}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2"
                />
                <textarea
                  name="reply"
                  placeholder="Your reply or response..."
                  value={formData.reply}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2"
                />
                <div className="flex justify-end gap-4 mt-4">
                  <button
                    type="button"
                    className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-semibold"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-lg font-semibold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Submit Feedback"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
