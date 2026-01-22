import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("authToken")?.value;
  const pathname = req.nextUrl.pathname;
  
  // Skip middleware for static files and api routes
  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.includes(".")) {
    return NextResponse.next();
  }

  const isLoginPage = pathname === "/login";
  const isSignupPage = pathname === "/signup";
  const isHomePage = pathname === "/";
  const isPublicPage = isLoginPage || isSignupPage;

  // Redirect to login if no token and accessing protected route
  if (!token && !isPublicPage && !isHomePage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Redirect to dashboard if logged in and accessing login page
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Home page redirect
  if (isHomePage) {
    return NextResponse.redirect(new URL(token ? "/dashboard" : "/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
