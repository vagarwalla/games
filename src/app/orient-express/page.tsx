"use client";

import { useMemo, useRef, useState } from "react";
import { Banner } from "@/components/Banner";
import { CaseSelector } from "@/components/CaseSelector";
import { ActionTabs } from "@/components/ActionTabs";
import { TargetList } from "@/components/TargetList";
import { ClueCard } from "@/components/ClueCard";
import { ACTION_GROUPS, clueNumberFor } from "@/lib/grid";
import type { ActionKind } from "@/lib/types";

export default function Home() {
  const [caseNumber, setCaseNumber] = useState(1);
  const [kind, setKind] = useState<ActionKind>(ACTION_GROUPS[0].kind);
  const [targetId, setTargetId] = useState<string | null>(null);
  const resultRef = useRef<HTMLElement>(null);

  const group = useMemo(
    () => ACTION_GROUPS.find((g) => g.kind === kind)!,
    [kind]
  );

  const clueNumber =
    targetId != null ? clueNumberFor(kind, targetId, caseNumber) : null;

  function handleKind(next: ActionKind) {
    setKind(next);
    setTargetId(null);
  }

  // On mobile the clue renders below the target grid; bring it into view on select.
  // On desktop (lg+) the clue sits in a sticky sidebar that's already visible.
  function handleTarget(next: string) {
    setTargetId(next);
    if (typeof window === "undefined") return;
    if (window.matchMedia("(min-width: 1024px)").matches) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    requestAnimationFrame(() => {
      resultRef.current?.scrollIntoView({
        behavior: reduce ? "auto" : "smooth",
        block: "start",
      });
    });
  }

  return (
    <div className="min-h-screen">
      <Banner active="home" />

      <main className="safe-x safe-b mx-auto max-w-5xl px-3 pb-16 sm:px-4">
        <div className="grid gap-6 pt-6 pb-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,21rem)] lg:gap-8">
          <div className="flex flex-col gap-6">
            <CaseSelector value={caseNumber} onChange={setCaseNumber} />
            <ActionTabs value={kind} onChange={handleKind} />
            <TargetList
              kind={kind}
              targets={group.targets}
              value={targetId}
              onChange={handleTarget}
            />
          </div>

          {/* result — sticky on desktop, inline on mobile */}
          <aside
            ref={resultRef}
            className="scroll-mt-20 lg:sticky lg:top-20 lg:self-start"
          >
            <h2 className="kicker mb-2">The clue</h2>
            {targetId != null ? (
              <ClueCard
                clueNumber={clueNumber}
                kind={kind}
                actionLabel={group.label}
              />
            ) : (
              <div
                className="rounded-xl p-5"
                style={{
                  background: "var(--surface)",
                  border: "3px dashed var(--ink)",
                }}
              >
                <p
                  className="font-display text-lg"
                  style={{ color: "var(--ink)" }}
                >
                  All aboard.
                </p>
                <p
                  className="mt-1 text-sm font-medium"
                  style={{ color: "var(--ink-soft)" }}
                >
                  Case № {caseNumber} · {group.label}. Choose a target to reveal
                  the clue.
                </p>
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}
