import React from "react";

import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { ManageTabBar } from "@/components/dashboard/manage-tab-bar";
import { SiteHeader } from "@/components/dashboard/site-header";
import { Separator } from "@repo/ui/components/separator";
import { SidebarInset, SidebarProvider } from "@repo/ui/components/sidebar";

type Props = {
  children?: React.ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset className="bg-background">
        <SiteHeader />
        <div>
          <Separator />
          <ManageTabBar />
          <Separator />
        </div>

        <div className="flex flex-1 flex-col">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
