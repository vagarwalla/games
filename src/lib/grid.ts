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

/**
 * Build a target list from [label, slug] pairs. The slug picks the card art in
 * `/public/cards/<folder>/<slug>.png` and also forms the stable id.
 */
function mkTargets(folder: string, items: [label: string, slug: string][]) {
  return items.map(([label, slug]) => ({
    id: `${folder}-${slug}`,
    label,
    image: `/cards/${folder}/${slug}.png`,
  }));
}

// NOTE: the roster + card art are taken from the shared box-art card images to
// make the UI feel authentic. The exact roster and the per-case grid numbers
// are still UNVERIFIED placeholders (see banner above).
export const ACTION_GROUPS: ActionGroup[] = [
  {
    kind: "question-suspect",
    label: "Question Suspect",
    targets: mkTargets("suspects", [
      ["Actress", "actress"],
      ["Ballerina", "ballerina"],
      ["Baroness", "baroness"],
      ["Colonel", "colonel"],
      ["Count", "count"],
      ["Diplomat", "diplomat"],
      ["Fortune-Teller", "fortune-teller"],
      ["Gambler", "gambler"],
    ]),
  },
  {
    kind: "question-crew",
    label: "Question Crew",
    targets: mkTargets("staff", [
      ["Chief Guard", "chief-guard"],
      ["Conductor", "conductor"],
      ["Cook", "cook"],
      ["Doctor", "doctor"],
      ["Porter", "porter"],
      ["Steward", "steward"],
      ["Waiter", "waiter"],
    ]),
  },
  {
    kind: "search-area",
    label: "Search Area",
    targets: mkTargets("compartments", [
      ["Dining Room", "dining-room"],
      ["First Class", "first-class"],
      ["Kitchen", "kitchen"],
      ["Library", "library"],
      ["Saloon", "saloon"],
      ["Second Class", "second-class"],
    ]),
  },
  {
    kind: "telegram",
    label: "Telegram",
    targets: mkTargets("telegrams", [
      ["Actress", "actress"],
      ["Ballerina", "ballerina"],
      ["Baroness", "baroness"],
      ["Colonel", "colonel"],
      ["Count", "count"],
      ["Diplomat", "diplomat"],
      ["Fortune-Teller", "fortune-teller"],
      ["Gambler", "gambler"],
      ["Victim", "victim"],
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
