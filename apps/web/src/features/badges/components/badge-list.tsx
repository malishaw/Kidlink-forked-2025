"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import { Button } from "@repo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/dialog";
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
import { useQueryClient } from "@tanstack/react-query";
import { Edit3, Trash2, Upload, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { deleteBadge as deleteBadgeAction } from "../actions/delete-badge.action";
import { BadgesList } from "../actions/get-badge.action";
import { updateBadge } from "../actions/update-badge.action";

interface BadgeData {
  id?: string;
  title: string;
  description: string;
  badgeType: string;
  points: number;
  level: string;
  iconUrl?: string;
  createdAt?: string;
}

interface BadgeListProps {
  organizationId: string;
}

export function BadgeList({ organizationId }: BadgeListProps) {
  const queryClient = useQueryClient();
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<BadgeData | null>(null);
  const [updateFormData, setUpdateFormData] = useState<BadgeData>({
    title: "",
    description: "",
    badgeType: "",
    points: 0,
    level: "",
    iconUrl: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  // Fetch badges using the RPC client
  const { data, isLoading, error } = BadgesList({
    page: 1,
    limit: 10,
    sort: "desc",
    organizationId,
  });

  // Open update modal with badge data
  const openUpdateModal = (badge: BadgeData) => {
    setSelectedBadge(badge);
    setUpdateFormData({
      title: badge.title,
      description: badge.description,
      badgeType: badge.badgeType,
      points: badge.points,
      level: badge.level,
      iconUrl: badge.iconUrl || "",
    });
    setImagePreview(badge.iconUrl || ""); // Set the preview to the current icon URL
    setIsUpdateModalOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (
    field: keyof BadgeData,
    value: string | number
  ) => {
    setUpdateFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        handleInputChange("iconUrl", result); // Update the form data with the image preview URL
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove the selected image
  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    handleInputChange("iconUrl", ""); // Clear the form data for the icon URL
  };

  // Update existing badge with form data
  const handleUpdateSubmit = async () => {
    if (!selectedBadge?.id) return;

    setUpdatingIds((s) => new Set(s).add(selectedBadge.id!));

    try {
      const updated = await updateBadge(
        selectedBadge.id,
        updateFormData as any
      );

      // Replace in SPECIFIC badges cache
      queryClient.setQueryData(
        ["badges", { page: 1, limit: 10, sort: "desc", organizationId }],
        (old: any) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.map((b: any) =>
              b.id === updated.id ? { ...b, ...updated } : b
            ),
          };
        }
      );

      // Also update any other badge list caches
      queryClient.setQueriesData(
        {
          predicate: (query) => {
            const [key] = query.queryKey;
            return key === "badges";
          },
        },
        (old: any) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.map((b: any) =>
              b.id === updated.id ? { ...b, ...updated } : b
            ),
          };
        }
      );

      toast.success("Badge updated successfully!");
      setIsUpdateModalOpen(false);
      setSelectedBadge(null);
    } catch (err: any) {
      console.error("Failed to update badge:", err);
      toast.error(err?.message || "Failed to update badge");
    } finally {
      setUpdatingIds((s) => {
        const next = new Set(s);
        next.delete(selectedBadge.id!);
        return next;
      });
    }
  };

  // Use action to delete with optimistic UI
  const handleDeleteBadge = async (badgeId: string) => {
    const snapshots = queryClient.getQueriesData({
      predicate: (q) => Array.isArray(q.queryKey) && q.queryKey[0] === "badges",
    });

    setDeletingIds((s) => new Set(s).add(badgeId));
    queryClient.setQueriesData(
      {
        predicate: (q) =>
          Array.isArray(q.queryKey) && q.queryKey[0] === "badges",
      },
      (old: any) => {
        if (!old?.data) return old;
        return { ...old, data: old.data.filter((b: any) => b.id !== badgeId) };
      }
    );

    try {
      await deleteBadgeAction(badgeId);
      queryClient.removeQueries({ queryKey: ["badge", badgeId] });
      toast.success("Badge deleted successfully!");
    } catch (error) {
      snapshots.forEach(([key, data]) => queryClient.setQueryData(key, data));
      console.error("Failed to delete badge:", error);
      toast.error((error as Error).message || "Failed to delete badge");
    } finally {
      setDeletingIds((s) => {
        const next = new Set(s);
        next.delete(badgeId);
        return next;
      });
    }
  };

  const getLevelColor = (level: string) => {
    const levelLower = level.toLowerCase();
    if (levelLower.includes("gold"))
      return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-lg";
    if (levelLower.includes("silver"))
      return "bg-gradient-to-r from-gray-400 to-gray-600 text-white shadow-lg";
    if (levelLower.includes("bronze"))
      return "bg-gradient-to-r from-orange-400 to-orange-600 text-white shadow-lg";
    return "bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-lg";
  };

  const getBadgeTypeIcon = (badgeType: string) => {
    const type = badgeType.toLowerCase();
    if (type.includes("achievement")) return "🏆";
    if (type.includes("progress")) return "📈";
    if (type.includes("skill")) return "🎯";
    if (type.includes("participation")) return "👥";
    if (type.includes("creativity")) return "🎨";
    if (type.includes("leadership")) return "⭐";
    return "🏅";
  };

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="group">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-white/50 shadow-xl p-6 animate-pulse">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-3/4"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/2"></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-full"></div>
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-2/3"></div>
                <div className="flex items-center justify-between mt-4">
                  <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-20"></div>
                  <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-16"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-red-500">Failed to load badges. Please try again.</p>
      </div>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-white/50 shadow-xl p-12 max-w-md mx-auto">
          <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-4xl">🏅</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-3">
            No Badges Yet
          </h3>
          <p className="text-slate-600 text-lg leading-relaxed">
            Create your first achievement badge to motivate and reward students
            for their accomplishments!
          </p>
          <div className="mt-6 flex gap-2 justify-center text-sm text-slate-500">
            <span>🎯 Set Goals</span>
            <span>•</span>
            <span>⭐ Reward Progress</span>
            <span>•</span>
            <span>🚀 Inspire Excellence</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data.data.map((badge) => (
          <div key={badge.id} className="group">
            <div className="relative bg-white/70 backdrop-blur-sm rounded-3xl border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] overflow-hidden">
              {/* Decorative Background Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-200/20 to-transparent rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-200/20 to-transparent rounded-full blur-2xl"></div>

              <div className="relative z-10 p-6">
                {/* Header Section */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                      {badge.iconUrl ? (
                        <Avatar className="w-14 h-14">
                          <AvatarImage
                            src={badge.iconUrl}
                            alt={badge.title}
                            className="rounded-xl"
                          />
                          <AvatarFallback className="bg-white/20 text-white font-bold text-lg rounded-xl">
                            {badge.title.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <span className="text-2xl">
                          {getBadgeTypeIcon(badge.badgeType)}
                        </span>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-slate-800 truncate group-hover:text-amber-700 transition-colors">
                      {badge.title}
                    </h3>
                    <p className="text-sm text-slate-600 flex items-center gap-1">
                      <span>{getBadgeTypeIcon(badge.badgeType)}</span>
                      {badge.badgeType}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-600 leading-relaxed line-clamp-2 mb-4 min-h-[2.5rem]">
                  {badge.description}
                </p>

                {/* Footer Section */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold ${getLevelColor(badge.level)}`}
                    >
                      {badge.level}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <span className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                        {badge.points}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        pts
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-white/50">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openUpdateModal(badge)}
                    className="flex-1 h-10 bg-blue-50/50 hover:bg-blue-100/70 text-blue-700 rounded-xl transition-all duration-200 hover:scale-105"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteBadge(badge.id!)}
                    disabled={deletingIds.has(badge.id!)}
                    className="flex-1 h-10 bg-red-50/50 hover:bg-red-100/70 text-red-700 rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {deletingIds.has(badge.id!) ? (
                      <>
                        <div className="w-4 h-4 mr-2 border-2 border-red-200 border-t-red-600 rounded-full animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Update Badge Modal */}
      <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-800">
              Update Badge
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            {/* Title */}
            <div className="grid gap-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Badge Title
              </Label>
              <Input
                id="title"
                value={updateFormData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter badge title"
                className="h-12"
              />
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                value={updateFormData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Enter badge description"
                rows={3}
              />
            </div>

            {/* Badge Type and Level */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="badgeType" className="text-sm font-medium">
                  Badge Type
                </Label>
                <Select
                  value={updateFormData.badgeType}
                  onValueChange={(value) =>
                    handleInputChange("badgeType", value)
                  }
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="achievement">🏆 Achievement</SelectItem>
                    <SelectItem value="progress">📈 Progress</SelectItem>
                    <SelectItem value="skill">🎯 Skill</SelectItem>
                    <SelectItem value="participation">
                      👥 Participation
                    </SelectItem>
                    <SelectItem value="creativity">🎨 Creativity</SelectItem>
                    <SelectItem value="leadership">⭐ Leadership</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="level" className="text-sm font-medium">
                  Level
                </Label>
                <Select
                  value={updateFormData.level}
                  onValueChange={(value) => handleInputChange("level", value)}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bronze">🥉 Bronze</SelectItem>
                    <SelectItem value="silver">🥈 Silver</SelectItem>
                    <SelectItem value="gold">🥇 Gold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Points */}
            <div className="grid gap-2">
              <Label htmlFor="points" className="text-sm font-medium">
                Points
              </Label>
              <Input
                id="points"
                type="number"
                value={updateFormData.points}
                onChange={(e) =>
                  handleInputChange("points", parseInt(e.target.value) || 0)
                }
                placeholder="Enter points"
                className="h-12"
              />
            </div>

            {/* Icon URL (Image Picker) */}
            <div className="grid gap-2">
              <Label className="text-sm font-medium">Badge Icon</Label>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <Label
                    htmlFor="image-upload"
                    className="flex items-center justify-center gap-2 h-12 px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md cursor-pointer border border-input"
                  >
                    <Upload className="h-4 w-4" />
                    Upload Image
                  </Label>
                </div>
                {imagePreview && (
                  <div className="relative">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Badge preview"
                      className="w-16 h-16 object-cover rounded-md border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                      onClick={removeImage}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsUpdateModalOpen(false)}
                className="flex-1 h-12"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateSubmit}
                disabled={updatingIds.has(selectedBadge?.id!)}
                className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              >
                {updatingIds.has(selectedBadge?.id!) ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Badge"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
