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
      <h2 className="kicker mb-2">Case Number</h2>
      <div className="grid grid-cols-5 gap-2 sm:flex sm:flex-wrap">
        {Array.from({ length: CASE_COUNT }, (_, i) => i + 1).map((c) => {
          const selected = value === c;
          return (
            <button
              key={c}
              type="button"
              onClick={() => onChange(c)}
              aria-pressed={selected}
              className="focusable press font-display grid h-12 place-items-center rounded-lg text-lg sm:h-12 sm:w-12"
              style={{
                background: selected ? "var(--yellow)" : "var(--surface)",
                color: "var(--ink)",
                border: "3px solid var(--ink)",
                boxShadow: selected ? "var(--shadow)" : "var(--shadow-sm)",
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
