// "use client";

// import { Button } from "@repo/ui/components/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@repo/ui/components/card";
// import { Input } from "@repo/ui/components/input";
// import { Label } from "@repo/ui/components/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@repo/ui/components/select";
// import { Textarea } from "@repo/ui/components/textarea";
// import { MessageSquare, Send } from "lucide-react";
// import { useEffect, useState } from "react";

// import { authClient } from "@/lib/auth-client";
// import { createNotification } from "../actions/create-notification";
// import { useGetAllUsers } from "../actions/get-all-user";

// type NotificationStatus =
//   | "event"
//   | "parents meeting"
//   | "fund collection"
//   | "others";

// interface Notification {
//   id: string;
//   type: NotificationStatus;
//   senderId: string;
//   receiverId: string[];
//   topic: string;
//   description: string;
//   createdAt: Date;
// }

// export default function NurseryNotificationSystem() {
//   const [selectedType, setSelectedType] = useState<NotificationStatus | "">("");
//   const [formData, setFormData] = useState({
//     senderId: "",
//     receiverIds: [] as string[],
//     topic: "",
//     description: "",
//   });

//   const [notifications, setNotifications] = useState<Notification[]>([]);

//   const { data: session } = authClient.useSession();
//   const currentUserId = session?.user?.id || "";

//   // Load all users
//   const { data: users, isLoading: usersLoading } = useGetAllUsers({
//     page: 1,
//     limit: 1000,
//     search: "",
//     sort: "asc",
//   });

//   // Auto-set senderId
//   useEffect(() => {
//     if (currentUserId) {
//       setFormData((prev) => ({ ...prev, senderId: currentUserId }));
//     }
//   }, [currentUserId]);

//   const handleTypeChange = (value: NotificationStatus) => {
//     setSelectedType(value);
//     setFormData((prev) => ({
//       ...prev,
//       topic: "",
//       description: "",
//       receiverIds: [],
//     }));
//   };

//   const handleInputChange = (field: string, value: string | string[]) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleSelectAllUsers = () => {
//     if (!users?.data) return;
//     const allIds = users.data.map((user: any) => user.id);
//     setFormData((prev) => ({ ...prev, receiverIds: allIds }));
//   };

//   const handleSend = async () => {
//     if (
//       !selectedType ||
//       formData.receiverIds.length === 0 ||
//       !formData.topic ||
//       !formData.description
//     ) {
//       alert("Please fill all fields and select at least one receiver.");
//       return;
//     }

//     try {
//       const payload = {
//         senderId: currentUserId,
//         receiverId: formData.receiverIds,
//         topic: formData.topic,
//         description: formData.description,
//         type: selectedType,
//       };

//       const newNotification = await createNotification(payload);
//       setNotifications((prev) => [newNotification, ...prev]);

//       setFormData({
//         senderId: currentUserId,
//         receiverIds: [],
//         topic: "",
//         description: "",
//       });
//       setSelectedType("");
//     } catch (error: any) {
//       console.error("Failed to create notification:", error);
//       alert(error.message || "Something went wrong");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background p-4 md:p-6">
//       <div className="mx-auto max-w-4xl space-y-6">
//         <div className="text-center space-y-2">
//           <h1 className="text-3xl font-bold text-foreground">
//             Nursery Notification System
//           </h1>
//           <p className="text-muted-foreground">
//             Send important updates to parents and staff
//           </p>
//         </div>

//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <MessageSquare className="h-5 w-5" />
//               Create New Notification
//             </CardTitle>
//             <CardDescription>
//               Select a notification type and fill in the details below
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             {/* Notification Type */}
//             <div className="space-y-2">
//               <Label>Notification Type</Label>
//               <Select value={selectedType} onValueChange={handleTypeChange}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select notification type" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="event">Event</SelectItem>
//                   <SelectItem value="parents meeting">
//                     Parents Meeting
//                   </SelectItem>
//                   <SelectItem value="fund collection">
//                     Fund Collection
//                   </SelectItem>
//                   <SelectItem value="others">Others</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* Sender */}
//             <div className="space-y-2">
//               <Label>Sender</Label>
//               <p className="text-sm text-muted-foreground">
//                 {session?.user?.name || session?.user?.email || "You"}
//               </p>
//             </div>

