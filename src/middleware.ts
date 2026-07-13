import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Edge-compatible middleware — lightweight cookie-based checks only.
 * Does NOT import @/auth or @/lib/prisma (Node.js-native modules crash Edge Runtime).
 *
 * Detailed auth/role verification happens server-side via requireAdmin() on each admin page.
 */

const SESSION_COOKIES = [
  "authjs.session-token",
  "__Secure-authjs.session-token",
] as const;

function hasSession(request: NextRequest): boolean {
  return SESSION_COOKIES.some((name) => request.cookies.has(name));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoggedIn = hasSession(request);

  // Protect admin routes — no session → redirect to login.
  // Role check (ADMIN vs non-admin) is handled by requireAdmin() in server components.
  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Redirect logged-in users away from /login
  if (pathname === "/login" && isLoggedIn) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|uploads|logo-|favicon|file.svg|.*\\.png$).*)"],
};
