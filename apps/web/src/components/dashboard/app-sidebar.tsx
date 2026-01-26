"use client";

import { IconBuildings } from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";
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
  const pathname = usePathname();
  const router = useRouter();

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
    documents: [
      {
        name: "Manage Nursery",
        url: "/account/manage/nursery",
        icon: IconBuildings,
      },
      { name: "Classes", url: "/account/manage/classes", icon: IconBuildings },
      {
        name: "Teachers",
        url: "/account/manage/teachers",
        icon: IconBuildings,
      },
      // { name: "Parents", url: "/account/manage/parents", icon: IconBuildings },
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
      { name: "Badges", url: "/account/manage/badges", icon: IconBuildings },
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
      { name: "Events", url: "/account/manage/events", icon: IconBuildings },
      { name: "Chat", url: "/account/manage/chat", icon: IconBuildings },
      { name: "Gallery", url: "/account/manage/gallery", icon: IconBuildings },
      { name: "Payments", url: "/account/manage/payment", icon: IconBuildings },
    ],
  };

  // --- Parent specific docs (under /account/parent) ---
  const parentDocuments = [
    // { name: "Classes", url: "/account/parent/classes", icon: IconBuildings },
    { name: "Children", url: "/account/parent/children", icon: IconBuildings },
    { name: "Events", url: "/account/parent/events", icon: IconBuildings },
    { name: "Parents", url: "/account/parent/parents", icon: IconBuildings },
    {
      name: "Lesson Plans",
      url: "/account/parent/lessonplans",
      icon: IconBuildings,
    },
    { name: "Payments", url: "/account/parent/payment", icon: IconBuildings },
  ];

  // Filter documents based on organization role
  const filteredDocuments = React.useMemo(() => {
    if (isLoadingMember || !activeMember) return [];
    const role = activeMember.role.toLowerCase();

    let docs = [];
    if (role === "owner") {
      docs = data.documents;
    } else if (role === "teacher") {
      docs = data.documents.filter((d) =>
        [
          "/account/manage/classes",
          "/account/manage/children",
          "/account/manage/teachers",
          "/account/manage/badges",
          "/account/manage/lessonplans",
          "/account/manage/events",
        ].includes(d.url)
      );
    } else if (role === "parent") {
      docs = parentDocuments;
    }

    return docs.map((d) => ({ ...d, isActive: pathname === d.url }));
  }, [activeMember, isLoadingMember, pathname, data.documents]);

  // --- Redirect parent role to /account/parent namespace ---
  React.useEffect(() => {
    if (!activeMember) return;
    const role = activeMember.role.toLowerCase();
    if (role === "parent") {
      // If still on /account/manage/* move to parallel /account/parent/*
      if (pathname.startsWith("/account/manage/")) {
        const target = pathname.replace("/account/manage/", "/account/parent/");
        router.replace(target);
        return;
      }
      // If on /account root redirect to a default parent page
      if (pathname === "/account" || pathname === "/account/") {
        router.replace("/account/parent/classes");
      }
    }
  }, [activeMember, pathname, router]);

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
        <NavDocuments items={filteredDocuments} />
        <NavSecondary items={[]} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