//             {/* Receiver Multi-Select with "Select All" */}
//             <div className="space-y-2">
//               <Label>Receiver(s)</Label>
//               <Button
//                 size="sm"
//                 variant="outline"
//                 onClick={handleSelectAllUsers}
//                 className="mb-2"
//               >
//                 Select All Users
//               </Button>
//               <Select
//                 value={formData.receiverIds}
//                 onValueChange={(val) => handleInputChange("receiverIds", val)}
//                 multiple
//               >
//                 <SelectTrigger>
//                   <SelectValue
//                     placeholder={
//                       usersLoading ? "Loading..." : "Select receivers"
//                     }
//                   />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {users?.data?.map((user: any) => (
//                     <SelectItem key={user.id} value={user.id}>
//                       {user.name || user.email || `User ${user.id}`}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* Topic */}
//             <div className="space-y-2">
//               <Label>Topic</Label>
//               <Input
//                 placeholder="Enter notification topic"
//                 value={formData.topic}
//                 onChange={(e) => handleInputChange("topic", e.target.value)}
//               />
//             </div>

//             {/* Description */}
//             <div className="space-y-2">
//               <Label>Description</Label>
//               <Textarea
//                 placeholder="Enter detailed description"
//                 value={formData.description}
//                 onChange={(e) =>
//                   handleInputChange("description", e.target.value)
//                 }
//                 rows={4}
//               />
//             </div>

//             {/* Send Button */}
//             <div className="flex gap-2 pt-2">
//               <Button
//                 onClick={handleSend}
//                 className="flex items-center gap-2"
//                 disabled={
//                   formData.receiverIds.length === 0 ||
//                   !formData.topic ||
//                   !formData.description
//                 }
//               >
//                 <Send className="h-4 w-4" />
//                 Send
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }

"use client";

import { Badge } from "@repo/ui/components/badge";
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
  Check,
  DollarSign,
  Info,
  MessageSquare,
  Send,
  User,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import { authClient } from "@/lib/auth-client";
import { createNotification } from "../actions/create-notification";
import { useGetAllUsers } from "../actions/get-all-user";

type NotificationStatus =
  | "event"
  | "parents meeting"
  | "fund collection"
  | "others";

interface Notification {
  id: string;
  type: NotificationStatus;
  senderId: string;
  receiverId: string[];
  topic: string;
  description: string;
  createdAt: Date;
}

