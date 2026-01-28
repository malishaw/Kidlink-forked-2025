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
            href="#"
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

        {/* Center Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/about"
            className={cn(
              "font-medium text-sm hover:underline transition-colors opacity-70 hover:opacity-100",
              isHomePage
                ? "text-white/90 hover:text-white"
                : "text-gray-700 hover:text-[#003580]",
              pathname === "/about" &&
                "text-[#003580] font-semibold opacity-100"
            )}
          >
            About
          </Link>
          <Link
            href="/privacy"
            className={cn(
              "font-medium text-sm hover:underline transition-colors opacity-70 hover:opacity-100",
              isHomePage
                ? "text-white/90 hover:text-white"
                : "text-gray-700 hover:text-[#003580]",
              pathname === "/privacy" &&
                "text-[#003580] font-semibold opacity-100"
            )}
          >
            Privacy Policy
          </Link>
          <Link
            href="/contact"
            className={cn(
              "font-medium text-sm hover:underline transition-colors opacity-70 hover:opacity-100",
              isHomePage
                ? "text-white/90 hover:text-white"
                : "text-gray-700 hover:text-[#003580]",
              pathname === "/contact" &&
                "text-[#003580] font-semibold opacity-100"
            )}
          >
            Contact
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Mobile Menu Button - Optional for mobile navigation */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "text-xs",
                isHomePage ? "text-white" : "text-gray-700"
              )}
            >
              Menu
            </Button>
          </div>

          <Button
            asChild
            variant={"secondary"}
            className={cn(
              isHomePage ? "" : "bg-[#003580] text-white hover:bg-[#002147]"
            )}
          >
            <Link href="/account">My Account</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
