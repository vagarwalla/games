"use client";

import { useMemo, useState } from "react";
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

  return (
    <div className="min-h-screen">
      <Banner active="home" />

      <main className="mx-auto max-w-5xl px-3 pb-16 sm:px-4">
        {/* marquee hero */}
        <section
          className="mt-4 rounded-2xl px-4 py-6 text-center sm:py-8"
          style={{
            background: "var(--teal)",
            border: "3px solid var(--ink)",
            boxShadow: "var(--shadow)",
          }}
        >
          <h1
            className="font-display leading-[0.95] tracking-wide"
            style={{ color: "var(--paper)", textShadow: "3px 3px 0 var(--ink)" }}
          >
            <span className="block text-4xl sm:text-6xl">ORIENT</span>
            <span className="block text-4xl sm:text-6xl">EXPRESS</span>
          </h1>
          <p
            className="mx-auto mt-3 max-w-md text-sm font-semibold"
            style={{ color: "var(--paper)" }}
          >
            Skip the booklet shuffle. Pick the case, say what happened, choose
            the target — the clue is pulled for you.
          </p>
        </section>

        <div className="grid gap-6 py-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,21rem)] lg:gap-8">
          <div className="flex flex-col gap-6">
            <CaseSelector value={caseNumber} onChange={setCaseNumber} />
            <ActionTabs value={kind} onChange={handleKind} />
            <TargetList
              kind={kind}
              targets={group.targets}
              value={targetId}
              onChange={setTargetId}
            />
          </div>

          {/* result — sticky on desktop, inline on mobile */}
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <h2 className="kicker mb-2">The clue</h2>
            {targetId != null ? (
              <ClueCard clueNumber={clueNumber} />
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
