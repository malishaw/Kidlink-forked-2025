"use client";

import { useGetChildById } from "@/features/children/actions/get-children-by-id";
import { useGetFeedbacks } from "@/features/feedback/actions/get-feedback";
import { deleteFeedback } from "@/features/feedback/actions/remove-feedback";
import { updateFeedback } from "@/features/feedback/actions/update-feedback";
import { useGetTeacherById } from "@/features/teachers/actions/get-teacher-by-id";
import { Button } from "@repo/ui/components/button";
import { useState } from "react";

// Helper component to display individual feedback card
function FeedbackCard({ feedback }: { feedback: any }) {
  const { data: childData } = useGetChildById(feedback.childId);
  const { data: teacherData } = useGetTeacherById(feedback.teacherId);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState<string>(
    feedback.content || ""
  );
  const [editRating, setEditRating] = useState<number>(feedback.rating ?? 0);

  const openEdit = () => {
    setEditContent(feedback.content || "");
    setEditRating(feedback.rating ?? 0);
    setIsEditing(true);
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-2">
        <span className="font-semibold text-lg text-blue-700">
          {childData?.name || "Loading..."}
        </span>
        <span className="text-gray-400">|</span>
        <span className="font-semibold text-lg text-purple-700">
          {teacherData?.name || "Loading..."}
        </span>
      </div>
      <div className="mb-2">
        <span className="text-yellow-500 font-bold">{feedback.rating}★</span>
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
      <div className="mt-4 flex gap-2">
        <Button size="sm" variant="outline" onClick={openEdit}>
          Edit
        </Button>

        <Button
          size="sm"
          className="bg-red-500 text-white"
          onClick={async () => {
            if (!confirm("Delete this feedback? This action cannot be undone."))
              return;
            try {
              await deleteFeedback(feedback.id);
              window.location.reload();
            } catch (err) {
              console.error(err);
              alert("Failed to delete feedback");
            }
          }}
        >
          Delete
        </Button>
      </div>
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-3">Edit Feedback</h3>
            <div className="space-y-3">
              <label className="text-sm font-medium">Content</label>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full border border-gray-200 rounded-md p-2"
                rows={4}
              />

              <label className="text-sm font-medium">Rating</label>
              <input
                type="number"
                min={1}
                max={5}
                value={editRating}
                onChange={(e) => setEditRating(Number(e.target.value))}
                className="w-24 border border-gray-200 rounded-md p-2"
              />

              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    try {
                      await updateFeedback(String(feedback.id), {
                        content: editContent,
                        rating: editRating,
                      });
                      setIsEditing(false);
                      window.location.reload();
                    } catch (err) {
                      console.error(err);
                      alert("Failed to update feedback");
                    }
                  }}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

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
            <FeedbackCard key={feedback.id} feedback={feedback} />
          ))}
        </div>
      )}
    </div>
  );
}
