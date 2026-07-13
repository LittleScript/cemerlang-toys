"use client";

import { useEffect } from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Theme
    const stored = localStorage.getItem("ct-admin-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = stored ? stored === "dark" : prefersDark;
    document.documentElement.classList.toggle("dark", isDark);

    // Sidebar collapse
    const collapsed = localStorage.getItem("ct-admin-sidebar-collapsed");
    document.documentElement.classList.toggle("sidebar-collapsed", collapsed === "true");

    // CLEANUP: remove admin-only classes when unmounting (SPA nav away from /admin)
    return () => {
      document.documentElement.classList.remove("dark", "sidebar-collapsed");
    };
  }, []);

  return <>{children}</>;
}
