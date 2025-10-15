"use client";

import { type LucideIcon } from "lucide-react";
import Link from "next/link";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@repo/ui/components/sidebar";
import { cn } from "@repo/ui/lib/utils";

export function NavDocuments({
  items,
}: {
  items: {
    name: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Management</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton
              asChild
              className={cn(
                "transition-colors duration-200",
                item.isActive &&
                  "bg-purple-800 text-white hover:bg-purple-700 [&>svg]:text-white"
              )}
            >
              <Link href={item.url}>
                <item.icon
                  className={cn(
                    "transition-colors duration-200",
                    item.isActive ? "text-white" : "text-muted-foreground"
                  )}
                />
                <span
                  className={cn(
                    "transition-colors duration-200",
                    item.isActive ? "text-white font-medium" : ""
                  )}
                >
                  {item.name}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
