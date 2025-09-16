"use client";

import {
  IconBuildings,
  IconDashboard,
  IconInnerShadowTop,
} from "@tabler/icons-react";
import * as React from "react";

import { NavDocuments } from "@/components/dashboard/nav-documents";
import { NavMain } from "@/components/dashboard/nav-main";
import { NavSecondary } from "@/components/dashboard/nav-secondary";
import { NavUser } from "@/components/dashboard/nav-user";
import { authClient } from "@/lib/auth-client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@repo/ui/components/sidebar";
import { Skeleton } from "@repo/ui/components/skeleton";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const activeOrg = authClient.useActiveOrganization();
  const { data: session } = authClient.useSession(); // Move hook inside component

  // State for organization member data
  const [activeMember, setActiveMember] = React.useState<{
    id: string;
    userId: string;
    organizationId: string;
    role: string;
  } | null>(null);
  const [isLoadingMember, setIsLoadingMember] = React.useState(true);

  // Fetch active organization member
  React.useEffect(() => {
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

  // Move data object inside component so it can access session
  const data = {
    user: {
      name: session?.user?.name || "User",
      email: session?.user?.email || "user@example.com", // Add fallback and safe access
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard/housing",
        icon: IconDashboard,
      },
    ],
    documents: [
      {
        name: "Manage Nursery",
        url: "/account/manage/nursery",
        icon: IconBuildings,
      },

      {
        name: "Classes",
        url: "/account/manage/classes",
        icon: IconBuildings,
      },
      {
        name: "Teachers",
        url: "/account/manage/teachers",
        icon: IconBuildings,
      },
      {
        name: "Parents",
        url: "/account/manage/parents",
        icon: IconBuildings,
      },
      {
        name: "Notifications",
        url: "/account/manage/notification",
        icon: IconBuildings,
      },

      {
        name: "Children",
        url: "/account/manage/children",
        icon: IconBuildings,
      },
      {
        name: "Feedback",
        url: "/account/manage/feedback",
        icon: IconBuildings,
      },
      {
        name: "Badges",
        url: "/account/manage/badges",
        icon: IconBuildings,
      },
      {
        name: "User Management",
        url: "/account/manage/user-management",
        icon: IconBuildings,
      },
      {
        name: "Lesson Plans",
        url: "/account/manage/lessonplans",
        icon: IconBuildings,
      },
      {
        name: "Events",
        url: "/account/manage/events",
        icon: IconBuildings,
      },
      {
        name: "Chat",
        url: "/account/manage/chat",
        icon: IconBuildings,
      },
      {
        name: "Payments",
        url: "/account/manage/payment",
        icon: IconBuildings,
      },
    ],
  };

  // Filter documents based on organization role
  const filteredDocuments = React.useMemo(() => {
    if (isLoadingMember || !activeMember) {
      return []; // Show no documents while loading or if no member data
    }

    const role = activeMember.role.toLowerCase();

    if (role === "owner") {
      return data.documents; // Show all documents
    } else if (role === "teacher") {
      return data.documents.filter((doc) =>
        [
          "/account/manage/classes",
          "/account/manage/children",
          "/account/manage/feedback",
          "/account/manage/badges",
          "/account/manage/lessonplans",
          "/account/manage/events",
        ].includes(doc.url)
      );
    } else if (role === "parent") {
      return data.documents.filter((doc) =>
        [
          "/account/manage/classes",
          "/account/manage/children",
          "/account/manage/events",
        ].includes(doc.url)
      );
    }

    return []; // Default to no documents if role is unrecognized
  }, [activeMember, isLoadingMember, data.documents]);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            {activeOrg.isPending ? (
              <Skeleton className="h-6 w-full rounded-md" />
            ) : activeOrg.data ? (
              <SidebarMenuButton
                asChild
                className="data-[slot=sidebar-menu-button]:!p-1.5"
              >
                <div>
                  <IconInnerShadowTop className="!size-5 text-cyan-500" />
                  <span className="text-base font-semibold text-cyan-500">
                    {session?.user?.name}
                  </span>
                </div>
              </SidebarMenuButton>
            ) : (
              <></>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={filteredDocuments} />
        <NavSecondary items={[]} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
