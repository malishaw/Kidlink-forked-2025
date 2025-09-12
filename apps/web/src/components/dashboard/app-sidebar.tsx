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

  // Move data object inside component so it can access session
  const data = {
    user: {
      name: session?.user?.name,
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
        name: "Payments",
        url: "/account/manage/payment",
        icon: IconBuildings,
      },
    ],
  };

  // Filter documents based on user role
  const filteredDocuments = React.useMemo(() => {
    const userName = session?.user?.name?.toLowerCase();

    if (userName === "nursery owner") {
      return data.documents; // Show all documents
    } else if (userName === "teacher") {
      return data.documents.filter((doc) =>
        [
          "/account/manage/classes",
          "/account/manage/teachers",
          "/account/manage/children",
          "/account/manage/feedback",
        ].includes(doc.url)
      );
    } else if (userName === "parent") {
      return data.documents.filter((doc) =>
        [
          "/account/manage/classes",
          "/account/manage/parents",
          "/account/manage/children",
        ].includes(doc.url)
      );
    }

    return []; // Default to no documents if role is unrecognized
  }, [session?.user?.name, data.documents]);

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
