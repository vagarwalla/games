import type { Clue } from "./types";

/*
 * ============================================================================
 *  ⚠️  PLACEHOLDER DATA — NOT THE REAL BOOKLET ⚠️
 * ============================================================================
 *  The booklet text for clues 1–320 has NOT been transcribed yet. Until the
 *  photos arrive, every clue is generated as pending text with verified=false.
 *
 *  The shape matches the eventual real data so the UI and verify-page counts
 *  work today:
 *    - clues 300–312 are marked `missing` (unreadable in the original photos),
 *    - all others are placeholders awaiting transcription.
 *
 *  TODO (when photos arrive): replace `text`, set `verified: true` and clear
 *  `uncertain`/`missing` on each confirmed clue. Mark shaky OCR `uncertain`.
 * ============================================================================
 */

export const TOTAL_CLUES = 320;

/** Clue numbers that are unreadable in the original photos → render as pending. */
const MISSING = new Set<number>([
  300, 301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 311, 312,
]);

export const CLUES: Clue[] = Array.from({ length: TOTAL_CLUES }, (_, i) => {
  const n = i + 1;
  const missing = MISSING.has(n);
  return {
    n,
    text: missing ? "" : `Clue ${n} — placeholder text, awaiting transcription.`,
    verified: false,
    missing: missing || undefined,
  };
});

/** Get a clue by its number (1-based), or undefined if out of range. */
export function clueByNumber(n: number): Clue | undefined {
  return CLUES[n - 1];
}
