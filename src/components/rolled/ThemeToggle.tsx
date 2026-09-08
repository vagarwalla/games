'use client'

import { useTheme } from 'next-themes'

/*
 * No mounted-flag effect here: the server cannot know the viewer's theme, so
 * the first paint is always a guess. suppressHydrationWarning lets React
 * correct it silently, which is how the Orient Express toggle handles the same
 * problem — and it keeps the two games on one theme, since both read the
 * provider in the root layout.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="w-9 h-9 flex items-center justify-center rounded-lg border border-[var(--card-border)] hover:bg-[var(--hover-bg)] transition-colors text-base"
      aria-label={isDark ? 'Switch to light' : 'Switch to dark'}
      suppressHydrationWarning
    >
      <span suppressHydrationWarning aria-hidden="true">
        {isDark ? '☀️' : '🌙'}
      </span>
    </button>
  )
}
