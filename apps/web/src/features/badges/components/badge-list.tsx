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
  DialogFooter,
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
import { Edit3, Gift, Loader2, Trash2, Upload, X, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
// --- BACKEND COMPONENTS (NOT CHANGED) ---
import { deleteBadge as deleteBadgeAction } from "../actions/delete-badge.action";
import { BadgesList } from "../actions/get-badge.action";
import { updateBadge } from "../actions/update-badge.action";
// ----------------------------------------

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

  // Fetch badges using the RPC client (Logic preserved)
  const { data, isLoading, error } = BadgesList({
    page: 1,
    limit: 10,
    sort: "desc",
    organizationId,
  });

  // Open update modal with badge data (Logic preserved)
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
    setImagePreview(badge.iconUrl || "");
    setIsUpdateModalOpen(true);
  };

  // Handle form input changes (Logic preserved)
  const handleInputChange = (
    field: keyof BadgeData,
    value: string | number
  ) => {
    setUpdateFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle image upload (Logic preserved)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        handleInputChange("iconUrl", result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove the selected image (Logic preserved)
  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    handleInputChange("iconUrl", "");
  };

  // Update existing badge with form data (Logic preserved)
  const handleUpdateSubmit = async () => {
    if (!selectedBadge?.id) return;

    setUpdatingIds((s) => new Set(s).add(selectedBadge.id!));

    try {
      const updated = await updateBadge(
        selectedBadge.id,
        updateFormData as any
      );

      // --- Cache update logic preserved ---
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
      // ------------------------------------

      toast.success("Badge updated successfully! 🚀");
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

  // Use action to delete with optimistic UI (Logic preserved)
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
      toast.success("Badge deleted successfully! 👋");
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

  // Helper functions for UI (Colors and Icons)
  const getLevelColor = (level: string) => {
    const levelLower = level.toLowerCase();
    if (levelLower.includes("gold"))
      return "bg-amber-100 text-amber-700 border-amber-300";
    if (levelLower.includes("silver"))
      return "bg-gray-200 text-gray-700 border-gray-300";
    if (levelLower.includes("bronze"))
      return "bg-orange-100 text-orange-700 border-orange-300";
    return "bg-blue-100 text-blue-700 border-blue-300";
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

  // --- UI Components: Loading, Error, Empty State (Simplified) ---

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm animate-pulse"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-gray-200"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-100 rounded w-full"></div>
              <div className="h-3 bg-gray-100 rounded w-5/6"></div>
            </div>
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
              <div className="h-6 bg-gray-200 rounded-full w-16"></div>
              <div className="h-6 bg-gray-200 rounded w-10"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 bg-red-50 border border-red-200 rounded-xl p-8">
        <p className="text-xl font-medium text-red-600">
          🚨 Failed to load badges.
        </p>
        <p className="text-red-500 mt-2">
          An error occurred while fetching the data. Please check your network
          and try refreshing.
        </p>
      </div>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-12 max-w-lg mx-auto">
          <Gift className="w-16 h-16 text-purple-500 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            No Badges Found
          </h3>
          <p className="text-gray-600 leading-relaxed">
            There are no achievement badges created for this organization yet.
            Start by adding a new one to track and reward accomplishments!
          </p>
          <div className="mt-6 flex gap-3 justify-center text-sm text-gray-500">
            <span className="flex items-center">
              <span className="text-xl mr-1">🎯</span> Motivate
            </span>
            <span>•</span>
            <span className="flex items-center">
              <span className="text-xl mr-1">⭐</span> Reward
            </span>
            <span>•</span>
            <span className="flex items-center">
              <span className="text-xl mr-1">🚀</span> Inspire
            </span>
          </div>
        </div>
      </div>
    );
  }

  // --- Main Badge List Rendering (Redesigned Card UI with Hover Animation) ---

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data.data.map((badge) => (
          <div
            key={badge.id}
            className="group relative bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            {/* HOVER ANIMATION: Glowing Border Effect */}
            <div className="absolute inset-0 rounded-xl border-4 border-transparent group-hover:border-blue-500/50 transition-all duration-300 pointer-events-none"></div>

            {/* Corner 'Points' Tag (Removed to prevent redundancy with new placement) */}

            <div className="p-6">
              {/* Badge Icon & Title */}
              <div className="flex items-start space-x-4 mb-4">
                <div className="flex-shrink-0">
                  {/* Icon Container with subtle group-hover scale effect */}
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                    {badge.iconUrl ? (
                      <Avatar className="w-12 h-12">
                        <AvatarImage
                          src={badge.iconUrl}
                          alt={badge.title}
                          className="rounded-md object-cover"
                        />
                        <AvatarFallback className="bg-white/20 text-white font-bold text-md rounded-md">
                          {badge.title.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <span className="text-xl text-white">
                        {getBadgeTypeIcon(badge.badgeType)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex-1 min-w-0 pt-1">
                  <h3 className="text-lg font-bold text-gray-800 truncate group-hover:text-blue-600 transition-colors">
                    {badge.title}
                  </h3>
                  <div className="flex items-center mt-1">
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${getLevelColor(
                        badge.level
                      )}`}
                    >
                      {badge.level}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 leading-snug line-clamp-3 mb-2 min-h-[3rem]">
                {badge.description}
              </p>

              {/* NEW: Points Display below description */}
              <div className="flex items-center justify-start gap-1 mb-4">
                <Zap className="w-4 h-4 text-blue-500 fill-blue-500/20" />
                <span className="text-sm font-semibold text-gray-800">
                  {badge.points}
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  Points
                </span>
              </div>

              {/* Type and Actions - Separated from the main content */}
              <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                <div className="text-xs text-gray-500 flex items-center gap-1 font-medium">
                  {getBadgeTypeIcon(badge.badgeType)}
                  {badge.badgeType}
                </div>

                <div className="flex gap-1.5">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openUpdateModal(badge)}
                    className="w-8 h-8 text-blue-500 hover:bg-blue-50 hover:text-blue-700"
                    title="Edit Badge"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteBadge(badge.id!)}
                    disabled={deletingIds.has(badge.id!)}
                    className="w-8 h-8 text-red-500 hover:bg-red-50 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete Badge"
                  >
                    {deletingIds.has(badge.id!) ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Update Badge Modal (Form UI preserved from last update) */}
      <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
        <DialogContent className="sm:max-w-[650px] rounded-xl">
          <DialogHeader className="p-4 border-b">
            <DialogTitle className="text-xl font-semibold text-gray-800">
              Edit Badge Details
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 p-6">
            {/* Title */}
            <div className="grid gap-2">
              <Label
                htmlFor="title"
                className="text-sm font-medium text-gray-700"
              >
                Badge Title
              </Label>
              <Input
                id="title"
                value={updateFormData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="e.g., Master Coder Award"
                className="h-10 border-gray-300 focus:border-blue-500"
              />
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <Label
                htmlFor="description"
                className="text-sm font-medium text-gray-700"
              >
                Description
              </Label>
              <Textarea
                id="description"
                value={updateFormData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Describe the criteria for earning this badge."
                rows={3}
                className="border-gray-300 focus:border-blue-500"
              />
            </div>

            {/* Type, Level, and Points - Grouped in a 3-column grid */}
            <div className="grid grid-cols-3 gap-4">
              {/* Badge Type */}
              <div className="grid gap-2">
                <Label
                  htmlFor="badgeType"
                  className="text-sm font-medium text-gray-700"
                >
                  Type
                </Label>
                <Select
                  value={updateFormData.badgeType}
                  onValueChange={(value) =>
                    handleInputChange("badgeType", value)
                  }
                >
                  <SelectTrigger className="h-10 border-gray-300 focus:border-blue-500">
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

              {/* Level */}
              <div className="grid gap-2">
                <Label
                  htmlFor="level"
                  className="text-sm font-medium text-gray-700"
                >
                  Level
                </Label>
                <Select
                  value={updateFormData.level}
                  onValueChange={(value) => handleInputChange("level", value)}
                >
                  <SelectTrigger className="h-10 border-gray-300 focus:border-blue-500">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bronze">🥉 Bronze</SelectItem>
                    <SelectItem value="silver">🥈 Silver</SelectItem>
                    <SelectItem value="gold">🥇 Gold</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Points */}
              <div className="grid gap-2">
                <Label
                  htmlFor="points"
                  className="text-sm font-medium text-gray-700"
                >
                  Points
                </Label>
                <Input
                  id="points"
                  type="number"
                  value={updateFormData.points}
                  onChange={(e) =>
                    handleInputChange("points", parseInt(e.target.value) || 0)
                  }
                  placeholder="e.g., 500"
                  className="h-10 border-gray-300 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Icon URL (Image Picker) */}
            <div className="grid gap-2">
              <Label className="text-sm font-medium text-gray-700">
                Badge Icon
              </Label>
              <div className="flex items-center gap-4 border border-dashed border-gray-200 rounded-lg p-4 bg-gray-50">
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
                    className="flex items-center justify-center gap-2 h-10 px-4 py-2 bg-white text-blue-600 hover:bg-blue-50/70 border border-blue-200 rounded-md cursor-pointer transition-colors text-sm font-medium"
                  >
                    <Upload className="h-4 w-4" />
                    Upload New Icon
                  </Label>
                </div>
                {(imagePreview || selectedBadge?.iconUrl) && (
                  <div className="relative flex-shrink-0">
                    <img
                      src={
                        imagePreview ||
                        selectedBadge?.iconUrl ||
                        "/placeholder.svg"
                      }
                      alt="Badge preview"
                      className="w-16 h-16 object-cover rounded-full border-4 border-white shadow-lg bg-gray-100"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 bg-red-500 hover:bg-red-600"
                      onClick={removeImage}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="p-4 border-t">
            <Button
              variant="outline"
              onClick={() => setIsUpdateModalOpen(false)}
              className="h-10 w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateSubmit}
              disabled={updatingIds.has(selectedBadge?.id!)}
              className="h-10 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
            >
              {updatingIds.has(selectedBadge?.id!) ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving Changes
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
