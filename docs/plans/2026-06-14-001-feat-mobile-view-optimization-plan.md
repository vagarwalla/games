---
title: "feat: Optimize the mobile view"
status: active
date: 2026-06-14
type: feat
---

# feat: Optimize the mobile view

## Summary

The Orient Express lookup app is already built mobile-first (responsive Tailwind
grids, stacked layouts, `overflow-x-auto` tables). The remaining mobile friction
is **interaction and platform polish**, not layout reflow:

1. On a phone the result `<aside>` renders *below* the target grid. Selecting a
   target updates content the user cannot see — there is no scroll, no feedback,
   so the reveal feels broken on the one screen size most people use.
2. Native mobile tap polish is missing: grey tap-highlight flashes on every
   button, and content can sit under the notch / home-indicator safe areas.
3. A few touch targets and type sizes are tuned for the desktop sidebar, not a
   thumb on a 360px screen.

This plan addresses those three without changing the box-art visual identity.

## Problem Frame

The app's desktop experience is strong: a two-column layout with a sticky clue
sidebar. On mobile that same markup collapses to a single column where the clue
appears at the very bottom of a long scroll. The core action of the app —
"pick a target → read the clue" — has no payoff on mobile because the payoff is
off-screen. Secondary issues (tap highlight, safe-area insets) make an otherwise
polished retro UI feel slightly unfinished on a real device.

Scope is mobile (≤ `lg` breakpoint) behavior and platform polish only. Desktop
layout, data, theming, and the box-art design language stay as-is.

## Requirements

- **R1.** Selecting a target on mobile brings the clue into view (auto-scroll to
  the clue, respecting `prefers-reduced-motion`). No change to desktop, where the
  clue is already visible in the sticky sidebar.
- **R2.** Eliminate the default grey tap-highlight flash on interactive elements
  and ensure tapped buttons feel native (the existing `.press` affordance stays).
- **R3.** Respect iOS/Android safe-area insets so the sticky banner and page
  content are not obscured by the notch or home indicator.
- **R4.** No horizontal scroll/overflow at 320–430px widths on either page.
- **R5.** Preserve existing desktop behavior, visual identity, and accessibility
  (focus rings, `aria-pressed`, reduced-motion).

## Key Technical Decisions

