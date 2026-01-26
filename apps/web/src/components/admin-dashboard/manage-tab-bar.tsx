"use client";

import { NurseryTabBar } from "@/features/nursery/components/nursery-tab-bar";
import { Separator } from "@repo/ui/components/separator";
import { usePathname } from "next/navigation";
import React from "react";
import { ClassTabBar } from "../../features/classes/components/class-tab-bar"; // adjust import

const NURSERY_ROUTES = ["/account/manage/nursery", "/account/manage/details"];

const CLASS_ROUTES = ["/account/manage/classes", "/account/manage/class-card"];

export function ManageTabBar() {
  const pathname = usePathname();

  let tabBar: React.ReactNode = null;

  if (
    NURSERY_ROUTES.some((p) => pathname === p || pathname.startsWith(p + "/"))
  ) {
    tabBar = <NurseryTabBar />;
  }

  if (
    CLASS_ROUTES.some((p) => pathname === p || pathname.startsWith(p + "/"))
  ) {
    tabBar = <ClassTabBar />;
  }

  if (!tabBar) return null;

  return (
    <div>
      <Separator />
      {tabBar}
      <Separator />
    </div>
  );
}
