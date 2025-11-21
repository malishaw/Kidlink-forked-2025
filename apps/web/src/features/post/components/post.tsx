"use client";

import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { Textarea } from "@repo/ui/components/textarea";
import {
  Bell,
  Calendar,
  Image as ImageIcon,
  Loader2,
  MapPin,
  MessageSquare,
  Plus,
  Send,
  User,
  Users,
  Video,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { authClient } from "@/lib/auth-client";
import { createPost } from "../actions/create-post";
import { useGetAllNurseriess } from "../actions/get-all-nurseries";
import { useGetPosts } from "../actions/get-post";

type PostType = "activity" | "announcement" | "event";
type MediaType = "image" | "video";

interface FormData {
  nurseryId: string;
  authorId: string;
  postType: PostType | "";
  title: string;
  description: string;
  mediaUrls: string[];
  mediaType?: MediaType;
  place?: string;
  organizationId?: string;
}

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
}

interface PostsResponse {
  data: PostData[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export default function NurseryPostsLanding() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    nurseryId: "",
    authorId: "",
    postType: "",
    title: "",
    description: "",
    mediaUrls: [],
    mediaType: undefined,
    place: "",
    organizationId: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showMediaUpload, setShowMediaUpload] = useState<MediaType | null>(
    null
  );
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const { data: session } = authClient.useSession();
  const currentUserId = session?.user?.id || "";

  // Load nurseries
  const { data: nurseries, isLoading: nurseriesLoading } = useGetAllNurseriess({
    limit: 100,
  });

  // Load posts
  const { data: postsData, isLoading: postsLoading } = useGetPosts({
    page,
    limit: 12,
    search: null,
    sort: "desc",
  });

  const posts = (postsData as PostsResponse)?.data || [];
  const totalPages = (postsData as PostsResponse)?.totalPages || 1;
  const totalCount = (postsData as PostsResponse)?.total || 0;

  // Auto-set authorId
  useEffect(() => {
    if (currentUserId) {
      setFormData((prev) => ({ ...prev, authorId: currentUserId }));
    }
  }, [currentUserId]);

  const handlePostTypeChange = (value: PostType) => {
    setFormData((prev) => ({ ...prev, postType: value }));
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: MediaType
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target?.result as string;
          setFormData((prev) => ({
            ...prev,
            mediaUrls: [...prev.mediaUrls, dataUrl],
            mediaType: type,
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveMediaUrl = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      mediaUrls: prev.mediaUrls.filter((_, i) => i !== index),
    }));
  };

