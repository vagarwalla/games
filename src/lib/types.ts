// Core domain types for the Orient Express clue-lookup app.

/** The four things a player can do, each resolved against a target. */
export type ActionKind =
  | "question-suspect"
  | "question-crew"
  | "search-area"
  | "telegram";

/** A selectable target within an action group (a suspect, crew member, area, or telegram subject). */
export interface Target {
  /** Stable id, unique within its action group. */
  id: string;
  /** Display label shown in the TargetList. */
  label: string;
  /** Path to the card art for this target (under /public), if any. */
  image?: string;
}

/** One action group: a tab in the UI plus the targets it offers. */
export interface ActionGroup {
  kind: ActionKind;
  /** Short tab label. */
  label: string;
  targets: Target[];
}

/**
 * The clue-numbers sheet. For a given action group + target, `numbers` holds the
 * clue number for each of the 10 cases (index 0 = Case 1 … index 9 = Case 10).
 * A `null` entry means "no clue / not applicable for that case".
 */
export interface GridRow {
  kind: ActionKind;
  targetId: string;
  /** Exactly 10 entries, one per case. */
  numbers: (number | null)[];
}

/** A single booklet clue (1–320). */
export interface Clue {
  /** Clue number, 1-based. */
  n: number;
  /** Transcribed booklet text. Empty string when the clue is still missing/pending. */
  text: string;
  /** True once confirmed against the printed booklet. */
  verified: boolean;
  /** True when OCR was shaky and the text needs a double-check. */
  uncertain?: boolean;
  /** True when the clue text is not yet transcribed (renders as pending). */
  missing?: boolean;
}

export const CASE_COUNT = 10;
