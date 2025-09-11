"use client";

import { useState } from "react";
import { AddNewBadge } from "./add-new-badge";
import { BadgeList } from "./badge-list";

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

export function BadgeManagement() {
  const [editingBadge, setEditingBadge] = useState<BadgeData | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handleEditBadge = (badge: BadgeData) => {
    setEditingBadge(badge);
    setShowEditDialog(true);
  };

  const handleEditComplete = () => {
    setEditingBadge(null);
    setShowEditDialog(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="relative overflow-hidden bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-white/50 shadow-xl">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-100/30 via-orange-100/30 to-red-100/30"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-amber-200/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-orange-200/20 to-transparent rounded-full blur-3xl"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl">🏆</span>
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-700 via-orange-700 to-red-700 bg-clip-text text-transparent">
                    Badge Management
                  </h1>
                  <p className="text-slate-600 text-lg mt-1">
                    Create and manage achievement badges for students
                  </p>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="flex gap-4 mt-6">
                <div className="bg-white/60 backdrop-blur-sm rounded-xl px-4 py-2 border border-amber-200/50">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-600">⭐</span>
                    <span className="text-sm font-medium text-slate-700">
                      Achievement System
                    </span>
                  </div>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-xl px-4 py-2 border border-orange-200/50">
                  <div className="flex items-center gap-2">
                    <span className="text-orange-600">🎯</span>
                    <span className="text-sm font-medium text-slate-700">
                      Student Motivation
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl blur opacity-25"></div>
              <div className="relative">
                <AddNewBadge />
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-white/50 shadow-xl overflow-hidden">
          <div className="p-8">
            <BadgeList onEditBadge={handleEditBadge} />
          </div>
        </div>

        {showEditDialog && editingBadge && (
          <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-white/50 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
              <AddNewBadge
                editingBadge={editingBadge}
                onEditComplete={handleEditComplete}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
