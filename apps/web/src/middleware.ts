import { betterFetch } from "@better-fetch/fetch";
import type { Session } from "@nextplate/api/lib/auth.js";
import { NextResponse, type NextRequest } from "next/server";
import { getUserType } from "./lib/helpers/get-user-type";

const authRoutes = [
  "/signin",
  "/signup",
  "/reset-password",
  "/forgot-password",
  "/email-verified",
];

const protectedRoutes = ["/admin", "/account"];

const requestUrl = "https://kidlink.donext.org";

export default async function authMiddleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isProtectedPath = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-url", requestUrl);

  if (authRoutes.includes(pathname) || isProtectedPath) {
    // Fetch session
    const { data: session } = await betterFetch<Session>(
      "/api/auth/get-session",
      {
        baseURL: requestUrl,
        headers: {
          //get the cookie from the request
          cookie: request.headers.get("cookie") || "",
        },
      }
    );

    // If Auth route and Already authenticated,
    // Redirect back to appropiate path
    if (authRoutes.includes(pathname) && session) {
      const userType = await getUserType();

      if (userType === "systemAdmin") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }

      if (userType === "user" || userType === "hotelOwner") {
        return NextResponse.redirect(new URL("/account", request.url));
      }
    }

    // If protected route and Not authenticated,
    // Redirect back to signin
    if (isProtectedPath && !session) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    // If authenticated, and trying to access '/account'
    if (session && pathname.startsWith("/account")) {
      if (session.user.role === "admin") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }

      /***
       * Check if user is a hotel owner and active organization is set.
       */
      if (!session.session.activeOrganizationId) {
        const { data: organizationsList } = await betterFetch(
          "/api/auth/organization/list",
          {
            baseURL: requestUrl,
            headers: {
              //get the cookie from the request
              cookie: request.headers.get("cookie") || "",
            },
          }
        );

        const orgId = (organizationsList as any[])?.[0]?.id as string;
        const orgRole = (organizationsList as any[])?.[0]?.role as string;

        if (orgRole !== "member") {
          const switchRes = await betterFetch(
            "/api/auth/organization/set-active",
            {
              baseURL: requestUrl,
              headers: {
                cookie: request.headers.get("cookie") || "",
              },
              method: "POST",
              body: { organizationId: orgId },
            }
          );

          console.log(
            `Agent '${session.session.userId}' switched to organization: '${orgId}'`
          );
        }
      }
    }

    // If authenticated, and trying to access '/admin'
    if (session && pathname.startsWith("/admin")) {
      const userType = await getUserType();

      if (userType === "systemAdmin") {
        return NextResponse.next();
      }

      if (userType === "hotelOwner" || userType === "user") {
        return NextResponse.redirect(new URL("/account", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
