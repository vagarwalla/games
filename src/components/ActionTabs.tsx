"use client";

import { ACTION_GROUPS } from "@/lib/grid";
import type { ActionKind } from "@/lib/types";

export const ACTION_COLOR: Record<ActionKind, string> = {
  "question-suspect": "var(--coral)",
  "question-crew": "var(--orange)",
  "search-area": "var(--green)",
  telegram: "var(--blue)",
};

const GLYPH: Record<ActionKind, string> = {
  "question-suspect": "🕵",
  "question-crew": "🎩",
  "search-area": "🔍",
  telegram: "✉",
};

export function ActionTabs({
  value,
  onChange,
}: {
  value: ActionKind;
  onChange: (kind: ActionKind) => void;
}) {
  return (
    <section>
      <h2 className="kicker mb-2">What happened?</h2>
      {/* Single row of 4 on every size — icon-forward so the tiles stay legible
          and tappable even at ~75px wide on a 320px phone. */}
      <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
        {ACTION_GROUPS.map((g) => {
          const selected = value === g.kind;
          const color = ACTION_COLOR[g.kind];
          return (
            <button
              key={g.kind}
              type="button"
              onClick={() => onChange(g.kind)}
              aria-pressed={selected}
              className="focusable press flex min-h-[3.5rem] flex-col items-center gap-1 rounded-lg p-2 text-center sm:p-2.5"
              style={{
                background: selected ? color : "var(--surface)",
                color: selected ? "#fffdf6" : "var(--ink)",
                border: "3px solid var(--ink)",
                boxShadow: selected ? "var(--shadow)" : "var(--shadow-sm)",
              }}
            >
              <span aria-hidden="true" className="text-lg leading-none sm:text-xl">
                {GLYPH[g.kind]}
              </span>
              <span
                className="font-label text-[0.5rem] uppercase leading-tight sm:text-[0.62rem]"
                style={{
                  textShadow: selected ? "1.5px 1.5px 0 var(--ink)" : "none",
                }}
              >
                {g.label}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
