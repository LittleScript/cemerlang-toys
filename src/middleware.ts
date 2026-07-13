import { auth } from "@/auth";

/**
 * Centralized auth middleware for Next.js.
 * Protects admin routes and redirects based on user status.
 */
export default auth((req) => {
  const { pathname } = req.nextUrl;
  const user = req.auth?.user;

  // Admin routes: redirect non-admins to homepage
  if (pathname.startsWith("/admin")) {
    if (!user || user.role !== "ADMIN") {
      const homeUrl = new URL("/", req.url);
      return Response.redirect(homeUrl);
    }
  }

  // Login page: redirect already-logged-in users to appropriate page
  if (pathname === "/login" && user) {
    if (!user.whatsapp) {
      return Response.redirect(new URL("/daftar", req.url));
    }
    if (user.status === "APPROVED") {
      return Response.redirect(new URL("/", req.url));
    }
    if (user.status === "REJECTED") {
      return Response.redirect(new URL("/akun/ditolak", req.url));
    }
    return Response.redirect(new URL("/akun/menunggu-verifikasi", req.url));
  }

  return;
});

export const config = {
  // Match all paths except static assets, _next, and favicon
  matcher: ["/((?!_next|api|uploads|logo-|favicon|file.svg|.*\\.png$).*)"],
};
