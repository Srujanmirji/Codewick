import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage =
      req.nextUrl.pathname.startsWith("/login") ||
      req.nextUrl.pathname.startsWith("/signup");
    const isHomePage = req.nextUrl.pathname === "/";
    const isMaintenancePage = req.nextUrl.pathname === "/maintenance";
    const isApiRoute = req.nextUrl.pathname.startsWith("/api/");

    // 🚧 Maintenance Mode: Check platform status for non-API, non-admin routes
    if (!isApiRoute && !isMaintenancePage) {
      try {
        const baseUrl = req.nextUrl.origin;
        const statusRes = await fetch(`${baseUrl}/api/platform/status`, {
          next: { revalidate: 30 }, // Cache for 30 seconds
        });
        const status = await statusRes.json();

        if (status.maintenanceMode) {
          // Admins are always allowed through
          const isAdmin = token?.isAdmin === true;
          if (!isAdmin) {
            return NextResponse.redirect(new URL("/maintenance", req.url));
          }
        }
      } catch {
        // If the status check fails, let users through (fail-open)
      }
    }

    // Allow the maintenance page to be accessed freely
    if (isMaintenancePage) {
      return null;
    }

    if (isAuthPage) {
      if (isAuth) {
        if (token.onboardingComplete) {
          return NextResponse.redirect(new URL("/dashboard", req.url));
        } else {
          return NextResponse.redirect(new URL("/onboarding", req.url));
        }
      }
      return null;
    }

    if (isHomePage) {
      return null;
    }

    if (!isAuth) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const isAdminRoute = req.nextUrl.pathname.startsWith("/dashboard/admin");
    if (isAdminRoute && !token.isAdmin) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Authenticated, check onboarding
    const isOnboardingPage = req.nextUrl.pathname.startsWith("/onboarding");
    if (!token.onboardingComplete && !isOnboardingPage) {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }
    
    if (token.onboardingComplete && isOnboardingPage) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return null;
  },
  {
    callbacks: {
      authorized: () => true, // Let the middleware function handle the logic
    },
  }
);

export const config = {
  matcher: ["/", "/login", "/signup", "/dashboard/:path*", "/onboarding/:path*", "/maintenance"],
};
