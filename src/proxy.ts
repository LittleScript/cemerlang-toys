import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Edge-compatible request proxy — lightweight cookie-based checks only.
 * Detailed auth/role verification remains server-side via requireAdmin().
 */
const SESSION_COOKIES = [
  "authjs.session-token",
  "__Secure-authjs.session-token",
] as const;

function hasSession(request: NextRequest): boolean {
  return SESSION_COOKIES.some((name) => request.cookies.has(name));
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoggedIn = hasSession(request);

  if (pathname.startsWith("/admin") && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname === "/login" && isLoggedIn) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|uploads|logo-|favicon|file.svg|.*\\.png$).*)"],
};
