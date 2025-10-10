"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import { Button } from "@repo/ui/components/button";
import { useQueryClient } from "@tanstack/react-query";
import { Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { BadgesList } from "../actions/get-badge.action";

interface BadgeData {
  id?: string;
  title: string;
  description: string;
  badgeType: string;
  points: number;
  level: string;
  iconUrl: string;
  createdAt?: string;
}

interface BadgeListProps {
  onEditBadge?: (badge: BadgeData) => void;
  organizationId: string; // Pass the current organization ID as a prop
}

export function BadgeList({ onEditBadge, organizationId }: BadgeListProps) {
  const queryClient = useQueryClient();

  // Fetch badges using the RPC client
  const { data, isLoading, error } = BadgesList({
    page: 1,
    limit: 10,
    sort: "desc",
    organizationId, // Filter by the current organization ID
  });

  const deleteBadge = async (badgeId: string) => {
    try {
      const response = await fetch(`/api/badges/${badgeId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || "Failed to delete badge");
      }

      toast.success("Badge deleted successfully!");
      queryClient.invalidateQueries(["badge"]); // Refresh the badge list
    } catch (error) {
      console.error("Failed to delete badge:", error);
      toast.error((error as Error).message || "Failed to delete badge");
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
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {data.data.map((badge, index) => (
        <div key={badge.id || index} className="group">
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
                  {/* Shine effect */}
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
                  onClick={() => onEditBadge?.(badge)}
                  className="flex-1 h-10 bg-blue-50/50 hover:bg-blue-100/70 text-blue-700 rounded-xl transition-all duration-200 hover:scale-105"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteBadge(badge.id!)}
                  className="flex-1 h-10 bg-red-50/50 hover:bg-red-100/70 text-red-700 rounded-xl transition-all duration-200 hover:scale-105"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
