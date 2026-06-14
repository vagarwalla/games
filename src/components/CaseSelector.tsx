"use client";

import { CASE_COUNT } from "@/lib/types";

export function CaseSelector({
  value,
  onChange,
}: {
  value: number;
  onChange: (caseNumber: number) => void;
}) {
  return (
    <section>
      <div className="mb-2 flex items-baseline justify-between">
        <h2 className="label-kicker">Case №</h2>
        <span className="label-kicker" style={{ opacity: 0.7 }}>
          set once per game
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: CASE_COUNT }, (_, i) => i + 1).map((c) => {
          const selected = value === c;
          return (
            <button
              key={c}
              type="button"
              onClick={() => onChange(c)}
              aria-pressed={selected}
              className="focusable relative h-11 w-11 rounded-md font-display text-base transition-transform duration-150 hover:-translate-y-0.5"
              style={{
                background: selected ? "var(--amber)" : "var(--paper-2)",
                color: selected ? "#fffdf7" : "var(--ink)",
                border: `1px solid ${selected ? "var(--amber)" : "var(--line)"}`,
                boxShadow: selected
                  ? "0 4px 12px var(--shadow)"
                  : "0 1px 2px var(--shadow)",
                fontWeight: 600,
              }}
            >
              {c}
            </button>
          );
        })}
      </div>
    </section>
  );
}
