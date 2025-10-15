import { BellIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@repo/ui/components/button";
import { Separator } from "@repo/ui/components/separator";
import { SidebarTrigger } from "@repo/ui/components/sidebar";
import { DashboardBreadcrumb } from "./dashboard-breadcrumb";

export function SiteHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-3 sm:px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />

        {/* Breadcrumb */}
        <DashboardBreadcrumb />

        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <Link href="/account/manage/getnotification">
              <BellIcon className="h-4 w-4" />
            </Link>
          </Button>

          {/* Mobile notification button */}
          <Button variant="ghost" asChild size="icon" className="sm:hidden">
            <Link href="/account/manage/getnotification">
              <BellIcon className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
