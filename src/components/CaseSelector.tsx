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
    <div>
      <p className="mb-2 text-sm font-medium opacity-70">Case #</p>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: CASE_COUNT }, (_, i) => i + 1).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => onChange(c)}
            aria-pressed={value === c}
            className={
              "h-10 w-10 rounded-lg border text-sm font-semibold transition " +
              (value === c
                ? "border-transparent bg-foreground text-background"
                : "border-black/15 dark:border-white/20")
            }
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
