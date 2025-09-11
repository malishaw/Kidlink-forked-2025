"use client";

import { useGetFeedbacks } from "@/features/feedback/actions/get-feedback";

export default function FeedbackList() {
  // Fetch feedbacks
  const { data, isLoading, error } = useGetFeedbacks({ page: 1, limit: 10 });

  return (
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
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
                  <span className="font-semibold">Reply:</span> {feedback.reply}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
