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

export const ACTION_GROUPS: ActionGroup[] = [
  {
    kind: "question-suspect",
    label: "Question Suspect",
    targets: mkTargets("suspect", [
      "Suspect A (placeholder)",
      "Suspect B (placeholder)",
      "Suspect C (placeholder)",
      "Suspect D (placeholder)",
      "Suspect E (placeholder)",
      "Suspect F (placeholder)",
      "Suspect G (placeholder)",
      "Suspect H (placeholder)",
    ]),
  },
  {
    kind: "question-crew",
    label: "Question Crew",
    targets: mkTargets("crew", [
      "Crew A (placeholder)",
      "Crew B (placeholder)",
      "Crew C (placeholder)",
      "Crew D (placeholder)",
      "Crew E (placeholder)",
      "Crew F (placeholder)",
      "Crew G (placeholder)",
      "Crew H (placeholder)",
    ]),
  },
  {
    kind: "search-area",
    label: "Search Area",
    targets: mkTargets("area", [
      "Area A (placeholder)",
      "Area B (placeholder)",
      "Area C (placeholder)",
      "Area D (placeholder)",
      "Area E (placeholder)",
      "Area F (placeholder)",
      "Area G (placeholder)",
      "Area H (placeholder)",
    ]),
  },
  {
    kind: "telegram",
    label: "Telegram",
    targets: mkTargets("telegram", [
      "Telegram about A (placeholder)",
      "Telegram about B (placeholder)",
      "Telegram about C (placeholder)",
      "Telegram about D (placeholder)",
      "Telegram about E (placeholder)",
      "Telegram about F (placeholder)",
      "Telegram about G (placeholder)",
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
