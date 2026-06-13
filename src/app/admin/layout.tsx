import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/admin";
import { AdminNav } from "@/components/admin/admin-nav";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireAdmin();

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8 md:flex-row">
      <aside className="md:w-56 md:shrink-0">
        <div className="md:sticky md:top-24">
          <AdminNav />
        </div>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
