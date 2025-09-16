"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

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
import { cn } from "@repo/ui/lib/utils";
import { ArrowLeft, Building2, UserCheck } from "lucide-react";

interface InvitationInputFormProps {
  userType: "teacher" | "parent";
  className?: string;
}

export function InvitationInputForm({
  userType,
  className,
}: InvitationInputFormProps) {
  const [invitationId, setInvitationId] = useState("");
  const [isAccepting, setIsAccepting] = useState(false);
  const router = useRouter();

  const handleAcceptInvitation = async () => {
    if (!invitationId.trim()) {
      toast.error("Please enter an invitation ID");
      return;
    }

    setIsAccepting(true);

    try {
      const response = await fetch("/api/auth/organization/accept-invitation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          invitationId: invitationId.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to accept invitation");
      }

      const data = await response.json();
      toast.success(
        "Invitation accepted successfully! Welcome to the organization!"
      );

      // Redirect to account page
      router.push("/account");
    } catch (error) {
      console.error("Error accepting invitation:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to accept invitation"
      );
    } finally {
      setIsAccepting(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const getRoleInfo = () => {
    if (userType === "teacher") {
      return {
        title: "Join as Teacher",
        description:
          "Enter the invitation ID provided by your nursery administrator to join the organization",
        icon: "👩‍🏫",
        gradient: "from-blue-500 to-indigo-600",
      };
    } else {
      return {
        title: "Join as Parent",
        description:
          "Enter the invitation ID provided by your child's nursery to join the organization",
        icon: "👨‍👩‍👧‍👦",
        gradient: "from-pink-500 to-rose-600",
      };
    }
  };

  const roleInfo = getRoleInfo();

  return (
    <div className={cn("flex flex-col gap-6 max-w-md mx-auto", className)}>
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <div
              className={cn(
                "flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br text-white text-2xl shadow-lg mx-auto",
                roleInfo.gradient
              )}
            >
              {roleInfo.icon}
            </div>
          </div>
          <CardTitle className="text-2xl font-heading font-bold">
            {roleInfo.title}
          </CardTitle>
          <CardDescription className="text-base">
            {roleInfo.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="invitation-id" className="text-sm font-medium">
              Invitation ID
            </Label>
            <Input
              id="invitation-id"
              type="text"
              placeholder="Enter your invitation ID"
              value={invitationId}
              onChange={(e) => setInvitationId(e.target.value)}
              disabled={isAccepting}
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              This ID was provided to you by the nursery administrator
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleAcceptInvitation}
              disabled={isAccepting || !invitationId.trim()}
              className={cn(
                "w-full bg-gradient-to-r text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200",
                invitationId.trim()
                  ? `${roleInfo.gradient} hover:shadow-lg`
                  : "from-gray-400 to-gray-500 cursor-not-allowed"
              )}
            >
              {isAccepting ? (
                <>
                  <UserCheck className="mr-2 h-4 w-4 animate-spin" />
                  Accepting Invitation...
                </>
              ) : (
                <>
                  <UserCheck className="mr-2 h-4 w-4" />
                  Accept Invitation
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={handleGoBack}
              disabled={isAccepting}
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Building2 className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900 mb-1">
                  Don't have an invitation ID?
                </p>
                <p className="text-blue-700">
                  Contact your nursery administrator to get an invitation to
                  join the organization.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
