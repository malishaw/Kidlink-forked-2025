"use client";

import { getClient } from "@/lib/rpc/client";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent, CardHeader } from "@repo/ui/components/card";
import { useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  Calendar,
  Edit,
  FileText,
  Image as ImageIcon,
  Info,
  Loader2,
  MapPin,
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

// CommentBox component (small client-side widget)
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
    <div className="space-y-3">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a comment..."
        className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
        rows={3}
      />
      <div className="flex justify-end">
        <Button
          size="sm"
          onClick={handleSubmit}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          {loading ? "Posting..." : "Post Comment"}
        </Button>
      </div>
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

  const { data, isLoading, error } = useGetPosts({
    page,
    limit,
    search: null,
    sort,
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
  };

  const handleEditChange = (key: keyof PostData | string, value: any) => {
    setEditForm((p) => ({ ...(p || {}), [key]: value }));
  };

  const handleAddEditMediaUrl = (url: string) => {
    if (!url) return;
    setEditForm((p) => ({
      ...(p || {}),
      mediaUrls: [...((p?.mediaUrls as string[]) || []), url],
    }));
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

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-6">
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
          <CardContent className="flex flex-col items-center py-12 space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
            <p className="text-gray-600 font-medium">
              Loading nursery posts...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="border-red-200 bg-red-50/80 backdrop-blur shadow-md">
            <CardContent className="pt-8 text-center">
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
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center md:text-left space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Nursery Posts
          </h1>
          <p className="text-lg text-gray-600">
            {totalCount} {totalCount === 1 ? "post" : "posts"} in total
          </p>
        </div>

        {/* Posts Grid - 3 Columns */}
        {posts.length === 0 ? (
          <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-lg col-span-full">
            <CardContent className="py-20 text-center">
              <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <FileText className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No posts yet
              </h3>
              <p className="text-gray-500">
                Create your first post to get started!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Card
                key={post.id}
                className="group border-0 bg-white/80 backdrop-blur-sm shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full"
              >
                {/* Image/Media Header */}
                {post.mediaUrls &&
                post.mediaUrls.length > 0 &&
                post.mediaType === "image" ? (
                  <div className="relative h-40 bg-gray-200 overflow-hidden">
                    <img
                      src={post.mediaUrls[0]}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23e5e7eb' viewBox='0 0 100 100'%3E%3Crect width='100' height='100'/%3E%3C/svg%3E";
                      }}
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className={`${getTypeColor(post.postType)}`}>
                        {getTypeLabel(post.postType)}
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`h-40 flex items-center justify-center ${getTypeColor(
                      post.postType
                    )} relative`}
                  >
                    <div className="opacity-50 group-hover:opacity-70 transition">
                      {getTypeIcon(post.postType)}
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge className={`${getTypeColor(post.postType)}`}>
                        {getTypeLabel(post.postType)}
                      </Badge>
                    </div>
                  </div>
                )}

                {/* Content */}
                <CardHeader className="pb-3">
                  <h3 className="font-bold text-lg text-gray-900 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </CardHeader>

                <CardContent className="space-y-3 flex-grow">
                  <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                    {post.description}
                  </p>

                  {post.place && (
                    <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 px-2 py-1.5 rounded-lg w-fit">
                      <MapPin className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{post.place}</span>
                    </div>
                  )}

                  {post.mediaUrls && post.mediaUrls.length > 0 && (
                    <div className="flex items-center gap-2 text-xs text-gray-600 bg-blue-50 px-2 py-1.5 rounded-lg w-fit">
                      {getMediaIcon(post.mediaType)}
                      <span>{post.mediaUrls.length} file(s)</span>
                    </div>
                  )}

                  {/* Social Interaction Bar (likes, comments, share, views) */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={async () => {
                          try {
                            const rpcClient = await getClient();
                            const api = (rpcClient as any)?.api;
                            if (!api) throw new Error("API client unavailable");

                            // optimistic UI toggle
                            setLikes((prev) => ({
                              ...prev,
                              [post.id]: !prev[post.id],
                            }));

                            // create a post-like record
                            await api["post-like"]?.$post?.({
                              json: { postId: post.id },
                            });

                            await queryClient.invalidateQueries({
                              queryKey: ["post"],
                            });
                          } catch (err) {
                            console.error("Like failed", err);
                            // revert optimistic
                            setLikes((prev) => ({
                              ...prev,
                              [post.id]: !prev[post.id],
                            }));
                            alert("Failed to like post");
                          }
                        }}
                        className={`flex items-center gap-1 transition-colors ${
                          likes[post.id]
                            ? "text-red-500"
                            : "text-gray-600 hover:text-red-500"
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill={likes[post.id] ? "currentColor" : "none"}
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                        <span className="text-sm">{post.likes || 0}</span>
                      </button>

                      <button
                        onClick={() =>
                          setSelectedPost(
                            selectedPost === post.id ? null : post.id
                          )
                        }
                        className={`flex items-center gap-1 transition-colors ${
                          selectedPost === post.id
                            ? "text-indigo-600"
                            : "text-gray-600 hover:text-indigo-600"
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill={
                            selectedPost === post.id ? "currentColor" : "none"
                          }
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                        <span className="text-sm">{post.comments || 0}</span>
                      </button>

                      <button className="flex items-center gap-1 text-gray-600 hover:text-indigo-600 transition-colors">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                          />
                        </svg>
                        <span className="text-sm">Share</span>
                      </button>
                    </div>

                    <div className="flex items-center text-xs text-gray-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      156 views
                    </div>
                  </div>

                  {/* Comment Box (toggles open when comment icon clicked) */}
                  {selectedPost === post.id && (
                    <div className="mt-4 pt-3 border-t">
                      <CommentBox
                        postId={post.id}
                        onPosted={async () => {
                          await queryClient.invalidateQueries({
                            queryKey: ["post"],
                          });
                          setSelectedPost(null);
                        }}
                      />
                    </div>
                  )}
                </CardContent>

                {/* Admin Actions */}
                <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-t flex items-center justify-between gap-2">
                  <Button
                    onClick={() => openEditModal(post)}
                    size="sm"
                    variant="ghost"
                    className="flex-1 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 text-xs"
                  >
                    <Edit className="h-3.5 w-3.5 mr-1" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => deletePost(post.id)}
                    size="sm"
                    variant="ghost"
                    className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 text-xs"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Edit Modal */}
        {isEditOpen && editingPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Edit Post</h2>
                <button
                  onClick={closeEditModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    value={editForm.title || ""}
                    onChange={(e) => handleEditChange("title", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Enter post title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={editForm.description || ""}
                    onChange={(e) =>
                      handleEditChange("description", e.target.value)
                    }
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                    placeholder="What's this post about?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    value={editForm.place || ""}
                    onChange={(e) => handleEditChange("place", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="e.g., School Garden, Classroom 3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Media Type
                  </label>
                  <select
                    value={editForm.mediaType || ""}
                    onChange={(e) =>
                      handleEditChange("mediaType", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  >
                    <option value="">None</option>
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                    <option value="document">Document</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Media URLs
                  </label>
                  <EditMediaList
                    urls={(editForm.mediaUrls || []) as string[]}
                    onAdd={handleAddEditMediaUrl}
                    onRemove={handleRemoveEditMediaUrl}
                  />
                </div>
              </div>

              <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end gap-3">
                <Button onClick={closeEditModal} variant="outline" size="lg">
                  Cancel
                </Button>
                <Button
                  onClick={saveUpdatedPost}
                  size="lg"
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t">
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

              {Array.from({
                length: Math.min(5, totalPages),
              }).map((_, idx) => {
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
