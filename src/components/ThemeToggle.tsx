"use client";

import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to day" : "Switch to night"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="focusable press grid h-8 w-8 place-items-center rounded-md text-sm"
      style={{
        background: "var(--surface)",
        color: "var(--ink)",
        border: "2.5px solid var(--ink)",
        boxShadow: "var(--shadow-sm)",
      }}
      suppressHydrationWarning
    >
      <span suppressHydrationWarning aria-hidden="true">
        {isDark ? "☀" : "☾"}
      </span>
    </button>
  );
}
