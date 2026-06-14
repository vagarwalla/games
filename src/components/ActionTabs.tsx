"use client";

import { ACTION_GROUPS } from "@/lib/grid";
import type { ActionKind } from "@/lib/types";

const GLYPH: Record<ActionKind, string> = {
  "question-suspect": "✦",
  "question-crew": "⚑",
  "search-area": "✜",
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
      <h2 className="label-kicker mb-2">What happened?</h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {ACTION_GROUPS.map((g) => {
          const selected = value === g.kind;
          return (
            <button
              key={g.kind}
              type="button"
              onClick={() => onChange(g.kind)}
              aria-pressed={selected}
              className="focusable flex flex-col items-start gap-1 rounded-md px-3 py-2.5 text-left transition-colors"
              style={{
                background: selected ? "var(--amber-soft)" : "var(--paper-2)",
                border: `1px solid ${selected ? "var(--amber)" : "var(--line)"}`,
                boxShadow: selected ? "inset 0 0 0 1px var(--amber)" : "none",
              }}
            >
              <span
                aria-hidden="true"
                className="text-base"
                style={{ color: selected ? "var(--amber)" : "var(--ink-muted)" }}
              >
                {GLYPH[g.kind]}
              </span>
              <span
                className="text-sm leading-tight"
                style={{
                  fontWeight: selected ? 600 : 500,
                  color: selected ? "var(--ink)" : "var(--ink-muted)",
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
