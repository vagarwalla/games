---
title: "fix: Compact the mobile case/action controls so targets are visible"
status: active
date: 2026-06-14
type: fix
---

# fix: Compact the mobile case/action controls so targets are visible

## Summary

On a phone, the lookup page's two control blocks — the **Case Number** grid (10
large square buttons in 2 rows) and the **"What happened?"** action tabs (4 large
buttons in a 2×2 grid) — consume so much vertical space that the target list
(suspects / crew / areas) is pushed entirely below the fold. After the recent
change that pins the clue above the grid, the order is now: case grid → action
tabs → clue → targets, so the targets are even further down. A user opening the
page sees only controls and an empty clue placeholder, with no targets in view.

This compacts the two control blocks **on mobile** so the first row of targets is
visible without excessive scrolling:

- **Case Number** becomes a compact dropdown (with the button grid retained on
  larger screens, where space is not constrained).
- **"What happened?"** action tabs become a single compact row of 4 instead of a
  2×2 grid.

## Problem Frame

The controls are tuned for the desktop left column, where vertical space is
plentiful. On a ~375×812 phone the case grid (~2 × 48px rows + heading + gaps)
and the action tabs (~2 × ~84px rows + heading + gaps) together eat roughly
300px before the clue and targets even begin. The fix is to shrink the controls'
mobile footprint while keeping every option reachable and preserving the
box-art visual identity. Desktop layout stays as-is.

Scope is mobile control density only. The clue behavior, target grid, data,
theming, and desktop layout are out of scope.

## Requirements

- **R1.** On mobile (below the `sm` breakpoint), the Case Number control is a
  single compact dropdown showing the current case (e.g. "Case № 3"), selectable
  from 1–10. It must remain keyboard- and screen-reader-accessible and fire the
  same `onChange(caseNumber)` the grid does today.
- **R2.** On `sm` and up, the existing case-number button grid is retained
  unchanged (desktop is not space-constrained and the at-a-glance grid is nice).
- **R3.** The "What happened?" action tabs render as a single row of 4 on mobile
  (not a 2×2 grid), in a form that fits a 320–430px width without overflow and
  keeps each option tappable (≥40px touch target) and legible.
- **R4.** After compaction, on a ~375×812 viewport at least the first row of
  target cards is visible without scrolling once a case/action are chosen.
- **R5.** Preserve the box-art look (thick ink borders, hard offset shadows,
  display/label type), selected-state styling, `aria-pressed`/labels, focus
  rings, and the press affordance.

## Key Technical Decisions

- **Native `<select>` for the mobile case picker, styled to the box-art theme.**
  A native select gives the OS picker (best mobile UX), is fully accessible for
  free, and collapses 10 buttons into one ~48px control. Style it with the
  existing ink border + hard shadow so it reads as part of the comic UI. Rationale:
  maximum space win, minimum custom interaction code, no a11y regressions. A
  custom dropdown or stepper would add interaction/focus-trap code for no benefit
  here.
- **Breakpoint-split rather than replace.** Render the `<select>` only below `sm`
  and keep the existing button grid at `sm`+ (`hidden sm:flex` / `sm:hidden`), so
  desktop is untouched. Both controls call the same `onChange`, so state handling
  is unchanged. Keeping two presentations of the same control is a small, well-
  contained cost justified by preserving the desktop experience.
- **Action tabs: single row of 4 on mobile via `grid-cols-4`,** with reduced
  padding and the icon sized down so the row fits at 320px. Keep the icon-above-
  label composition; allow the label to wrap to 2 lines. Rationale: keeps all four
  actions visible at a glance (the game has exactly 4, so a row of 4 is natural)
  and halves the block's height versus the 2×2 grid.

## Implementation Units

### U1. Compact the Case Number selector on mobile (dropdown)

**Goal:** Replace the 10-button grid with a compact native dropdown below `sm`,
keeping the button grid at `sm`+.

**Requirements:** R1, R2, R5

