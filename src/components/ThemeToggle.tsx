"use client";

import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to daytime dossier" : "Switch to night train"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="focusable inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-colors"
      style={{ borderColor: "var(--line)", color: "var(--ink-muted)" }}
      suppressHydrationWarning
    >
      <span suppressHydrationWarning style={{ fontFamily: "var(--font-type)" }}>
        {isDark ? "DAY" : "NIGHT"}
      </span>
      <span suppressHydrationWarning aria-hidden="true">
        {isDark ? "☼" : "☾"}
      </span>
    </button>
  );
}
