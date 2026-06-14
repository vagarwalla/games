import type { ActionGroup, ActionKind, GridRow } from "./types";
import { CASE_COUNT } from "./types";

/*
 * ============================================================================
 *  ⚠️  PLACEHOLDER DATA — NOT THE REAL GAME ⚠️
 * ============================================================================
 *  This file was scaffolded so the app builds, lints, and renders end-to-end
 *  BEFORE the real clue-numbers sheet has been transcribed from photos.
 *
 *  - The target lists below are guesses at the right *shape* (counts/labels).
 *  - Every grid number is GENERATED, not transcribed. They are deterministic
 *    placeholders so the lookup wires up and the verify page has something to
 *    show — they do NOT correspond to the printed clue-numbers sheet.
 *
 *  TODO (when photos arrive):
 *    1. Replace the target labels/ids with the real suspects, crew, areas,
 *       and telegram subjects.
 *    2. Replace every `numbers` array with the transcribed row from the sheet.
 *    3. Delete this banner once a row is real, or flag remaining placeholders.
 * ============================================================================
 */

/** Build a target list of `n` items with auto ids like `q-suspect-1`. */
function mkTargets(prefix: string, labels: string[]) {
  return labels.map((label, i) => ({ id: `${prefix}-${i + 1}`, label }));
}

// NOTE: target labels below are taken from the box-art card photos to make the
// UI feel authentic. The exact roster, spelling, and order are UNVERIFIED and
// the per-case grid numbers are still generated placeholders (see banner above).
export const ACTION_GROUPS: ActionGroup[] = [
  {
    kind: "question-suspect",
    label: "Question Suspect",
    targets: mkTargets("suspect", [
      "Gambler",
      "Diplomat",
      "Count",
      "Countess",
      "Colonel",
      "Actress",
      "Baron",
      "Doctor",
    ]),
  },
  {
    kind: "question-crew",
    label: "Question Crew",
    targets: mkTargets("crew", [
      "Conductor",
      "Porter",
      "Cook",
      "Waiter",
      "Engineer",
      "Steward",
      "Guard",
      "Maid",
    ]),
  },
  {
    kind: "search-area",
    label: "Search Area",
    targets: mkTargets("area", [
      "Saloon",
      "Dining Room",
      "Kitchen",
      "Library",
      "First Class",
      "Second Class",
      "Sleeper Car",
      "Luggage Van",
    ]),
  },
  {
    kind: "telegram",
    label: "Telegram",
    targets: mkTargets("telegram", [
      "Telegram: Gambler",
      "Telegram: Diplomat",
      "Telegram: Count",
      "Telegram: Countess",
      "Telegram: Colonel",
      "Telegram: Actress",
      "Telegram: Baron",
    ]),
  },
];

/**
 * Generated placeholder grid: one row per (action group × target), each with a
 * deterministic clue number for all 10 cases. NOT the real sheet — see banner.
 */
export const GRID: GridRow[] = (() => {
  const rows: GridRow[] = [];
  let rowIndex = 0;
  for (const group of ACTION_GROUPS) {
    for (const target of group.targets) {
      const numbers = Array.from(
        { length: CASE_COUNT },
        (_, caseIndex) => ((rowIndex * CASE_COUNT + caseIndex) % 320) + 1
      );
      rows.push({ kind: group.kind, targetId: target.id, numbers });
      rowIndex += 1;
    }
  }
  return rows;
})();

/** Look up the clue number for an action/target/case (case is 1-based). */
export function clueNumberFor(
  kind: ActionKind,
  targetId: string,
  caseNumber: number
): number | null {
  const row = GRID.find((r) => r.kind === kind && r.targetId === targetId);
  if (!row) return null;
  return row.numbers[caseNumber - 1] ?? null;
}