- **Scroll-into-view via a ref on the result region, not a layout change.** The
  desktop two-column layout is good; we keep it and only add behavior for the
  stacked case. A `ref` on the `<aside>` plus `scrollIntoView` fired when a
  target is selected *and* the viewport is below `lg` keeps desktop untouched.
  Rationale: avoids reflowing a working layout; smallest change that satisfies R1.
  - Detect "mobile" with a `matchMedia("(min-width: 1024px)")` check at call time
    (matches Tailwind's `lg`), so the scroll only fires when the sidebar is *not*
    sticky/visible.
  - Gate the smooth behavior on `prefers-reduced-motion` (use `"auto"` when the
    user prefers reduced motion).
- **Tap highlight + safe-area handled globally in `globals.css`**, not per
  component — one `-webkit-tap-highlight-color: transparent` rule and
  `env(safe-area-inset-*)` padding on the banner/main. Keeps the fix in one place.
- **`viewport-fit=cover`** added to the viewport config so `env(safe-area-inset-*)`
  actually resolves to non-zero values on notched devices.

## Implementation Units

### U1. Auto-scroll the clue into view on mobile select

**Goal:** When a target is chosen on a narrow viewport, smoothly scroll the clue
card into view so the reveal is visible.

**Requirements:** R1, R5

**Files:**
- `src/app/orient-express/page.tsx` (add a `ref` to the result `<aside>`; scroll
  on target select)

**Approach:**
- Add `const resultRef = useRef<HTMLElement>(null)` and attach to the `<aside>`.
- In `setTargetId`'s caller (`onChange` from `TargetList`), wrap so that after
  setting the target, if `window.matchMedia("(min-width: 1024px)").matches` is
  **false**, call `resultRef.current?.scrollIntoView({ behavior, block: "start" })`.
- Resolve `behavior` from `prefers-reduced-motion` (`"auto"` vs `"smooth"`).
- Fire the scroll after the state update is committed (e.g. wrap in a microtask /
  `requestAnimationFrame`) so the clue card has rendered before scrolling.
- Leave a small top offset for the sticky banner (scroll the `<aside>`, whose
  `kicker` heading gives natural breathing room, or apply `scroll-margin-top`).

**Patterns to follow:** existing `useMemo`/`useState` in the same file; the
reduced-motion gate already used in `globals.css` (`@media (prefers-reduced-motion)`).

**Test scenarios:**
- Happy path: on a <1024px viewport, selecting a target scrolls the result region
  into view; the clue card is visible without manual scrolling.
- Desktop guard: on a ≥1024px viewport, selecting a target does **not** trigger a
  page scroll (sidebar already visible).
- Reduced motion: with `prefers-reduced-motion: reduce`, the scroll is instant
  (`behavior: "auto"`), not smooth.
- Re-select: changing the target a second time re-scrolls / keeps the clue in view.
- Covers R1.

### U2. Global tap-highlight and safe-area polish

**Goal:** Remove the grey mobile tap flash and respect device safe-area insets.

**Requirements:** R2, R3, R4

**Files:**
- `src/app/globals.css` (tap-highlight reset; safe-area utility)
- `src/components/Banner.tsx` (apply safe-area inset padding to the sticky header)
- `src/app/orient-express/page.tsx` and `src/app/orient-express/verify/page.tsx`
  (apply safe-area inset padding to `main` left/right + bottom)

**Approach:**
- In `globals.css` add, on a broad selector (e.g. `button, a, [role="button"]`)
  or the body: `-webkit-tap-highlight-color: transparent;`. Keep `.focusable`
  focus rings and `.press` active state intact — those remain the feedback.
- Add `env(safe-area-inset-*)` handling: header gets
  `padding-left/right: max(0.75rem, env(safe-area-inset-left/right))` equivalents,
  or a small utility class; `main` bottom padding becomes
  `max(existing, env(safe-area-inset-bottom))`. Prefer a single utility class
  (e.g. `.safe-x` / `.safe-b`) over scattering inline `env()` calls.
- Verify no element forces width beyond the viewport (the box-art `box-shadow`
  offsets and `overflow-hidden` cards should already be safe; confirm at 320px).

**Patterns to follow:** existing comic primitives in `globals.css` (`.panel`,
`.kicker`) — add new utilities in the same `@layer`/section style.

**Test scenarios:**
- Tap highlight: tapping a target/case/tab button shows no grey flash; `.press`
  down-right nudge still fires.
- Safe area: on a notched viewport (simulated), banner content and page edges are
  not clipped by the inset.
- No overflow: at 320px and 430px widths, neither page scrolls horizontally.
- Focus rings preserved: keyboard focus still shows the blue `.focusable` outline.
- Covers R2, R3, R4.

### U3. Viewport config for safe-area + correct mobile scaling

**Goal:** Ensure `env(safe-area-inset-*)` resolves on notched devices and the
page scales correctly on mobile.

**Requirements:** R3

**Files:**
- `src/app/layout.tsx` (Next.js `viewport` export — add `viewportFit: "cover"`)

**Approach:**
- Add or extend the `export const viewport` object with `viewportFit: "cover"`
  (Next 15+ metadata API). Confirm `width=device-width, initial-scale=1` defaults
  remain. This is the prerequisite that makes U2's `env()` insets non-zero.

**Patterns to follow:** Next.js App Router `viewport` export convention.

**Test expectation: none — pure configuration.** Its effect is verified through
U2's safe-area scenario (insets resolve to non-zero on a notched viewport).

## Scope Boundaries

**In scope:** mobile interaction (scroll-to-clue), tap-highlight reset,
safe-area insets, viewport config, overflow verification at small widths.

**Out of scope (not changing):** desktop two-column layout, the box-art visual
identity, data/clue content, theming/colors, the Ledger table structure.

### Deferred to Follow-Up Work
- A collapsible/sheet presentation of the clue on mobile (bottom-sheet pattern) —
  larger UX change; the scroll-into-view solution satisfies R1 for now.
- Image `priority`/loading tuning for the target-card grid on slow mobile networks.

## Verification

- `npm run lint` and `npm run build` pass.
- Dev server: at a ~390px viewport, selecting any target scrolls the clue into
  view; at ≥1024px it does not.
- Simulated notched device shows no clipping; no horizontal scroll at 320–430px.
- Keyboard focus rings and reduced-motion behavior unchanged.
