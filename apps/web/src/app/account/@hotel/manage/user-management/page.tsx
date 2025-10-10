"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import {
  CheckCircle,
  Clock,
  Copy,
  Filter,
  MessageCircle,
  RefreshCw,
  Share2,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

interface Invitation {
  id: string;
  email: string;
  role: string;
  organizationId: string;
  inviterId: string;
  status: "pending" | "accepted" | "rejected";
  expiresAt: string;
  createdAt?: string;
}

const UserManagementPage = () => {
  const { data: session } = authClient.useSession(); // Use hook to get session
  const [currentOrganization, setCurrentOrganization] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [isLoadingOrganization, setIsLoadingOrganization] = useState(true);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isLoadingInvitations, setIsLoadingInvitations] = useState(true);

  // Filter state
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Dialog states
  const [isTeacherDialogOpen, setIsTeacherDialogOpen] = useState(false);
  const [isParentDialogOpen, setIsParentDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedInvitation, setSelectedInvitation] =
    useState<Invitation | null>(null);

  // Form states
  const [teacherEmail, setTeacherEmail] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [isInvitingTeacher, setIsInvitingTeacher] = useState(false);
  const [isInvitingParent, setIsInvitingParent] = useState(false);

  // Filtered invitations based on status filter
  const filteredInvitations = useMemo(() => {
    if (statusFilter === "all") {
      return invitations;
    }
    return invitations.filter(
      (invitation) => invitation.status === statusFilter
    );
  }, [invitations, statusFilter]);

  // Get current organization when session changes
  useEffect(() => {
    const getCurrentOrganization = async () => {
      try {
        if (session?.session?.activeOrganizationId) {
          // Fetch organization details using the active organization ID
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_APP_URL}/api/organization/${session.session.activeOrganizationId}`
          );

          if (response.ok) {
            const orgData = await response.json();
            setCurrentOrganization({
              id: orgData.id,
              name: orgData.name,
            });
          } else {
            toast.error("Failed to load current organization");
          }
        } else {
          if (session) {
            // Only show error if session is loaded but no active organization
            toast.error(
              "No active organization found. Please select an organization first."
            );
          }
        }
      } catch (error) {
        console.error("Error getting current organization:", error);
        toast.error("Failed to load organization information");
      } finally {
        setIsLoadingOrganization(false);
      }
    };

    if (session !== undefined) {
      // Only run when session is loaded (not undefined)
      getCurrentOrganization();
    }
  }, [session]);

  // Fetch invitations
  useEffect(() => {
    if (currentOrganization?.id) {
      fetchInvitations();
    }
  }, [currentOrganization]);

  const fetchInvitations = async () => {
    setIsLoadingInvitations(true);
    try {
      const response = await fetch("/api/auth/organization/list-invitations", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        // Assuming the API returns an array of invitations
        setInvitations(Array.isArray(data) ? data : []);
      } else {
        console.error("Failed to fetch invitations");
      }
    } catch (error) {
      console.error("Error fetching invitations:", error);
    } finally {
      setIsLoadingInvitations(false);
    }
  };

  const handleInvite = async (role: "teacher" | "parent", email: string) => {
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }

    if (!currentOrganization) {
      toast.error(
        "No active organization found. Please select an organization first."
      );
      return;
    }

    const setInviting =
      role === "teacher" ? setIsInvitingTeacher : setIsInvitingParent;
    setInviting(true);

    try {
      const response = await fetch("/api/auth/organization/invite-member", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          role,
          organizationId: currentOrganization.id,
          resend: true,
          teamId: "",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to invite user");
      }

      const data = await response.json();
      toast.success(
        `${role === "teacher" ? "Teacher" : "Parent"} invited successfully!`
      );

      // Clear form and close dialog
      if (role === "teacher") {
        setTeacherEmail("");
        setIsTeacherDialogOpen(false);
      } else {
        setParentEmail("");
        setIsParentDialogOpen(false);
      }

      // Refresh invitations list
      fetchInvitations();
    } catch (error) {
      console.error("Error inviting user:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to invite user"
      );
    } finally {
      setInviting(false);
    }
  };

  const generateShareMessage = (invitation: Invitation) => {
    const roleTitle = invitation.role === "teacher" ? "Teacher" : "Parent";
    const orgName = currentOrganization?.name || "our organization";
    const expiryDate = new Date(invitation.expiresAt).toLocaleDateString();

    return `🎓 You're Invited to Join ${orgName}! 🎓

Hello! You've been invited to join our educational community as a ${roleTitle}.

📧 Invitation for: ${invitation.email}
🏛️ Organization: ${orgName}
👩‍🏫 Role: ${roleTitle}
⏰ Valid until: ${expiryDate}

🔗 Invitation ID: ${invitation.id}

Join us in creating an amazing learning environment for our students!

#Education #KidLink #Learning #Community`;
  };

  const handleShareInvitation = (invitation: Invitation) => {
    setSelectedInvitation(invitation);
    setShareDialogOpen(true);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Message copied to clipboard!");
    } catch (error) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        document.execCommand("copy");
        toast.success("Message copied to clipboard!");
      } catch (err) {
        toast.error("Failed to copy message");
        console.error("Failed to copy message:", err);
      }

      document.body.removeChild(textArea);
    }
  };

  const shareToWhatsApp = (message: string) => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  const shareToTelegram = (message: string) => {
    const encodedMessage = encodeURIComponent(message);
    const telegramUrl = `https://t.me/share/url?text=${encodedMessage}`;
    window.open(telegramUrl, "_blank");
  };

  const shareToTwitter = (message: string) => {
    const encodedMessage = encodeURIComponent(message);
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedMessage}`;
    window.open(twitterUrl, "_blank");
  };

  const shareToFacebook = (message: string) => {
    const encodedMessage = encodeURIComponent(message);
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedMessage}`;
    window.open(facebookUrl, "_blank");
  };

  const shareToLinkedIn = (message: string) => {
    const encodedMessage = encodeURIComponent(message);
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedMessage}`;
    window.open(linkedinUrl, "_blank");
  };

  const handleTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleInvite("teacher", teacherEmail);
  };

  const handleParentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleInvite("parent", parentEmail);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
      case "accepted":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Accepted
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <X className="w-3 h-3 mr-1" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  const getRoleBadge = (role: string) => {
    const roleColor =
      role === "teacher"
        ? "bg-blue-100 text-blue-800"
        : "bg-green-100 text-green-800";
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleColor}`}
      >
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status counts for display
  const statusCounts = useMemo(() => {
    const counts = {
      all: invitations.length,
      pending: invitations.filter((inv) => inv.status === "pending").length,
      accepted: invitations.filter((inv) => inv.status === "accepted").length,
      rejected: invitations.filter((inv) => inv.status === "rejected").length,
    };
    return counts;
  }, [invitations]);

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-6xl space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <Users className="h-7 w-7 text-primary" />
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          User Management
        </h1>
      </div>

      {/* Current Organization Display */}
      <Card className="shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Current Organization</CardTitle>
          <CardDescription>
            Adding users to the currently active organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingOrganization ? (
            <p className="text-sm text-gray-500">
              Loading organization information...
            </p>
          ) : currentOrganization ? (
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 bg-green-500 rounded-full"></div>
              <span className="font-medium text-green-700 text-sm">
                {currentOrganization.name}
              </span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 bg-red-500 rounded-full"></div>
              <span className="font-medium text-red-700 text-sm">
                No active organization found
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invite User Section */}
      <Card className="shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Invite Users</CardTitle>
          <CardDescription>
            Invite teachers or parents to join your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Invite Teacher Dialog */}
            <Dialog
              open={isTeacherDialogOpen}
              onOpenChange={setIsTeacherDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Invite Teacher
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md mx-4">
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2">
                    <UserPlus className="h-5 w-5 text-blue-600" />
                    <span>Invite Teacher</span>
                  </DialogTitle>
                  <DialogDescription>
                    Send an invitation to a teacher to join your organization
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleTeacherSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="teacher-email">Email Address</Label>
                    <Input
                      id="teacher-email"
                      type="email"
                      placeholder="teacher@example.com"
                      value={teacherEmail}
                      onChange={(e) => setTeacherEmail(e.target.value)}
                      disabled={isInvitingTeacher}
                      required
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      type="submit"
                      size="sm"
                      disabled={isInvitingTeacher || !teacherEmail.trim()}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      {isInvitingTeacher ? (
                        <>
                          <UserPlus className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Send Invitation
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsTeacherDialogOpen(false)}
                      disabled={isInvitingTeacher}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            {/* Invite Parent Dialog */}
            <Dialog
              open={isParentDialogOpen}
              onOpenChange={setIsParentDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white w-full"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Invite Parent
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md mx-4">
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2">
                    <UserPlus className="h-5 w-5 text-green-600" />
                    <span>Invite Parent</span>
                  </DialogTitle>
                  <DialogDescription>
                    Send an invitation to a parent to join your organization
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleParentSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="parent-email">Email Address</Label>
                    <Input
                      id="parent-email"
                      type="email"
                      placeholder="parent@example.com"
                      value={parentEmail}
                      onChange={(e) => setParentEmail(e.target.value)}
                      disabled={isInvitingParent}
                      required
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      type="submit"
                      size="sm"
                      disabled={isInvitingParent || !parentEmail.trim()}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      {isInvitingParent ? (
                        <>
                          <UserPlus className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Send Invitation
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsParentDialogOpen(false)}
                      disabled={isInvitingParent}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Invitations List */}
      <Card className="shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Invitations</CardTitle>
              <CardDescription>
                Manage pending and accepted invitations
              </CardDescription>
            </div>
            <div className="flex items-center space-x-3">
              {/* Status Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      All ({statusCounts.all})
                    </SelectItem>
                    <SelectItem value="pending">
                      Pending ({statusCounts.pending})
                    </SelectItem>
                    <SelectItem value="accepted">
                      Accepted ({statusCounts.accepted})
                    </SelectItem>
                    <SelectItem value="rejected">
                      Rejected ({statusCounts.rejected})
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchInvitations}
                disabled={isLoadingInvitations}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${isLoadingInvitations ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingInvitations ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin mr-2" />
              <span>Loading invitations...</span>
            </div>
          ) : filteredInvitations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>
                {statusFilter === "all"
                  ? "No invitations found"
                  : `No ${statusFilter} invitations found`}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Expires At</TableHead>
                    <TableHead>Share Invitation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvitations.map((invitation) => (
                    <TableRow
                      key={invitation.id}
                      className={`${
                        invitation.status === "pending"
                          ? "bg-yellow-50 hover:bg-yellow-100"
                          : invitation.status === "accepted"
                            ? "bg-green-50 hover:bg-green-100"
                            : "hover:bg-gray-50"
                      }`}
                    >
                      <TableCell className="font-medium">
                        {invitation.email}
                      </TableCell>
                      <TableCell>{getRoleBadge(invitation.role)}</TableCell>
                      <TableCell>{getStatusBadge(invitation.status)}</TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {formatDate(invitation.expiresAt)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleShareInvitation(invitation)}
                          className="flex items-center space-x-1"
                        >
                          <Share2 className="h-3 w-3" />
                          <span>Share</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Share Invitation Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-lg mx-4">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Share2 className="h-5 w-5 text-blue-600" />
              <span>Share Invitation</span>
            </DialogTitle>
            <DialogDescription>
              Share this invitation with social media or copy the message
            </DialogDescription>
          </DialogHeader>

          {selectedInvitation && (
            <div className="space-y-4">
              {/* Preview Message */}
              <div className="bg-gray-50 p-4 rounded-lg border">
                <Label className="text-sm font-medium mb-2 block">
                  Preview Message:
                </Label>
                <div className="text-sm whitespace-pre-line text-gray-700 max-h-40 overflow-y-auto">
                  {generateShareMessage(selectedInvitation)}
                </div>
              </div>

              {/* Social Media Buttons */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  Share on Social Media:
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      shareToWhatsApp(generateShareMessage(selectedInvitation))
                    }
                    className="bg-green-50 hover:bg-green-100 border-green-200"
                  >
                    <MessageCircle className="h-4 w-4 mr-2 text-green-600" />
                    WhatsApp
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      shareToTelegram(generateShareMessage(selectedInvitation))
                    }
                    className="bg-blue-50 hover:bg-blue-100 border-blue-200"
                  >
                    <MessageCircle className="h-4 w-4 mr-2 text-blue-600" />
                    Telegram
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      shareToTwitter(generateShareMessage(selectedInvitation))
                    }
                    className="bg-sky-50 hover:bg-sky-100 border-sky-200"
                  >
                    <Share2 className="h-4 w-4 mr-2 text-sky-600" />
                    Twitter
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      shareToFacebook(generateShareMessage(selectedInvitation))
                    }
                    className="bg-blue-50 hover:bg-blue-100 border-blue-200"
                  >
                    <Share2 className="h-4 w-4 mr-2 text-blue-700" />
                    Facebook
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      shareToLinkedIn(generateShareMessage(selectedInvitation))
                    }
                    className="bg-blue-50 hover:bg-blue-100 border-blue-200 col-span-2"
                  >
                    <Share2 className="h-4 w-4 mr-2 text-blue-800" />
                    LinkedIn
                  </Button>
                </div>
              </div>

              {/* Copy Button */}
              <div className="flex space-x-2">
                <Button
                  onClick={() =>
                    copyToClipboard(generateShareMessage(selectedInvitation))
                  }
                  className="flex-1"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Message
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShareDialogOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagementPage;
