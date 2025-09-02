"use client";

import { Button } from "@repo/ui/components/button";
import { cn } from "@repo/ui/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {};

const HotelTabs = [
  { name: "Create Class", href: "/account/manage/classes" },
  { name: "Class Details", href: "/account/manage/class-card" },
];

export function ClassTabBar({}: Props) {
  const pathname = usePathname();

  const currentTab = HotelTabs.find((tab) => tab.href === pathname);

  return (
    <div className="flex items-center gap-0.5">
      {HotelTabs.map((tab) => (
        <Button
          key={tab.href}
          variant={"ghost"}
          className={cn(
            `px-4 min-h-11 h-full rounded-none hover:bg-secondary/30 cursor-pointer`,
            currentTab?.href === tab.href &&
              "border-b-2 border-primary bg-secondary/30"
          )}
          asChild
        >
          <Link href={tab.href}>{tab.name}</Link>
        </Button>
      ))}
    </div>
  );
}