**Files:**
- `src/components/CaseSelector.tsx` (add the mobile `<select>`; gate the existing
  grid to `sm`+)

**Approach:**
- Below `sm`: render a styled native `<select>` whose options are 1…`CASE_COUNT`,
  labelled "Case № N", value bound to `value`, `onChange` parsing to a number and
  calling the existing `onChange`. Wrap so the box-art border/shadow show; include
  a visible caret. Keep the "Case Number" kicker heading.
- At `sm`+: keep the current `grid grid-cols-5 / sm:flex` button grid exactly as
  today. Use `sm:hidden` on the select and `hidden sm:flex` (or equivalent) on the
  grid so exactly one renders per breakpoint.
- Ensure the select has an accessible name (the kicker `<h2>` via `aria-label` or
  an associated label) and visible focus ring (`.focusable`).

**Patterns to follow:** existing box-art control styling in
`src/components/CaseSelector.tsx` and the `.focusable` / shadow tokens in
`src/app/globals.css`.

**Test scenarios:**
- Happy path: below `sm`, the dropdown shows the current case and selecting a
  different value calls `onChange` with that number and updates the displayed
  selection. Covers R1.
- Breakpoint: at `sm`+, the button grid renders and the dropdown is hidden;
  below `sm`, only the dropdown renders (no duplicate control visible). Covers R2.
- Accessibility: the select is reachable by keyboard, has an accessible name, and
  shows a focus ring; `CASE_COUNT` options are all present (1–10). Covers R5.
- Edge: switching case via the dropdown while a target is selected leaves the rest
  of the page behaving as before (clue recomputes for the new case).

### U2. Compact the action tabs into a single mobile row

**Goal:** Render the 4 action tabs as one row on mobile instead of a 2×2 grid,
fitting narrow widths without overflow.

**Requirements:** R3, R4, R5

**Files:**
- `src/components/ActionTabs.tsx` (mobile grid columns + sizing)

**Approach:**
- Change the mobile layout from `grid-cols-2` to `grid-cols-4` (desktop already
  uses `sm:grid-cols-4`, so this mainly drops the 2-col mobile case). Reduce
  padding, gap, and icon size enough that four icon+label tiles fit at 320px;
  allow the label to wrap (it already uses `leading-tight`). Keep the selected
  state, border, shadow, and press behavior.
- Verify the longest labels ("Question Suspect", "Question Crew") remain legible
  when wrapped in a ~80px-wide tile; shrink label type a step if needed.

**Patterns to follow:** existing tile styling and `ACTION_COLOR`/`GLYPH` maps in
`src/components/ActionTabs.tsx`.

**Test scenarios:**
- Happy path: on mobile, the four action tabs render in a single row; tapping one
  selects it (`aria-pressed`) and calls `onChange(kind)`. Covers R3.
- Layout: at 320px and 430px widths, the row fits with no horizontal overflow and
  every tab keeps a ≥40px touch target. Covers R3, R4.
- Visual/state: selected tab keeps its color fill, border, shadow, and label
  shadow; focus ring and press nudge still fire. Covers R5.

## Scope Boundaries

**In scope:** mobile presentation of `CaseSelector` and `ActionTabs` only.

**Out of scope (not changing):** desktop control layout, the clue panel and its
sticky behavior, the target grid, clue data, theming/colors, the Ledger page.

### Deferred to Follow-Up Work
- Making the clue placeholder more compact (or only prominent after a target is
  selected) to reclaim additional space above the targets — separate UX tweak.
- Any change to the case dropdown styling to a fully custom (non-native) menu, if
  the native picker ever feels off-brand.

## Verification

- `npm run lint` and `npm run build` pass.
- At ~375×812: the Case selector is a single dropdown, the action tabs are one
  row of 4, and at least the first row of target cards is visible after choosing
  a case + action. No horizontal overflow at 320–430px.
- At `sm`+: the case-number button grid renders unchanged; the dropdown is hidden.
- Keyboard focus, `aria-pressed`/labels, selected styling, and the press
  affordance are intact on both controls.
