"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("ct-admin-theme", next ? "dark" : "light");
  }

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Ganti ke tema terang" : "Ganti ke tema gelap"}
      className="rounded-lg p-2 text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)] transition-colors"
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
