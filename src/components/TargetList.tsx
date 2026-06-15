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
      <ul key={kind} className="grid grid-cols-1 gap-2 sm:grid-cols-2">
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
                className="focusable press flex w-full items-center gap-3 rounded-lg p-1.5 pr-3 text-left"
                style={{
                  background: selected ? color : "var(--surface)",
                  color: selected ? "#fffdf6" : "var(--ink)",
                  border: "3px solid var(--ink)",
                  boxShadow: selected ? "var(--shadow)" : "var(--shadow-sm)",
                }}
              >
                {t.image ? (
                  <span
                    className="relative block h-12 w-10 shrink-0 overflow-hidden rounded-md"
                    style={{ border: "2.5px solid var(--ink)", background: "#fff" }}
                  >
                    <Image
                      src={t.image}
                      alt=""
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </span>
                ) : (
                  <span
                    className="font-display grid h-12 w-10 shrink-0 place-items-center rounded-md text-sm"
                    style={{
                      background: selected ? "var(--surface)" : color,
                      color: selected ? "var(--ink)" : "#fffdf6",
                      border: "2.5px solid var(--ink)",
                    }}
                  >
                    {i + 1}
                  </span>
                )}
                <span className="flex-1 text-sm font-bold">{t.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
