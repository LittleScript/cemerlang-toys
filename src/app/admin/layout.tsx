import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/admin";
import { ThemeProvider } from "@/components/admin/theme-provider";
import { ToastProvider } from "@/components/admin/ui/toast";
import { Sidebar } from "@/components/admin/sidebar";
import { Topbar } from "@/components/admin/topbar";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireAdmin();

  return (
    <ThemeProvider>
      <ToastProvider>
        <div className="admin-layout">
          <Sidebar />
          <div className="admin-main">
            <Topbar />
            <main
              className="admin-content flex-1 overflow-y-auto"
              style={{ padding: 'var(--content-padding-x)' }}
            >
              {children}
            </main>
          </div>
        </div>
      </ToastProvider>
    </ThemeProvider>
  );
}
