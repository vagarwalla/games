"use client";

import type { Target } from "@/lib/types";

export function TargetList({
  targets,
  value,
  onChange,
  groupKey,
}: {
  targets: Target[];
  value: string | null;
  onChange: (targetId: string) => void;
  /** Changes when the action group changes, so rows re-animate. */
  groupKey: string;
}) {
  return (
    <section>
      <h2 className="label-kicker mb-2">Target</h2>
      <ul key={groupKey} className="flex flex-col gap-1">
        {targets.map((t, i) => {
          const selected = value === t.id;
          return (
            <li
              key={t.id}
              className="animate-rise"
              style={{ animationDelay: `${Math.min(i * 28, 280)}ms` }}
            >
              <button
                type="button"
                onClick={() => onChange(t.id)}
                aria-pressed={selected}
                className="specimen-row focusable group flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors"
                style={{
                  background: selected ? "var(--amber-soft)" : "transparent",
                  borderLeft: `3px solid ${selected ? "var(--amber)" : "transparent"}`,
                }}
              >
                <span
                  aria-hidden="true"
                  className="font-type text-xs tabular-nums"
                  style={{ color: "var(--ink-muted)", minWidth: "1.6rem" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className="flex-1 text-sm"
                  style={{
                    color: selected ? "var(--ink)" : "var(--ink)",
                    fontWeight: selected ? 600 : 400,
                  }}
                >
                  {t.label}
                </span>
                <span
                  aria-hidden="true"
                  className="text-sm opacity-0 transition-opacity group-hover:opacity-100"
                  style={{ color: "var(--amber)" }}
                >
                  ›
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
