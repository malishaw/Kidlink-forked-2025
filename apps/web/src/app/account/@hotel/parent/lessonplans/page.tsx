"use client";

import { useGetChildrenByParentId } from "@/features/children/actions/get-child-by-parent-id";
import { useGetLessonPlansByClassId } from "@/features/lessonPlans/actions/get-lessonPlans-by-class-id";
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
  Baby,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  GraduationCap,
  Lightbulb,
  Search,
  Star,
  Target,
  User,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

// Child Lesson Plans Component
const ChildLessonPlans = ({ child }: { child: any }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: lessonPlansData,
    isLoading: lessonPlansLoading,
    error: lessonPlansError,
  } = useGetLessonPlansByClassId(child.classId || "", {
    page: 1,
    limit: 50,
    sort: "desc",
  });

  const filteredLessonPlans = useMemo(() => {
    if (!lessonPlansData?.data) return [];
    return lessonPlansData.data.filter(
      (plan: any) =>
        plan.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.content?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [lessonPlansData?.data, searchTerm]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "No date";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!child.classId) {
    return (
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-yellow-600" />
          </div>
          <h3 className="text-xl font-semibold text-yellow-800 mb-2">
            No Class Assigned
          </h3>
          <p className="text-yellow-700">
            {child.name} is not currently assigned to any class. Please contact
            the administration to assign a class.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (lessonPlansLoading) {
    return (
      <Card className="bg-white shadow-lg border-0 rounded-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-4">
            <Skeleton className="w-16 h-16 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 border rounded-lg">
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (lessonPlansError) {
    return (
      <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-red-800 mb-2">
            Error Loading Lesson Plans
          </h3>
          <p className="text-red-700">{lessonPlansError.message}</p>
        </CardContent>
      </Card>
    );
  }

  const lessonPlans = filteredLessonPlans || [];

  return (
    <Card className="group bg-white shadow-lg border-0 rounded-2xl overflow-hidden">
      {/* Child Header */}
      <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white pb-6">
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16 ring-4 ring-white/30">
            <AvatarImage
              src={child.profileImageUrl || ""}
              alt={child.name}
              className="object-cover"
            />
            <AvatarFallback className="bg-white/20 text-white font-bold text-xl">
              {child.name?.charAt(0)?.toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              {child.name}
              <Baby className="w-6 h-6" />
            </CardTitle>
            <p className="text-blue-100 font-medium">
              Class ID: {child.classId}
            </p>
            <div className="flex items-center gap-4 mt-2 text-sm text-blue-100">
              <div className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                <span>{lessonPlans.length} Lesson Plans</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Active Learning</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
            <input
              type="text"
              placeholder="Search lesson plans..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-200 text-white placeholder-white/70"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {lessonPlans.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {searchTerm ? "No Matching Lesson Plans" : "No Lesson Plans Yet"}
            </h3>
            <p className="text-gray-600">
              {searchTerm
                ? "No lesson plans match your search criteria."
                : "Lesson plans will appear here once they are created for this class."}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {lessonPlans.map((lessonPlan: any, index: number) => (
              <div
                key={lessonPlan.id}
                className="group/plan relative p-6 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border border-slate-200 hover:shadow-lg transition-all duration-300 hover:border-blue-200"
              >
                {/* Lesson Plan Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-800 group-hover/plan:text-blue-600 transition-colors duration-200">
                        {lessonPlan.title || "Untitled Lesson Plan"}
                      </h4>
                      <div className="flex items-center gap-4 mt-1 text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            Created: {formatDate(lessonPlan.createdAt)}
                          </span>
                        </div>
                        {lessonPlan.updatedAt && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>
                              Updated: {formatDate(lessonPlan.updatedAt)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800 border-green-200"
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Active
                  </Badge>
                </div>

                {/* Lesson Plan Content */}
                <div className="space-y-4">
                  {lessonPlan.content ? (
                    <div className="p-4 bg-white rounded-lg border border-slate-200">
                      <div className="flex items-center gap-2 mb-3">
                        <FileText className="w-5 h-5 text-slate-600" />
                        <h5 className="font-semibold text-slate-800">
                          Lesson Content
                        </h5>
                      </div>
                      <div className="prose prose-sm max-w-none text-slate-700">
                        {lessonPlan.content.length > 300 ? (
                          <>
                            {lessonPlan.content.substring(0, 300)}
                            <span className="text-blue-600 cursor-pointer hover:underline">
                              ... Read more
                            </span>
                          </>
                        ) : (
                          lessonPlan.content
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-gray-500 italic text-center">
                        No content available for this lesson plan.
                      </p>
                    </div>
                  )}

                  {/* Lesson Plan Metadata */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {lessonPlan.teacherId && (
                      <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                        <User className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="text-xs font-medium text-blue-800">
                            Teacher ID
                          </p>
                          <p className="text-sm text-blue-700">
                            {lessonPlan.teacherId}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
                      <Target className="w-4 h-4 text-purple-600" />
                      <div>
                        <p className="text-xs font-medium text-purple-800">
                          Class Focus
                        </p>
                        <p className="text-sm text-purple-700">Educational</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                      <Star className="w-4 h-4 text-green-600" />
                      <div>
                        <p className="text-xs font-medium text-green-800">
                          Status
                        </p>
                        <p className="text-sm text-green-700">In Progress</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -right-4 -top-4 w-16 h-16 rounded-full bg-gradient-to-br from-blue-200 to-purple-200 opacity-20 group-hover/plan:opacity-30 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function ParentLessonPlansPage() {
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
          <div className="space-y-8">
            {[1, 2].map((i) => (
              <Card key={i} className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <div className="space-y-4">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="p-4 border rounded-lg">
                      <Skeleton className="h-6 w-48 mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  ))}
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
                <GraduationCap className="w-8 h-8" />
              </div>
              <h1 className="text-4xl font-bold">Lesson Plans</h1>
            </div>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              View your children's lesson plans and track their educational
              journey
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-blue-100">
              <div className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                <span>Interactive Learning</span>
              </div>
              <div className="flex items-center gap-1">
                <Lightbulb className="w-4 h-4" />
                <span>Skill Development</span>
              </div>
              <div className="flex items-center gap-1">
                <Target className="w-4 h-4" />
                <span>Progress Tracking</span>
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
              <GraduationCap className="w-24 h-24 mx-auto" />
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
                Educational Progress 📚
              </h2>
              <p className="text-slate-600 text-lg">
                Lesson plans for{" "}
                <span className="font-semibold text-blue-600">
                  {children.length}
                </span>
                {children.length === 1 ? " child" : " children"}
              </p>
            </div>

            <div className="space-y-8">
              {children.map((child: any) => (
                <ChildLessonPlans key={child.id} child={child} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
