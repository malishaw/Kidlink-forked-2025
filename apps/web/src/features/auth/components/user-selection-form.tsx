"use client";
import { Building2, GraduationCap, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { authClient } from "@/lib/auth-client";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { cn } from "@repo/ui/lib/utils";

type UserType = "teacher" | "parent" | "nursery-owner";

interface UserTypeOption {
  type: UserType;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  hoverGradient: string;
}

const userTypeOptions: UserTypeOption[] = [
  {
    type: "teacher",
    title: "Teacher",
    description: "I'm an educator who teaches and manages students",
    icon: <GraduationCap className="h-8 w-8" />,
    gradient: "from-blue-500 to-indigo-600",
    hoverGradient: "hover:from-blue-600 hover:to-indigo-700",
  },
  {
    type: "parent",
    title: "Parent",
    description: "I'm a parent looking to connect with my child's education",
    icon: <Heart className="h-8 w-8" />,
    gradient: "from-pink-500 to-rose-600",
    hoverGradient: "hover:from-pink-600 hover:to-rose-700",
  },
  {
    type: "nursery-owner",
    title: "Nursery Owner",
    description: "I own or manage a nursery/educational institution",
    icon: <Building2 className="h-8 w-8" />,
    gradient: "from-purple-500 to-violet-600",
    hoverGradient: "hover:from-purple-600 hover:to-violet-700",
  },
];

export function UserSelectionForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [selectedUserType, setSelectedUserType] = useState<UserType | null>(
    null
  );
  const router = useRouter();

  const handleContinue = async () => {
    if (selectedUserType) {
      const name =
        selectedUserType === "nursery-owner"
          ? "Nursery Owner"
          : selectedUserType === "teacher"
            ? "Teacher"
            : "Parent";

      try {
        await authClient.updateUser({
          name,
          image: "",
        });

        if (selectedUserType === "nursery-owner") {
          // Navigate to organization setup for nursery owners
          router.push(
            `/setup-organization?userType=${selectedUserType}&view=profile-setup`
          );
        } else {
          // Navigate to invitation input for teachers and parents
          router.push(`/join-organization?userType=${selectedUserType}`);
        }
      } catch (error) {
        console.error("Failed to update user name", error);
      }
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-heading font-bold">
            Welcome! What describes you best?
          </CardTitle>
          <CardDescription className="text-lg">
            Select your role to personalize your experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {userTypeOptions.map((option) => (
              <div
                key={option.type}
                className={cn(
                  "relative cursor-pointer rounded-xl border-2 p-6 transition-all duration-200",
                  selectedUserType === option.type
                    ? "border-blue-500 bg-blue-50 shadow-lg"
                    : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                )}
                onClick={() => setSelectedUserType(option.type)}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg transition-all duration-200",
                      option.gradient,
                      option.hoverGradient
                    )}
                  >
                    {option.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {option.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {option.description}
                    </p>
                  </div>
                  <div
                    className={cn(
                      "h-6 w-6 rounded-full border-2 transition-all duration-200",
                      selectedUserType === option.type
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    )}
                  >
                    {selectedUserType === option.type && (
                      <div className="h-full w-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Button
              onClick={handleContinue}
              disabled={!selectedUserType}
              className={cn(
                "w-full max-w-md bg-gradient-to-r text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200",
                selectedUserType
                  ? "from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl"
                  : "from-gray-400 to-gray-500 cursor-not-allowed"
              )}
            >
              Continue as{" "}
              {selectedUserType
                ? userTypeOptions.find((opt) => opt.type === selectedUserType)
                    ?.title
                : "..."}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
