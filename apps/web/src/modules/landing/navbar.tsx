"use client";

import { Button } from "@repo/ui/components/button";
import { cn } from "@repo/ui/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <header
      className={cn(
        "w-full z-50 transition-all duration-300",
        isHomePage
          ? "absolute top-0 left-0 text-white"
          : "sticky top-0 bg-white border-b border-gray-200 shadow-sm text-gray-900"
      )}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between mt-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-md">
        <div className="flex items-center gap-5">
          {/* Logo */}
          <Link
            href="/"
            className={cn(
              "font-black text-2xl font-heading transition-colors",
              isHomePage
                ? "text-white hover:text-gray-200"
                : "text-[#003580] hover:text-[#002147]"
            )}
          >
            KidLink
          </Link>

          {/* Navigation Links */}
          <Link
            href="/search"
            className={cn(
              "font-medium text-sm hover:underline transition-colors opacity-70 hover:opacity-100",
              isHomePage
                ? "text-white/90 hover:text-white"
                : "text-gray-700 hover:text-[#003580]",
              pathname === "/search" && "text-[#003580] font-semibold"
            )}
          >
            Explore
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            asChild
            variant={isHomePage ? "ghost" : "outline"}
            className={cn(
              "transition-all",
              isHomePage
                ? "border border-secondary/20"
                : "text-[#003580] border-[#003580]/20 hover:bg-[#003580]/5"
            )}
          >
            <Link href="/account">+ Post Jobs</Link>
          </Button>
          <Button
            asChild
            variant={"secondary"}
            className={cn(
              isHomePage ? "" : "bg-[#003580] text-white hover:bg-[#002147]"
            )}
          >
            <Link href="/account">My Account</Link>
          </Button>
          <Button
            asChild
            variant={isHomePage ? "ghost" : "outline"}
            className={cn(
              "transition-all",
              isHomePage
                ? "border border-secondary/20"
                : "text-[#003580] border-[#003580]/20 hover:bg-[#003580]/5"
            )}
          >
            <Link href="/profile">My Profile</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
