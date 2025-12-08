"use client";
import { createLike } from "../actions/create-like";
import { useGetAllComments } from "../actions/get-all-comment";

import { getClient } from "@/lib/rpc/client";
import { Button } from "@repo/ui/components/button";
import { useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  Bookmark,
  Calendar,
  Edit,
  FileText,
  Heart,
  Image as ImageIcon,
  Info,
  Loader2,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  Trash2,
  Users,
  Video,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useGetPosts } from "../actions/get-post";

type PostType = "activity" | "announcement" | "event";
type MediaType = "image" | "video" | "document";

interface PostData {
  id: string;
  postType: PostType;
  title: string;
  description: string;
  mediaUrls?: string[];
  mediaType?: MediaType;
  place?: string;
  createdAt: string;
  authorId: string;
  nurseryId: string;
  organizationId?: string;
  likes?: number;
  isLiked?: boolean;
  comments?: number;
}

interface PostsResponse {
  data: PostData[];
  total: number;
  totalPages: number;
  currentPage: number;
}

// Edit Media List Component
const EditMediaList: React.FC<{
  urls: string[];
  onAdd: (url: string) => void;
  onRemove: (index: number) => void;
}> = ({ urls, onAdd, onRemove }) => {
  const [input, setInput] = useState("");

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste media URL and press Add"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        />
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            if (input.trim()) {
              onAdd(input.trim());
              setInput("");
            }
          }}
          className="whitespace-nowrap"
        >
          Add URL
        </Button>
      </div>

      {urls.length > 0 && (
        <div className="space-y-2 max-h-48 overflow-y-auto bg-gray-50 rounded-lg p-3 border">
          {urls.map((u, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between gap-2 p-2 bg-white rounded-md border shadow-sm"
            >
              <span className="text-xs font-mono truncate max-w-[200px]">
                {u}
              </span>
              <button
                onClick={() => onRemove(idx)}
                className="text-red-600 hover:text-red-800 text-xs font-medium"
                type="button"
                title="Remove"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// CommentBox component
const CommentBox: React.FC<{
  postId: string;
  onPosted?: () => void;
}> = ({ postId, onPosted }) => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const rpcClient = await getClient();
      const api = (rpcClient as any)?.api;
      if (!api) throw new Error("API client unavailable");

      const res = await api["comment"].$post({
        json: { postId, content: text.trim() },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || "Failed to post comment");
      }

      setText("");
      onPosted?.();
      alert("Comment posted");
    } catch (err: any) {
      console.error("Comment submit error", err);
      alert(err?.message || "Failed to post comment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3 border-t pt-3">
      <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0"></div>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a comment..."
        className="flex-1 bg-transparent outline-none text-sm placeholder-gray-500"
      />
      <button
        onClick={handleSubmit}
        disabled={loading || !text.trim()}
        className="text-indigo-600 hover:text-indigo-700 disabled:text-gray-400 font-semibold text-sm"
      >
        {loading ? "..." : "Post"}
      </button>
    </div>
  );
};

const GetPostsList: React.FC = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [sort] = useState<"desc" | "asc">("desc");
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [likes, setLikes] = useState<Record<string, boolean>>({});
  const [expandedComments, setExpandedComments] = useState<
    Record<string, boolean>
  >({});

  const handleLike = async (postId: string) => {
    try {
      await createLike({ postId });
      setLikes((prev) => ({ ...prev, [postId]: !prev[postId] }));
      queryClient.invalidateQueries({ queryKey: ["post"] });
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const toggleComments = (postId: string) => {
    setExpandedComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const { data, isLoading, error } = useGetPosts({
    page,
    limit,
    search: null,
    sort,
  });

  const { data: commentsData, refetch: refetchComments } = useGetAllComments({
    page: 1,
    limit: 50,
  });

  const postsData = data as PostsResponse | undefined;
  const posts = postsData?.data || [];
  const totalPages = postsData?.totalPages || 1;
  const totalCount = postsData?.total || 0;

  const getTypeIcon = (type: PostType) => {
    switch (type) {
      case "activity":
        return <Users className="h-6 w-6" />;
      case "announcement":
        return <Bell className="h-6 w-6" />;
      case "event":
        return <Calendar className="h-6 w-6" />;
      default:
        return <Info className="h-6 w-6" />;
    }
  };

  const getTypeColor = (type: PostType) => {
    switch (type) {
      case "activity":
        return "bg-amber-500/10 text-amber-600 border-amber-200";
      case "announcement":
        return "bg-blue-500/10 text-blue-600 border-blue-200";
      case "event":
        return "bg-rose-500/10 text-rose-600 border-rose-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getMediaIcon = (type?: MediaType) => {
    switch (type) {
      case "image":
        return <ImageIcon className="h-4 w-4" />;
      case "video":
        return <Video className="h-4 w-4" />;
      case "document":
        return <FileText className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getTypeLabel = (type: PostType): string => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const queryClient = useQueryClient();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<PostData | null>(null);
  const [editForm, setEditForm] = useState<Partial<PostData>>({});
  const [showMediaUpload, setShowMediaUpload] = useState<
    "image" | "video" | null
  >(null);
  const imageInputRef = React.useRef<HTMLInputElement>(null);
  const videoInputRef = React.useRef<HTMLInputElement>(null);

  const openEditModal = (post: PostData) => {
    setEditingPost(post);
    setEditForm({
      title: post.title,
      description: post.description,
      place: post.place,
      mediaType: post.mediaType,
      mediaUrls: post.mediaUrls ? [...post.mediaUrls] : [],
    });
    setIsEditOpen(true);
  };

  const closeEditModal = () => {
    setIsEditOpen(false);
    setEditingPost(null);
    setEditForm({});
    setShowMediaUpload(null);
  };

  const handleEditChange = (key: keyof PostData | string, value: any) => {
    if (key === "mediaType") {
      setShowMediaUpload(
        value === editForm.mediaType
          ? null
          : (value as "image" | "video" | null)
      );
    }
    setEditForm((p) => ({ ...(p || {}), [key]: value }));
  };

  const handleEditFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "image" | "video"
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target?.result as string;
          setEditForm((p) => ({
            ...p,
            mediaUrls: [...((p?.mediaUrls as string[]) || []), dataUrl],
            mediaType: type,
          }));
        };
        reader.readAsDataURL(file);
      });
      setShowMediaUpload(null);
    }
  };

  const handleRemoveEditMediaUrl = (index: number) => {
    setEditForm((p) => ({
      ...(p || {}),
      mediaUrls: (p?.mediaUrls || [])?.filter((_, i) => i !== index),
    }));
  };

  const saveUpdatedPost = async () => {
    if (!editingPost) return;
    try {
      const rpcClient = await getClient();
      const api = (rpcClient as any)?.api;
      if (!api) throw new Error("API client unavailable");

      const res = await api["post"][":id"].$patch({
        param: { id: editingPost.id },
        json: {
          title: editForm.title,
          description: editForm.description,
          place: editForm.place,
          mediaUrls: editForm.mediaUrls,
          mediaType: editForm.mediaType,
        },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || "Failed to update post");
      }

      await queryClient.invalidateQueries({ queryKey: ["post"] });
      closeEditModal();
      alert("Post updated successfully!");
    } catch (err: any) {
      console.error("Update failed", err);
      alert(err?.message || "Failed to update post");
    }
  };

  const deletePost = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const rpcClient = await getClient();
      const api = (rpcClient as any)?.api;
      if (!api) throw new Error("API client unavailable");

      const res = await api["post"][":id"].$delete({
        param: { id: postId },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || "Failed to delete post");
      }

      await queryClient.invalidateQueries({ queryKey: ["post"] });
      if (editingPost && editingPost.id === postId) closeEditModal();
      alert("Post deleted successfully!");
    } catch (error: any) {
      console.error("Failed to delete post:", error);
      alert(error?.message || "Failed to delete post");
    }
  };

  const deletePostComment = async (commentId: string | number) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      const rpcClient = await getClient();
      const api = (rpcClient as any)?.api;
      if (!api) throw new Error("API client unavailable");

      const res = await api["comment"][":id"].$delete({
        param: { id: String(commentId) },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || "Failed to delete comment");
      }

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["comment"] }),
        queryClient.invalidateQueries({ queryKey: ["post"] }),
      ]);
      alert("Comment deleted successfully!");
    } catch (error: any) {
      console.error("Failed to delete comment:", error);
      alert(error?.message || "Failed to delete comment");
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-gray-600" />
          <p className="text-gray-600 font-medium">Loading nursery posts...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-2xl mx-auto">
          <div className="border border-red-200 bg-red-50 rounded-lg p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Info className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-red-800 mb-2">
              Oops! Something went wrong
            </h3>
            <p className="text-red-600 mb-6">
              {error?.message || "Failed to load posts"}
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-white border-b border-gray-200 py-4 px-4">
          <h1 className="text-2xl font-bold">Feeds</h1>
        </div>

        {/* Posts Feed */}
        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <FileText className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No posts yet
            </h3>
            <p className="text-gray-500">
              Create your first post to get started!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {posts.map((post) => (
              <div
                key={post.id}
                className="border-b border-gray-200 last:border-b-0"
              >
                {/* Post Header */}
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400"></div>
                    <div>
                      <p className="font-semibold text-sm">{post.title}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button className="text-gray-600 hover:text-gray-800">
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </div>

                {/* Post Images Gallery */}
                {post.mediaUrls &&
                post.mediaUrls.length > 0 &&
                post.mediaType === "image" ? (
                  <div className="w-full bg-gray-100">
                    {post.mediaUrls.length === 1 ? (
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={post.mediaUrls[0]}
                          alt={post.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src =
                              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23e5e7eb' viewBox='0 0 100 100'%3E%3Crect width='100' height='100'/%3E%3C/svg%3E";
                          }}
                        />
                      </div>
                    ) : post.mediaUrls.length === 2 ? (
                      <div className="grid grid-cols-2 gap-1 aspect-square">
                        {post.mediaUrls.map((url, idx) => (
                          <div key={idx} className="overflow-hidden">
                            <img
                              src={url}
                              alt={`${post.title}-${idx}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src =
                                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23e5e7eb' viewBox='0 0 100 100'%3E%3Crect width='100' height='100'/%3E%3C/svg%3E";
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    ) : post.mediaUrls.length === 3 ? (
                      <div className="grid grid-cols-2 gap-1 aspect-square">
                        <div className="col-span-1 row-span-2 overflow-hidden">
                          <img
                            src={post.mediaUrls[0]}
                            alt={`${post.title}-0`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src =
                                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23e5e7eb' viewBox='0 0 100 100'%3E%3Crect width='100' height='100'/%3E%3C/svg%3E";
                            }}
                          />
                        </div>
                        {post.mediaUrls.slice(1, 3).map((url, idx) => (
                          <div key={idx + 1} className="overflow-hidden">
                            <img
                              src={url}
                              alt={`${post.title}-${idx + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src =
                                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23e5e7eb' viewBox='0 0 100 100'%3E%3Crect width='100' height='100'/%3E%3C/svg%3E";
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-1 aspect-square">
                        {post.mediaUrls.slice(0, 4).map((url, idx) => (
                          <div key={idx} className="relative overflow-hidden">
                            <img
                              src={url}
                              alt={`${post.title}-${idx}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src =
                                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23e5e7eb' viewBox='0 0 100 100'%3E%3Crect width='100' height='100'/%3E%3C/svg%3E";
                              }}
                            />
                            {idx === 3 && post.mediaUrls.length > 4 && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <span className="text-white font-semibold text-lg">
                                  +{post.mediaUrls.length - 4}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full bg-gray-100 aspect-square flex items-center justify-center">
                    <div className="text-center">
                      <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No media</p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between px-4 py-3 text-gray-700">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={async () => {
                        try {
                          setLikes((prev) => ({
                            ...prev,
                            [post.id]: !prev[post.id],
                          }));
                          const result = await createLike({
                            postId: post.id,
                          });
                          if (!result) throw new Error("Failed to like post");
                          await queryClient.invalidateQueries({
                            queryKey: ["post"],
                          });
                        } catch (err: any) {
                          setLikes((prev) => ({
                            ...prev,
                            [post.id]: !prev[post.id],
                          }));
                          alert(err.message || "Failed to like post");
                        }
                      }}
                      className="hover:text-red-600 transition"
                    >
                      <Heart
                        className="h-6 w-6"
                        fill={likes[post.id] ? "red" : "none"}
                        color={likes[post.id] ? "none" : "currentColor"}
                      />
                    </button>
                    <button
                      onClick={() =>
                        setSelectedPost(
                          selectedPost === post.id ? null : post.id
                        )
                      }
                      className="hover:text-blue-500 transition"
                    >
                      <MessageCircle
                        className="h-6 w-6"
                        fill={
                          selectedPost === post.id ? "currentColor" : "none"
                        }
                      />
                    </button>
                  </div>
                  <button className="hover:text-blue-500 transition">
                    <Bookmark className="h-6 w-6" />
                  </button>
                </div>

                {/* Likes Count */}
                <div className="px-4 py-1">
                  <p className="text-sm font-semibold">
                    {post.likes || 0} {post.likes === 1 ? "like" : "likes"}
                  </p>
                </div>

                {/* Post Caption */}
                <div className="px-4 py-2">
                  <p className="text-sm">
                    <span className="font-semibold">{post.title}</span>{" "}
                    {post.description}
                  </p>
                  {post.place && (
                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {post.place}
                    </p>
                  )}
                </div>

                {/* Comments Preview */}
                <div className="px-4 py-2">
                  <button className="text-xs text-gray-500 hover:text-gray-700">
                    View all {post.comments || 0} comments
                  </button>
                </div>

                {/* Comments Section */}
                {selectedPost === post.id && (
                  <div className="px-4 py-3 space-y-3 border-t border-gray-200 bg-gray-50">
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {commentsData?.data
                        ?.filter((comment: any) => comment.postId === post.id)
                        ?.map((comment: any) => (
                          <div
                            key={comment.id}
                            className="flex items-start gap-3"
                          >
                            <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0"></div>
                            <div className="flex-1">
                              <div className="bg-gray-200 rounded-2xl px-3 py-2">
                                <p className="text-xs font-semibold">
                                  Commenter
                                </p>
                                <p className="text-sm text-gray-800">
                                  {comment.content}
                                </p>
                              </div>
                              <div className="flex items-center gap-3 mt-1 px-3">
                                <span className="text-xs text-gray-500">
                                  {new Date(comment.createdAt).toLocaleString()}
                                </span>
                                <button
                                  onClick={() => deletePostComment(comment.id)}
                                  className="text-xs text-red-600 hover:text-red-700 font-medium"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                    <CommentBox
                      postId={post.id}
                      onPosted={async () => {
                        await Promise.all([
                          queryClient.invalidateQueries({
                            queryKey: ["post"],
                          }),
                          queryClient.invalidateQueries({
                            queryKey: ["comment"],
                          }),
                        ]);
                      }}
                    />
                  </div>
                )}

                {/* Admin Actions */}
                <div className="flex items-center gap-2 px-4 py-3 border-t border-gray-200 bg-gray-50">
                  <Button
                    onClick={() => openEditModal(post)}
                    size="sm"
                    variant="ghost"
                    className="flex-1 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 text-xs"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => deletePost(post.id)}
                    size="sm"
                    variant="ghost"
                    className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 text-xs"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Instagram-Style Edit Modal */}
        {isEditOpen && editingPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[95vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                <button
                  onClick={closeEditModal}
                  className="text-xl font-medium text-gray-700 hover:text-gray-900"
                >
                  ← Cancel
                </button>
                <h2 className="text-lg font-semibold text-gray-900">
                  Edit Post
                </h2>
                <Button
                  onClick={saveUpdatedPost}
                  size="sm"
                  className="text-blue-500 font-semibold text-sm hover:opacity-80"
                  variant="ghost"
                >
                  Done
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {/* Media Preview */}
                <div className="aspect-square bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                  {editForm.mediaUrls && editForm.mediaUrls.length > 0 ? (
                    <img
                      src={editForm.mediaUrls[0]}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/500?text=No+Image";
                      }}
                    />
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-gray-500">No media selected</p>
                    </div>
                  )}
                </div>

                {/* Form */}
                <div className="p-4 space-y-5">
                  <textarea
                    value={editForm.title || ""}
                    onChange={(e) => handleEditChange("title", e.target.value)}
                    placeholder="Write a title..."
                    className="w-full text-lg font-medium resize-none outline-none placeholder-gray-400"
                    rows={2}
                  />

                  <textarea
                    value={editForm.description || ""}
                    onChange={(e) =>
                      handleEditChange("description", e.target.value)
                    }
                    placeholder="Write a caption..."
                    className="w-full resize-none outline-none text-gray-800 placeholder-gray-400 min-h-24"
                    rows={4}
                  />

                  <div className="flex items-center gap-3 pt-2">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <input
                      value={editForm.place || ""}
                      onChange={(e) =>
                        handleEditChange("place", e.target.value)
                      }
                      placeholder="Add location"
                      className="flex-1 outline-none text-gray-700 placeholder-gray-400"
                    />
                  </div>

                  <div className="space-y-3 pt-2">
                    <p className="text-sm font-medium text-gray-700">
                      Add Media
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() =>
                          handleEditChange(
                            "mediaType",
                            editForm.mediaType === "image" ? undefined : "image"
                          )
                        }
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border-2 transition-all ${
                          editForm.mediaType === "image"
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <ImageIcon className="h-5 w-5" />
                        <span className="text-sm font-medium">Image</span>
                      </button>
                      <button
                        onClick={() =>
                          handleEditChange(
                            "mediaType",
                            editForm.mediaType === "video" ? undefined : "video"
                          )
                        }
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border-2 transition-all ${
                          editForm.mediaType === "video"
                            ? "border-purple-500 bg-purple-50 text-purple-700"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <Video className="h-5 w-5" />
                        <span className="text-sm font-medium">Video</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <ImageIcon className="h-4 w-4 text-gray-500" />
                      <span className="font-medium text-gray-700">
                        Added Media
                      </span>
                    </div>
                    {editForm.mediaUrls && editForm.mediaUrls.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {(editForm.mediaUrls as string[]).map((url, idx) => (
                          <div
                            key={idx}
                            className="relative rounded-lg overflow-hidden bg-gray-100 aspect-square"
                          >
                            {editForm.mediaType === "image" ? (
                              <img
                                src={url}
                                alt={`preview-${idx}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <video
                                src={url}
                                className="w-full h-full object-cover"
                              />
                            )}
                            <button
                              onClick={() => handleRemoveEditMediaUrl(idx)}
                              className="absolute top-1 right-1 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full transition shadow-lg"
                            >
                              <X className="h-4 w-4" />
                            </button>
                            <div className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-2 py-1 rounded">
                              {idx + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500">
                        No media added yet
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-8 px-4 border-t">
            <p className="text-sm text-gray-600">
              Page <span className="font-semibold">{page}</span> of{" "}
              <span className="font-semibold">{totalPages}</span>
            </p>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                variant="outline"
                size="sm"
              >
                Previous
              </Button>
              {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
                const pageNum =
                  totalPages <= 5 ? idx + 1 : Math.max(1, page - 2) + idx;
                if (pageNum > totalPages) return null;
                return (
                  <Button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    variant={page === pageNum ? "default" : "outline"}
                    size="sm"
                    className="w-10"
                  >
                    {pageNum}
                  </Button>
                );
              })}
              <Button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                variant="outline"
                size="sm"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GetPostsList;
