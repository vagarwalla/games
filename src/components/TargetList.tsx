"use client";

import type { Target } from "@/lib/types";

export function TargetList({
  targets,
  value,
  onChange,
}: {
  targets: Target[];
  value: string | null;
  onChange: (targetId: string) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium opacity-70">Target</p>
      <ul className="flex flex-col gap-1.5">
        {targets.map((t) => (
          <li key={t.id}>
            <button
              type="button"
              onClick={() => onChange(t.id)}
              aria-pressed={value === t.id}
              className={
                "w-full rounded-lg border px-3 py-2 text-left text-sm transition " +
                (value === t.id
                  ? "border-transparent bg-foreground text-background"
                  : "border-black/15 dark:border-white/20")
              }
            >
              {t.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
