"use client";

import { usePathname } from "next/navigation";

/**
 * Client gate that hides the public Header/Footer on /admin routes.
 *
 * Header and Footer are async Server Components (Footer reads from Prisma),
 * so they must NOT be imported into this client module — doing so pulls the
 * Prisma client and `pg` into the browser bundle and breaks `next build`.
 * Instead they are rendered by the server (in layout.tsx) and passed in as
 * the `header` and `footer` props, which keeps them in the server module
 * graph. See Next.js docs: "Server and Client Components" — interleaving.
 */
export function SiteChrome({
  header,
  footer,
  children,
}: {
  header: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return <>{children}</>;
  return (
    <>
      {header}
      <main className="flex-1">{children}</main>
      {footer}
    </>
  );
}