  const handleSend = async () => {
    if (
      !formData.postType ||
      !formData.nurseryId ||
      !formData.title ||
      !formData.description
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        nurseryId: formData.nurseryId,
        authorId: currentUserId,
        postType: formData.postType as PostType,
        title: formData.title,
        description: formData.description,
        mediaUrls:
          formData.mediaUrls.length > 0 ? formData.mediaUrls : undefined,
        mediaType: formData.mediaType,
        place: formData.place || undefined,
        organizationId: formData.organizationId || undefined,
      };

      await createPost(payload);

      // Reset form
      setFormData({
        nurseryId: "",
        authorId: currentUserId,
        postType: "",
        title: "",
        description: "",
        mediaUrls: [],
        mediaType: undefined,
        place: "",
        organizationId: "",
      });
      setShowMediaUpload(null);
      setIsModalOpen(false);
      alert("Post created successfully!");
    } catch (error: any) {
      console.error("Failed to create post:", error);
      alert(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeLabel = (type: PostType): string => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const selectedNursery = nurseries?.data?.find(
    (n: any) => n.id === formData.nurseryId
  );

  return (
    <div className="py-12 bg-white">
      {/* Fixed Add Post Button - Top Right */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed top-18 right-6 z-40 flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 font-medium"
      >
        <Plus className="h-5 w-5" />
        Add Post
      </button>

      {/* Landing Page Content */}
      <div className="flex flex-col items-center justify-center p-2 py-3">
        <div className="max-w-2xl text-center space-y-8">
          {/* Hero Icon */}
          <div className="inline-flex items-center justify-center w-15 h-15 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl shadow-2xl">
            <MessageSquare className="h-12 w-12 text-white" />
          </div>

          {/* Hero Text */}
          <div className="px-0 py-0">
            <h1 className="text-3xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
              Nursery Community
            </h1>
            <p className="text-xl text-gray-600 mx-auto max-w-xl">
              Stay connected with your nursery community. Share activities,
              announcements, and events with parents and staff.
            </p>
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto border-0 shadow-2xl">
            <CardHeader className="sticky top-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 border-b flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                  Create New Post
                </CardTitle>
                <CardDescription className="text-base">
                  Share important information with your nursery
                </CardDescription>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </CardHeader>

            <CardContent className="space-y-6 p-8">
              {/* Nursery Selection */}
              <div className="space-y-3">
                <Label
                  htmlFor="nursery"
                  className="text-sm font-medium text-gray-700"
                >
                  Select Nursery *
                </Label>
                <Select
                  value={formData.nurseryId}
                  onValueChange={(val) => handleInputChange("nurseryId", val)}
                >
                  <SelectTrigger id="nursery" className="h-12">
                    <SelectValue
                      placeholder={
                        nurseriesLoading
                          ? "Loading nurseries..."
                          : "Choose a nursery..."
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {nurseries?.data?.map((nursery: any) => (
                      <SelectItem key={nursery.id} value={nursery.id}>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-500" />
                          {nursery.name || `Nursery ${nursery.id}`}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Post Type Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">
                  Post Type *
                </Label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "activity", label: "Activity", icon: Users },
                    {
                      value: "announcement",
                      label: "Announcement",
                      icon: Bell,
                    },
                    { value: "event", label: "Event", icon: Calendar },
                  ].map((type) => (
                    <button
                      key={type.value}
                      onClick={() =>
                        handlePostTypeChange(type.value as PostType)
                      }
                      className={`p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-2 hover:shadow-md ${
                        formData.postType === type.value
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <type.icon className="h-5 w-5" />
                      <span className="text-sm font-medium">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Author Info */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Author
                </Label>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="font-medium text-gray-800">
                    {session?.user?.name || session?.user?.email || "You"}
                  </span>
                </div>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label
                  htmlFor="title"
                  className="text-sm font-medium text-gray-700"
                >
                  Title *
                </Label>
                <Input
                  id="title"
                  placeholder="Enter post title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  maxLength={255}
                  className="h-12 text-base"
                />
                <p className="text-xs text-gray-500 text-right">
                  {formData.title.length}/255
                </p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="text-sm font-medium text-gray-700"
                >
                  Description *
                </Label>
                <Textarea
                  id="description"
                  placeholder="Write your post content here..."
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={5}
                  className="text-base resize-none"
                />
                <p className="text-xs text-gray-500 text-right">
                  {formData.description.length} characters
                </p>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label
                  htmlFor="place"
                  className="text-sm font-medium text-gray-700"
                >
                  Location (Optional)
                </Label>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <Input
                    id="place"
                    placeholder="e.g., Classroom A, Playground"
                    value={formData.place || ""}
                    onChange={(e) => handleInputChange("place", e.target.value)}
                    maxLength={255}
                    className="h-10 text-base"
                  />
                </div>
              </div>

              {/* Media Section */}
              <div className="space-y-4 border-t pt-6">
                <Label className="text-sm font-medium text-gray-700">
                  Add Media (Optional)
                </Label>

                {/* Media Type Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      setShowMediaUpload(
                        showMediaUpload === "image" ? null : "image"
                      )
                    }
                    className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                      showMediaUpload === "image"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <ImageIcon className="h-6 w-6" />
                    <span className="text-sm font-medium">Image</span>
                  </button>

                  <button
                    onClick={() =>
                      setShowMediaUpload(
                        showMediaUpload === "video" ? null : "video"
                      )
                    }
                    className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                      showMediaUpload === "video"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <Video className="h-6 w-6" />
                    <span className="text-sm font-medium">Video</span>
                  </button>
                </div>

                {/* Upload Area */}
                {showMediaUpload === "image" && (
                  <div className="space-y-3">
                    <div
                      onClick={() => imageInputRef.current?.click()}
                      className="border-2 border-dashed border-blue-300 bg-blue-50 rounded-lg p-8 text-center cursor-pointer hover:bg-blue-100 transition"
                    >
                      <ImageIcon className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                      <p className="text-sm font-medium text-blue-900">
                        Click to upload images
                      </p>
                      <p className="text-xs text-blue-700">
                        PNG, JPG, GIF up to 10MB (select multiple)
                      </p>
                    </div>
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleFileUpload(e, "image")}
                      className="hidden"
                    />
                  </div>
                )}

                {showMediaUpload === "video" && (
                  <div className="space-y-3">
                    <div
                      onClick={() => videoInputRef.current?.click()}
                      className="border-2 border-dashed border-purple-300 bg-purple-50 rounded-lg p-8 text-center cursor-pointer hover:bg-purple-100 transition"
                    >
                      <Video className="h-12 w-12 text-purple-600 mx-auto mb-3" />
                      <p className="text-sm font-medium text-purple-900">
                        Click to upload video
                      </p>
                      <p className="text-xs text-purple-700">
                        MP4, WebM up to 50MB
                      </p>
                    </div>
                    <input
                      ref={videoInputRef}
                      type="file"
                      accept="video/*"
                      onChange={(e) => handleFileUpload(e, "video")}
                      className="hidden"
                    />
                  </div>
                )}

                {/* Media Preview */}
                {formData.mediaUrls.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-700">
                      {formData.mediaUrls.length} Media Uploaded:
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {formData.mediaUrls.map((url, idx) => (
                        <div
                          key={idx}
                          className="relative rounded-lg overflow-hidden bg-gray-100 aspect-square"
                        >
                          {formData.mediaType === "image" ? (
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
                            onClick={() => handleRemoveMediaUrl(idx)}
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
                  </div>
                )}
              </div>

              {/* Send Button */}
              <div className="flex gap-3 pt-6 border-t">
                <Button
                  onClick={handleSend}
                  disabled={
                    isLoading ||
                    !formData.postType ||
                    !formData.nurseryId ||
                    !formData.title ||
                    !formData.description
                  }
                  size="lg"
                  className="flex-1 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Publish Post
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => setIsModalOpen(false)}
                  variant="outline"
                  size="lg"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
