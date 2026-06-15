"use client";

import Image from "next/image";
import type { ActionKind, Target } from "@/lib/types";
import { ACTION_COLOR } from "./ActionTabs";

export function TargetList({
  targets,
  value,
  onChange,
  kind,
}: {
  targets: Target[];
  value: string | null;
  onChange: (targetId: string) => void;
  kind: ActionKind;
}) {
  const color = ACTION_COLOR[kind];

  return (
    <section>
      <h2 className="kicker mb-2">Who / where</h2>
      <ul
        key={kind}
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
      >
        {targets.map((t, i) => {
          const selected = value === t.id;
          return (
            <li
              key={t.id}
              className="animate-rise"
              style={{ animationDelay: `${Math.min(i * 25, 250)}ms` }}
            >
              <button
                type="button"
                onClick={() => onChange(t.id)}
                aria-pressed={selected}
                aria-label={t.label}
                title={t.label}
                className="focusable press relative block w-full overflow-hidden rounded-lg"
                style={{
                  aspectRatio: "591 / 864",
                  border: "3px solid var(--ink)",
                  borderRadius: "var(--radius)",
                  background: "var(--surface)",
                  boxShadow: selected
                    ? `0 0 0 4px ${color}, var(--shadow)`
                    : "var(--shadow-sm)",
                }}
              >
                {t.image ? (
                  <Image
                    src={t.image}
                    alt={t.label}
                    fill
                    sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 160px"
                    className="object-cover"
                  />
                ) : (
                  <span
                    className="font-display grid h-full w-full place-items-center text-2xl"
                    style={{ color: "var(--ink)" }}
                  >
                    {t.label}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
