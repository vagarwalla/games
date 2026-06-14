"use client";

import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label="Toggle dark mode"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="rounded-full border border-black/10 px-3 py-1.5 text-sm dark:border-white/15"
      suppressHydrationWarning
    >
      <span suppressHydrationWarning>{isDark ? "☀️ Light" : "🌙 Dark"}</span>
    </button>
  );
}
