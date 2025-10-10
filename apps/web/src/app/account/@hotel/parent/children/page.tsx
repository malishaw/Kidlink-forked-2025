"use client";

import { useGetBadgeById } from "@/features/badges/actions/get-badge-by-id.action";
import { useGetChildrenByParentId } from "@/features/children/actions/get-child-by-parent-id";
import { useGetClassById } from "@/features/children/actions/get-class-by-id";
import { useGetFeedbacksByChildId } from "@/features/feedback/actions/get-feedback-by-child";
import { authClient } from "@/lib/auth-client";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import { Badge } from "@repo/ui/components/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Skeleton } from "@repo/ui/components/skeleton";
import {
  AlertCircle,
  Award,
  Baby,
  Calendar,
  Clock,
  GraduationCap,
  Heart,
  MapPin,
  MessageSquare,
  Sparkles,
  Star,
  ThumbsUp,
  Trophy,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

// Child Card Component
const ChildCard = ({ child }: { child: any }) => {
  const { data: classData, isLoading: classLoading } = useGetClassById(
    child.classId || ""
  );

  const { data: badgeData, isLoading: badgeLoading } = useGetBadgeById(
    child.badgeId?.[0] || ""
  );

  const { data: feedbackData, isLoading: feedbackLoading } =
    useGetFeedbacksByChildId(child.id, { page: 1, limit: 3, sort: "desc" });

  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return "N/A";
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateShort = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getFeedbackTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case "positive":
        return "bg-green-100 text-green-800 border-green-200";
      case "negative":
        return "bg-red-100 text-red-800 border-red-200";
      case "neutral":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const getFeedbackIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case "positive":
        return <ThumbsUp className="w-3 h-3" />;
      case "negative":
        return <AlertCircle className="w-3 h-3" />;
      default:
        return <MessageSquare className="w-3 h-3" />;
    }
  };

  return (
    <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 border-0 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="w-16 h-16 ring-4 ring-blue-100 group-hover:ring-blue-200 transition-all duration-300">
              <AvatarImage
                src={child.profileImageUrl || ""}
                alt={child.name}
                className="object-cover"
              />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold text-xl">
                {child.name?.charAt(0)?.toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-pink-400 to-red-400 rounded-full flex items-center justify-center">
              <Baby className="w-3 h-3 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
              {child.name}
              <Sparkles className="w-5 h-5 text-yellow-500" />
            </CardTitle>
            <p className="text-slate-600 font-medium">
              {calculateAge(child.dateOfBirth)}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Personal Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-800">
                  Date of Birth
                </p>
                <p className="text-sm text-blue-700">
                  {formatDate(child.dateOfBirth)}
                </p>
              </div>
            </div>

            {child.gender && (
              <div className="flex items-center gap-3 p-3 bg-pink-50 rounded-lg">
                <Heart className="w-5 h-5 text-pink-600" />
                <div>
                  <p className="text-sm font-medium text-pink-800">Gender</p>
                  <p className="text-sm text-pink-700 capitalize">
                    {child.gender}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {child.emergencyContact && (
              <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                <MapPin className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-red-800">
                    Emergency Contact
                  </p>
                  <p className="text-sm text-red-700">
                    {child.emergencyContact}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <Clock className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800">
                  Enrolled Since
                </p>
                <p className="text-sm text-green-700">
                  {formatDate(child.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Class Information */}
        <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-100">
          <div className="flex items-center gap-2 mb-3">
            <GraduationCap className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold text-indigo-800">Current Class</h3>
          </div>
          {classLoading ? (
            <Skeleton className="h-6 w-32" />
          ) : classData ? (
            <div className="space-y-2">
              <Badge
                variant="secondary"
                className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200"
              >
                {classData.name}
              </Badge>
              {classData.description && (
                <p className="text-sm text-indigo-700">
                  {classData.description}
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-slate-500 italic">No class assigned</p>
          )}
        </div>

        {/* Badge Information */}
        <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-100">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-5 h-5 text-yellow-600" />
            <h3 className="font-semibold text-yellow-800">Latest Badge</h3>
          </div>
          {badgeLoading ? (
            <Skeleton className="h-6 w-32" />
          ) : badgeData ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                >
                  <Award className="w-3 h-3 mr-1" />
                  {badgeData.title}
                </Badge>
                {badgeData.points && (
                  <span className="text-sm font-medium text-yellow-700">
                    {badgeData.points} pts
                  </span>
                )}
              </div>
              {badgeData.description && (
                <p className="text-sm text-yellow-700">
                  {badgeData.description}
                </p>
              )}
              {badgeData.awardedAt && (
                <p className="text-xs text-yellow-600">
                  Awarded: {formatDate(badgeData.awardedAt)}
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-slate-500 italic">
              No badges earned yet
            </p>
          )}
        </div>

        {/* Recent Feedback Section */}
        <div className="p-4 bg-gradient-to-r from-cyan-50 to-teal-50 rounded-xl border border-cyan-100">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-5 h-5 text-cyan-600" />
            <h3 className="font-semibold text-cyan-800">Recent Feedback</h3>
          </div>
          {feedbackLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ) : feedbackData?.data && feedbackData.data.length > 0 ? (
            <div className="space-y-3">
              {feedbackData.data.slice(0, 2).map((feedback: any) => (
                <div
                  key={feedback.id}
                  className="bg-white/60 p-3 rounded-lg border border-cyan-100"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Badge
                      variant="outline"
                      className={`text-xs ${getFeedbackTypeColor(feedback.type)} border`}
                    >
                      {getFeedbackIcon(feedback.type)}
                      <span className="ml-1 capitalize">
                        {feedback.type || "General"}
                      </span>
                    </Badge>
                    <span className="text-xs text-cyan-600">
                      {formatDateShort(feedback.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-cyan-800 line-clamp-2">
                    {feedback.content || feedback.message}
                  </p>
                  {feedback.teacherName && (
                    <p className="text-xs text-cyan-600 mt-1">
                      - {feedback.teacherName}
                    </p>
                  )}
                </div>
              ))}
              {feedbackData.meta?.totalCount > 2 && (
                <p className="text-xs text-cyan-600 text-center">
                  +{feedbackData.meta.totalCount - 2} more feedback(s)
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-slate-500 italic">
              No feedback available yet
            </p>
          )}
        </div>

        {/* Medical Notes */}
        {child.medicalNotes && (
          <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-purple-800">Medical Notes</h3>
            </div>
            <p className="text-sm text-purple-700">{child.medicalNotes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function ParentChildrenPage() {
  const { data: session } = authClient.useSession();
  const [activeMember, setActiveMember] = useState<any>(null);
  const [isLoadingMember, setIsLoadingMember] = useState(true);

  // Fetch active member to get the userId
  useEffect(() => {
    const fetchActiveMember = async () => {
      try {
        setIsLoadingMember(true);
        const response = await fetch(
          "/api/auth/organization/get-active-member"
        );
        if (response.ok) {
          const memberData = await response.json();
          setActiveMember(memberData);
        }
      } catch (error) {
        console.error("Failed to fetch active member:", error);
      } finally {
        setIsLoadingMember(false);
      }
    };
    fetchActiveMember();
  }, []);

  // Get children by parent ID (using userId)
  const {
    data: childrenData,
    isLoading: childrenLoading,
    error: childrenError,
  } = useGetChildrenByParentId(activeMember?.userId || "");

  if (isLoadingMember || childrenLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Skeleton */}
          <div className="text-center space-y-4">
            <Skeleton className="h-12 w-64 mx-auto" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>

          {/* Cards Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6">
                <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
                <Skeleton className="h-6 w-32 mx-auto mb-2" />
                <Skeleton className="h-4 w-24 mx-auto mb-4" />
                <div className="space-y-3">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (childrenError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
        <Card className="p-8 text-center max-w-md">
          <div className="text-red-500 mb-4">
            <Users className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Error Loading Children
          </h2>
          <p className="text-slate-600">{childrenError.message}</p>
        </Card>
      </div>
    );
  }

  const children = childrenData?.data || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-white/20 rounded-full">
                <Users className="w-8 h-8" />
              </div>
              <h1 className="text-4xl font-bold">My Children</h1>
            </div>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Track your children's progress, activities, and achievements in
              their learning journey
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-blue-100">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4" />
                <span>Real-time updates</span>
              </div>
              <div className="flex items-center gap-1">
                <Award className="w-4 h-4" />
                <span>Achievement tracking</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                <span>Teacher feedback</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {children.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-slate-400 mb-6">
              <Baby className="w-24 h-24 mx-auto" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-4">
              No Children Found
            </h2>
            <p className="text-slate-600 text-lg">
              It looks like you don't have any children enrolled yet.
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">
                Welcome back! 👋
              </h2>
              <p className="text-slate-600 text-lg">
                You have{" "}
                <span className="font-semibold text-blue-600">
                  {children.length}
                </span>
                {children.length === 1 ? " child" : " children"} enrolled
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {children.map((child: any) => (
                <ChildCard key={child.id} child={child} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
