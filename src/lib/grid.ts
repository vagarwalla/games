import type { ActionGroup, ActionKind, GridRow } from "./types";
import { CASE_COUNT } from "./types";

/*
 * ============================================================================
 *  Clue-numbers sheet — transcribed from the printed game.
 * ============================================================================
 *  Source photo: /public/clues/clue-numbers-grid.jpg
 *
 *  Each target row's `numbers` array holds the booklet clue number for cases
 *  1–10 (index 0 = Case 1 … index 9 = Case 10). The roster (suspects, crew,
 *  areas, telegram subjects) matches the printed sheet.
 *
 *  Card art lives at /public/cards/<folder>/<slug>.png. Targets with `art:
 *  true` show that image; any with `art: false` fall back to a text label
 *  (see TargetList). The telegram-tab Entrepreneur/Heiress have no telegram
 *  art and remain `art: false`.
 * ============================================================================
 */

type Numbers = [
  number, number, number, number, number,
  number, number, number, number, number,
];

interface TargetDef {
  label: string;
  /** Slug for the stable id and the card-art filename. */
  slug: string;
  /** Whether card art exists at /cards/<folder>/<slug>.png. */
  art: boolean;
  /** Transcribed clue numbers for cases 1–10. */
  numbers: Numbers;
}

interface GroupDef {
  kind: ActionKind;
  label: string;
  /** Card-art subfolder under /public/cards. */
  folder: string;
  targets: TargetDef[];
}

const GROUPS: GroupDef[] = [
  {
    kind: "question-suspect",
    label: "Question Suspect",
    folder: "suspects",
    targets: [
      { label: "Actress", slug: "actress", art: true, numbers: [234, 56, 286, 205, 24, 162, 232, 127, 16, 181] },
      { label: "Baroness", slug: "baroness", art: true, numbers: [71, 314, 238, 143, 114, 51, 138, 280, 88, 43] },
      { label: "Count", slug: "count", art: true, numbers: [28, 291, 174, 10, 262, 135, 77, 7, 154, 110] },
      { label: "Diplomat", slug: "diplomat", art: true, numbers: [201, 121, 45, 252, 94, 298, 214, 246, 213, 168] },
      { label: "Entrepreneur", slug: "entrepreneur", art: true, numbers: [112, 148, 108, 62, 169, 241, 3, 64, 260, 27] },
      { label: "Fortuneteller", slug: "fortune-teller", art: true, numbers: [52, 283, 211, 111, 229, 36, 166, 170, 69, 92] },
      { label: "Gambler", slug: "gambler", art: true, numbers: [167, 14, 295, 84, 288, 186, 98, 313, 242, 209] },
      { label: "Heiress", slug: "heiress", art: true, numbers: [297, 222, 22, 273, 66, 305, 259, 53, 287, 134] },
    ],
  },
  {
    kind: "question-crew",
    label: "Question Crew",
    folder: "staff",
    targets: [
      { label: "Chief", slug: "chief-guard", art: true, numbers: [12, 171, 141, 97, 132, 17, 197, 301, 122, 73] },
      { label: "Conductor", slug: "conductor", art: true, numbers: [133, 47, 317, 187, 4, 272, 32, 184, 8, 150] },
      { label: "Cook", slug: "cook", art: true, numbers: [254, 235, 224, 240, 304, 118, 243, 91, 196, 236] },
      { label: "Doctor", slug: "doctor", art: true, numbers: [93, 199, 76, 29, 203, 155, 318, 30, 306, 58] },
      { label: "Porter", slug: "porter", art: true, numbers: [188, 101, 303, 172, 80, 319, 104, 207, 95, 178] },
      { label: "Valet", slug: "valet", art: true, numbers: [61, 268, 257, 293, 149, 219, 151, 320, 271, 35] },
      { label: "Waiter", slug: "waiter", art: true, numbers: [277, 182, 278, 120, 279, 72, 307, 136, 312, 227] },
    ],
  },
  {
    kind: "search-area",
    label: "Search Area",
    folder: "compartments",
    targets: [
      { label: "Dining Area", slug: "dining-room", art: true, numbers: [82, 191, 244, 309, 31, 255, 128, 106, 282, 198] },
      { label: "Drawing Room Area", slug: "drawing-room", art: true, numbers: [146, 87, 13, 44, 185, 173, 285, 258, 59, 6] },
      { label: "First Class", slug: "first-class", art: true, numbers: [290, 23, 163, 164, 315, 206, 89, 193, 180, 81] },
      { label: "Kitchen Area", slug: "kitchen", art: true, numbers: [212, 74, 204, 228, 54, 65, 21, 85, 225, 249] },
      { label: "Second Class", slug: "second-class", art: true, numbers: [38, 129, 269, 103, 251, 311, 223, 294, 253, 126] },
      { label: "Smoking Lounge Area", slug: "smoking-lounge", art: true, numbers: [266, 247, 115, 302, 160, 86, 316, 156, 46, 161] },
    ],
  },
  {
    kind: "telegram",
    label: "Telegram",
    folder: "telegrams",
    targets: [
      { label: "Actress", slug: "actress", art: true, numbers: [245, 210, 183, 153, 274, 289, 48, 119, 25, 99] },
      { label: "Baroness", slug: "baroness", art: true, numbers: [102, 63, 68, 194, 123, 26, 189, 39, 296, 215] },
      { label: "Count", slug: "count", art: true, numbers: [176, 159, 130, 18, 192, 263, 208, 15, 142, 49] },
      { label: "Diplomat", slug: "diplomat", art: true, numbers: [20, 256, 231, 79, 237, 144, 113, 310, 202, 261] },
      { label: "Entrepreneur", slug: "entrepreneur", art: false, numbers: [195, 116, 90, 216, 11, 230, 175, 179, 109, 67] },
      { label: "Fortuneteller", slug: "fortune-teller", art: true, numbers: [124, 5, 34, 131, 107, 9, 276, 239, 233, 117] },
      { label: "Gambler", slug: "gambler", art: true, numbers: [221, 96, 152, 265, 140, 281, 60, 78, 165, 19] },
      { label: "Heiress", slug: "heiress", art: false, numbers: [41, 137, 218, 55, 217, 105, 158, 267, 37, 139] },
      { label: "Victim", slug: "victim", art: true, numbers: [157, 33, 57, 284, 42, 248, 292, 147, 83, 190] },
    ],
  },
];

/** Stable id for a target, unique across the whole grid. */
function targetId(folder: string, slug: string) {
  return `${folder}-${slug}`;
}

export const ACTION_GROUPS: ActionGroup[] = GROUPS.map((g) => ({
  kind: g.kind,
  label: g.label,
  targets: g.targets.map((t) => ({
    id: targetId(g.folder, t.slug),
    label: t.label,
    ...(t.art ? { image: `/cards/${g.folder}/${t.slug}.png` } : {}),
  })),
}));

/**
 * The clue-numbers sheet, one row per (action group × target). Index `i` of
 * `numbers` is the clue number for Case `i + 1`.
 */
export const GRID: GridRow[] = GROUPS.flatMap((g) =>
  g.targets.map((t) => {
    if (t.numbers.length !== CASE_COUNT) {
      throw new Error(`Grid row ${g.kind}/${t.slug} must have ${CASE_COUNT} numbers`);
    }
    return { kind: g.kind, targetId: targetId(g.folder, t.slug), numbers: t.numbers };
  })
);

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
