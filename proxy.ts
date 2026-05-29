import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for the presence of the accessToken cookie
  const accessToken = request.cookies.get("accessToken");

  // Define route types
  const protectedRoute = pathname.startsWith("/home");
  const isAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/signup");
  const isRoot = pathname === "/";

  // 1. If trying to access admin without a cookie, redirect to login
  if (protectedRoute && !accessToken) {
    const url = new URL("/login", request.url);
    return NextResponse.redirect(url);
  }

  // 2. If trying to access login/signup with a cookie, redirect to admin (basic check)
  // Note: Proxy/Middleware can't easily check the role without decoding the JWT,
  // so the client-side AuthGuard will handle the role-specific redirection.
  if (isAuthRoute && accessToken) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // 3. If visiting landing page root while authenticated, redirect to workspace
  if (isRoot && accessToken) {
    return NextResponse.redirect(new URL("/homey", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/home/:path*", "/login", "/signup"],
};