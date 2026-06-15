"use client";

import { CASE_COUNT } from "@/lib/types";

export function CaseSelector({
  value,
  onChange,
}: {
  value: number;
  onChange: (caseNumber: number) => void;
}) {
  const cases = Array.from({ length: CASE_COUNT }, (_, i) => i + 1);

  return (
    <section>
      <h2 id="case-number-label" className="kicker mb-2">
        Case Number
      </h2>

      {/* Mobile: a compact dropdown so the 10 cases don't eat the screen.
          The closed control is themed to match the box-art buttons; the open
          list is the native OS picker (best mobile UX, not themeable). */}
      <div className="relative sm:hidden">
        <select
          aria-labelledby="case-number-label"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="focusable font-display w-full appearance-none rounded-lg py-2.5 pl-3.5 pr-10 text-lg"
          style={{
            background: "var(--yellow)",
            color: "var(--ink)",
            border: "3px solid var(--ink)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          {cases.map((c) => (
            <option key={c} value={c}>
              Case № {c}
            </option>
          ))}
        </select>
        {/* custom caret — the native one is removed via appearance-none */}
        <span
          aria-hidden="true"
          className="font-display pointer-events-none absolute inset-y-0 right-3 flex items-center text-base"
          style={{ color: "var(--ink)" }}
        >
          ▾
        </span>
      </div>

      {/* sm+: the full at-a-glance button grid (desktop has the room) */}
      <div className="hidden gap-2 sm:flex sm:flex-wrap">
        {cases.map((c) => {
          const selected = value === c;
          return (
            <button
              key={c}
              type="button"
              onClick={() => onChange(c)}
              aria-pressed={selected}
              className="focusable press font-display grid h-12 w-12 place-items-center rounded-lg text-lg"
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
