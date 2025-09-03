// "use client";

// import { createFeedback } from "@/features/feedback/actions/create-feedback";
// import { useState } from "react";

// export default function FeedbackForm() {
//   const [formData, setFormData] = useState({
//     organizationId: "",
//     childId: null,
//     teacherId: null,
//     content: "",
//     rating: "",
//     images: [],
//     teacherFeedback: "",
//     reply: "",
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (files) {
//       setFormData((prev) => ({
//         ...prev,
//         images: Array.from(files).map((file) => file.name), // store file names as image URLs/paths
//       }));
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     try {
//       await createFeedback(formData);
//       alert("Feedback submitted successfully!");
//       setFormData({
//         organizationId: "",
//         childId: null,
//         teacherId: null,
//         content: "",
//         rating: "",
//         images: [],
//         teacherFeedback: "",
//         reply: "",
//       });
//     } catch (err) {
//       alert("Failed to submit feedback");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       style={{ maxWidth: 400, margin: "2rem auto" }}
//     >
//       <div style={{ marginBottom: "1rem" }}>
//         <label>Organization ID</label>
//         <input
//           name="organizationId"
//           value={formData.organizationId}
//           onChange={handleChange}
//           style={{ width: "100%", padding: 8 }}
//         />
//       </div>
//       <div style={{ marginBottom: "1rem" }}>
//         <label>Child ID (nullable)</label>
//         <input
//           name="childId"
//           value={formData.childId || ""}
//           onChange={handleChange}
//           style={{ width: "100%", padding: 8 }}
//         />
//       </div>
//       <div style={{ marginBottom: "1rem" }}>
//         <label>Teacher ID (nullable)</label>
//         <input
//           name="teacherId"
//           value={formData.teacherId || ""}
//           onChange={handleChange}
//           style={{ width: "100%", padding: 8 }}
//         />
//       </div>
//       <div style={{ marginBottom: "1rem" }}>
//         <label>Content</label>
//         <textarea
//           name="content"
//           value={formData.content}
//           onChange={handleChange}
//           style={{ width: "100%", padding: 8 }}
//         />
//       </div>
//       <div style={{ marginBottom: "1rem" }}>
//         <label>Rating</label>
//         <input
//           name="rating"
//           value={formData.rating}
//           onChange={handleChange}
//           style={{ width: "100%", padding: 8 }}
//         />
//       </div>
//       <div style={{ marginBottom: "1rem" }}>
//         <label>Images (filenames)</label>
//         <input
//           type="file"
//           multiple
//           accept="image/*"
//           onChange={handleImageChange}
//           style={{ width: "100%", padding: 8 }}
//         />
//       </div>
//       <div style={{ marginBottom: "1rem" }}>
//         <label>Teacher Feedback</label>
//         <textarea
//           name="teacherFeedback"
//           value={formData.teacherFeedback}
//           onChange={handleChange}
//           style={{ width: "100%", padding: 8 }}
//         />
//       </div>
//       <div style={{ marginBottom: "1rem" }}>
//         <label>Reply</label>
//         <textarea
//           name="reply"
//           value={formData.reply}
//           onChange={handleChange}
//           style={{ width: "100%", padding: 8 }}
//         />
//       </div>
//       <button
//         type="submit"
//         disabled={isSubmitting}
//         style={{ padding: "0.5rem 1rem" }}
//       >
//         {isSubmitting ? "Saving..." : "Submit Feedback"}
//       </button>
//     </form>
//   );
// }

////////////////////////////////////////////////////////////////////
//

"use client";

import { createFeedback } from "@/features/feedback/actions/create-feedback";
import { useGetFeedbacks } from "@/features/feedback/actions/get-feedback";
import { MessageCircle, Star } from "lucide-react";
import { useState } from "react";

export default function FeedbackForm() {
  const [formData, setFormData] = useState({
    childId: null,
    teacherId: null,
    content: "",
    rating: "",
    images: [],
    teacherFeedback: "",
    reply: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
      await createFeedback(formData);
      setIsModalOpen(false);
      setFormData({
        childId: null,
        teacherId: null,
        content: "",
        rating: "",
        images: [],
        teacherFeedback: "",
        reply: "",
      });
      alert("Feedback submitted successfully!");
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

  // Fetch feedbacks
  const { data, isLoading, error } = useGetFeedbacks({ page: 1, limit: 10 });

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen">
      <div className="bg-gradient-to-r from-blue-50 via-white to-purple-50 rounded-2xl p-8 shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl shadow-sm">
                <MessageCircle className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Feedbacks
              </h2>
            </div>
            <p className="text-gray-600">
              Share your thoughts and help us improve our services
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg font-semibold shadow-md"
            >
              + Give Feedback
            </button>
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div
            className="bg-white rounded-3xl shadow-xl w-full max-w-lg relative flex flex-col"
            style={{ maxHeight: "100vh" }}
          >
            <div
              className="overflow-y-auto p-8"
              style={{
                maxHeight: "170vh",
                borderRadius: "10%",
                width: "calc(12.4cm + 25px)",
                height: "calc(18cm + 25px)",
              }}
            >
              <h2 className="text-2xl font-bold mb-4">Submit Feedback</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="childId"
                  placeholder="Child ID (optional)"
                  value={formData.childId || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2"
                />
                <input
                  type="text"
                  name="teacherId"
                  placeholder="Teacher ID (optional)"
                  value={formData.teacherId || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2"
                />
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
                    onClick={() => setIsModalOpen(false)}
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

      {/* Feedback List */}
      <div className="mt-8">
        <h3 className="text-2xl font-bold mb-6">Recent Feedbacks</h3>
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">
            Loading feedbacks...
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            Failed to load feedbacks
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data?.data?.map((feedback: any) => (
              <div
                key={feedback.id}
                className="bg-white rounded-xl shadow p-6 border border-gray-200"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-lg text-blue-700">
                    {feedback.childId || "-"}
                  </span>
                  <span className="text-gray-400">|</span>
                  <span className="font-semibold text-lg text-purple-700">
                    {feedback.teacherId || "-"}
                  </span>
                </div>
                <div className="mb-2">
                  <span className="text-yellow-500 font-bold">
                    {feedback.rating}★
                  </span>
                </div>
                <div className="mb-2 text-gray-800">{feedback.content}</div>
                {feedback.images?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {feedback.images.map((img: string, idx: number) => (
                      <span
                        key={idx}
                        className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-600 border"
                      >
                        {img}
                      </span>
                    ))}
                  </div>
                )}
                {feedback.teacherFeedback && (
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="font-semibold">Teacher:</span>{" "}
                    {feedback.teacherFeedback}
                  </div>
                )}
                {feedback.reply && (
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="font-semibold">Reply:</span>{" "}
                    {feedback.reply}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
