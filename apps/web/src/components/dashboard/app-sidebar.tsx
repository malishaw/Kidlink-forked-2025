"use client";

import { IconBuildings, IconDashboard } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import * as React from "react";

import { NavDocuments } from "@/components/dashboard/nav-documents";
// import { NavMain } from "@/components/dashboard/nav-main";
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
  const { data: session } = authClient.useSession();
  const pathname = usePathname(); // Get current pathname to determine active document

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
      email: session?.user?.email || "user@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard/housing",
        icon: IconDashboard,
        isActive: pathname === "/dashboard/housing",
      },
    ],
    documents: [
      {
        name: "Manage Nursery",
        url: "/account/manage/nursery",
        icon: IconBuildings,
        isActive: pathname === "/account/manage/nursery",
      },
      {
        name: "Classes",
        url: "/account/manage/classes",
        icon: IconBuildings,
        isActive: pathname === "/account/manage/classes",
      },
      {
        name: "Teachers",
        url: "/account/manage/teachers",
        icon: IconBuildings,
        isActive: pathname === "/account/manage/teachers",
      },
      {
        name: "Parents",
        url: "/account/manage/parents",
        icon: IconBuildings,
        isActive: pathname === "/account/manage/parents",
      },
      {
        name: "Notifications",
        url: "/account/manage/notification",
        icon: IconBuildings,
        isActive: pathname === "/account/manage/notification",
      },
      {
        name: "Children",
        url: "/account/manage/children",
        icon: IconBuildings,
        isActive: pathname === "/account/manage/children",
      },
      {
        name: "Feedback",
        url: "/account/manage/feedback",
        icon: IconBuildings,
        isActive: pathname === "/account/manage/feedback",
      },
      {
        name: "Badges",
        url: "/account/manage/badges",
        icon: IconBuildings,
        isActive: pathname === "/account/manage/badges",
      },
      {
        name: "User Management",
        url: "/account/manage/user-management",
        icon: IconBuildings,
        isActive: pathname === "/account/manage/user-management",
      },
      {
        name: "Lesson Plans",
        url: "/account/manage/lessonplans",
        icon: IconBuildings,
        isActive: pathname === "/account/manage/lessonplans",
      },
      {
        name: "Events",
        url: "/account/manage/events",
        icon: IconBuildings,
        isActive: pathname === "/account/manage/events",
      },
      {
        name: "Chat",
        url: "/account/manage/chat",
        icon: IconBuildings,
        isActive: pathname === "/account/manage/chat",
      },
      {
        name: "Gallery",
        url: "/account/manage/gallery",
        icon: IconBuildings,
        isActive: pathname === "/account/manage/gallery",
      },
      {
        name: "Payments",
        url: "/account/manage/payment",
        icon: IconBuildings,
        isActive: pathname === "/account/manage/payment",
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
          "/account/manage/payment",
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
                <div
                  className="h-20 cursor-pointer"
                  onClick={() => (window.location.href = "/")}
                >
                  <img
                    src="/assets/kidlink2.png"
                    alt="KidLink Logo"
                    className="h-30 w-30 object-contain"
                  />
                </div>
              </SidebarMenuButton>
            ) : (
              <></>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* <NavMain items={data.navMain} /> */}
        <NavDocuments items={filteredDocuments} />
        <NavSecondary items={[]} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
