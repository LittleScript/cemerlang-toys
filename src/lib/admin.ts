import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

/** Server Component / Server Action guard — redirects to "/" if not admin. */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }
  return session;
}

/**
 * API Route Handler guard — returns a 401 JSON response if not admin.
 * The caller should `return authError` immediately when non-null.
 *
 * Usage:
 *   const authError = await requireAdminApi();
 *   if (authError) return authError;
 */
export async function requireAdminApi(): Promise<NextResponse | null> {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