export default function NurseryNotificationSystem() {
  const [selectedType, setSelectedType] = useState<NotificationStatus | "">("");
  const [formData, setFormData] = useState({
    senderId: "",
    receiverIds: [] as string[],
    topic: "",
    description: "",
  });

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { data: session } = authClient.useSession();
  const currentUserId = session?.user?.id || "";

  // Load all users
  const { data: users, isLoading: usersLoading } = useGetAllUsers({
    page: 1,
    limit: 1000,
    search: "",
    sort: "asc",
  });

  // Auto-set senderId
  useEffect(() => {
    if (currentUserId) {
      setFormData((prev) => ({ ...prev, senderId: currentUserId }));
    }
  }, [currentUserId]);

  const handleTypeChange = (value: NotificationStatus) => {
    setSelectedType(value);
    setFormData((prev) => ({
      ...prev,
      topic: "",
      description: "",
      receiverIds: [],
    }));
  };

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectAllUsers = () => {
    if (!users?.data) return;
    const allIds = users.data.map((user: any) => user.id);
    setFormData((prev) => ({ ...prev, receiverIds: allIds }));
  };

  const handleRemoveUser = (userId: string) => {
    setFormData((prev) => ({
      ...prev,
      receiverIds: prev.receiverIds.filter((id) => id !== userId),
    }));
  };

  const handleSend = async () => {
    if (
      !selectedType ||
      formData.receiverIds.length === 0 ||
      !formData.topic ||
      !formData.description
    ) {
      alert("Please fill all fields and select at least one receiver.");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        senderId: currentUserId,
        receiverId: formData.receiverIds,
        topic: formData.topic,
        description: formData.description,
        type: selectedType,
      };

      const newNotification = await createNotification(payload);
      setNotifications((prev) => [newNotification, ...prev]);

      setFormData({
        senderId: currentUserId,
        receiverIds: [],
        topic: "",
        description: "",
      });
      setSelectedType("");
    } catch (error: any) {
      console.error("Failed to create notification:", error);
      alert(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeIcon = (type: NotificationStatus) => {
    switch (type) {
      case "event":
        return <Calendar className="h-4 w-4" />;
      case "parents meeting":
        return <Users className="h-4 w-4" />;
      case "fund collection":
        return <DollarSign className="h-4 w-4" />;
      case "others":
        return <Info className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: NotificationStatus) => {
    switch (type) {
      case "event":
        return "bg-blue-500/10 text-blue-600 border-blue-200";
      case "parents meeting":
        return "bg-green-500/10 text-green-600 border-green-200";
      case "fund collection":
        return "bg-orange-500/10 text-orange-600 border-orange-200";
      case "others":
        return "bg-purple-500/10 text-purple-600 border-purple-200";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-200";
    }
  };

  const selectedUsers =
    users?.data?.filter((user: any) =>
      formData.receiverIds.includes(user.id)
    ) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 md:p-6">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-full shadow-lg mb-4">
            <Bell className="h-8 w-8 text-white" />
          </div>

          <h1 className="text-4xl font-bold text-black">
            Nursery Notification System
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Send important updates and announcements to parents, staff, and
            caregivers instantly
          </p>
        </div>
        {/* Main Form Card */}
        <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-500/5 to-indigo-500/5 border-b">
            <CardTitle className="flex items-center gap-3 text-xl">
              <MessageSquare className="h-6 w-6 text-blue-600" />
              Create New Notification
            </CardTitle>
            <CardDescription className="text-base">
              Choose your notification type and compose your message
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-8">
            {/* Notification Type */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">
                Notification Type
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { value: "event", label: "Event", icon: Calendar },
                  {
                    value: "parents meeting",
                    label: "Parents Meeting",
                    icon: Users,
                  },
                  {
                    value: "fund collection",
                    label: "Fund Collection",
                    icon: DollarSign,
                  },
                  { value: "others", label: "Others", icon: Info },
                ].map((type) => (
                  <button
                    key={type.value}
                    onClick={() =>
                      handleTypeChange(type.value as NotificationStatus)
                    }
                    className={`p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-2 hover:shadow-md ${
                      selectedType === type.value
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

            {/* Sender Info */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Sender
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

            {/* Receiver Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-gray-700">
                  Recipients
                </Label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleSelectAllUsers}
                  disabled={usersLoading}
                  className="text-xs"
                >
                  <Users className="h-3 w-3 mr-1" />
                  Select All ({users?.data?.length || 0})
                </Button>
              </div>

              {/* User Selection Dropdown */}
              <Select
                value=""
                onValueChange={(val) => {
                  if (!formData.receiverIds.includes(val)) {
                    handleInputChange("receiverIds", [
                      ...formData.receiverIds,
                      val,
                    ]);
                  }
                }}
              >
                <SelectTrigger className="h-12">
                  <SelectValue
                    placeholder={
                      usersLoading ? "Loading users..." : "Add recipients..."
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {users?.data?.map((user: any) => (
                    <SelectItem
                      key={user.id}
                      value={user.id}
                      disabled={formData.receiverIds.includes(user.id)}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                          <User className="h-3 w-3 text-gray-500" />
                        </div>
                        {user.name || user.email || `User ${user.id}`}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Selected Users Display */}
              {selectedUsers.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Selected Recipients ({selectedUsers.length}):
                  </p>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {selectedUsers.map((user: any) => (
                      <Badge
                        key={user.id}
                        variant="secondary"
                        className="flex items-center gap-1 py-1 px-2"
                      >
                        {user.name || user.email || `User ${user.id}`}
                        <button
                          onClick={() => handleRemoveUser(user.id)}
                          className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Topic */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Subject
              </Label>
              <Input
                placeholder="Enter a clear, descriptive subject line..."
                value={formData.topic}
                onChange={(e) => handleInputChange("topic", e.target.value)}
                className="h-12 text-base"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Message
              </Label>
              <Textarea
                placeholder="Write your detailed message here. Be clear and include all necessary information..."
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                rows={5}
                className="text-base resize-none"
              />
              <div className="text-xs text-gray-500 text-right">
                {formData.description.length} characters
              </div>
            </div>

            {/* Send Button */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                onClick={handleSend}
                disabled={
                  isLoading ||
                  formData.receiverIds.length === 0 ||
                  !formData.topic ||
                  !formData.description ||
                  !selectedType
                }
                size="lg"
                className="flex items-center gap-2 bg-gradient-to-r bg-black   text-white font-medium px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {isLoading ? "Sending..." : "Send Notification"}
              </Button>

              {/* Preview Info */}
              <div className="flex items-center gap-2 text-sm text-gray-500 ml-auto">
                <Check className="h-4 w-4" />
                {formData.receiverIds.length} recipient
                {formData.receiverIds.length !== 1 ? "s" : ""} selected
              </div>
            </div>
          </CardContent>
        </Card>
        .{/* Quick Stats */}
        {selectedType && (
          <Card className="shadow-md border-0 bg-white/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${getTypeColor(selectedType)}`}
                  >
                    {getTypeIcon(selectedType)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {selectedType.charAt(0).toUpperCase() +
                        selectedType.slice(1)}{" "}
                      Notification
                    </p>
                    <p className="text-sm text-gray-500">
                      Ready to send to {formData.receiverIds.length} recipient
                      {formData.receiverIds.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-white">
                  {selectedType}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
