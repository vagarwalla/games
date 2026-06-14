"use client";

import { ACTION_GROUPS } from "@/lib/grid";
import type { ActionKind } from "@/lib/types";

export function ActionTabs({
  value,
  onChange,
}: {
  value: ActionKind;
  onChange: (kind: ActionKind) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium opacity-70">What happened?</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {ACTION_GROUPS.map((g) => (
          <button
            key={g.kind}
            type="button"
            onClick={() => onChange(g.kind)}
            aria-pressed={value === g.kind}
            className={
              "rounded-lg border px-3 py-2 text-sm font-medium transition " +
              (value === g.kind
                ? "border-transparent bg-foreground text-background"
                : "border-black/15 dark:border-white/20")
            }
          >
            {g.label}
          </button>
        ))}
      </div>
    </div>
  );
}
