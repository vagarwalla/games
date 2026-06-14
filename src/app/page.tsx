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

      <main className="mx-auto max-w-5xl px-4 pb-20">
        {/* masthead */}
        <section className="border-b py-8" style={{ borderColor: "var(--line)" }}>
          <p className="label-kicker">Just Games · Compagnie Internationale</p>
          <h1
            className="mt-1 font-display text-4xl italic leading-[1.05] sm:text-5xl"
            style={{ color: "var(--ink)" }}
          >
            Murder on the
            <br />
            Orient&nbsp;Express
          </h1>
          <p
            className="mt-3 max-w-md text-sm"
            style={{ color: "var(--ink-muted)" }}
          >
            Skip the two-step booklet shuffle. Pick the case, say what happened,
            choose the target — the clue is pulled for you.
          </p>
        </section>

        <div className="grid gap-10 py-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
          {/* left: the three taps */}
          <div className="flex flex-col gap-8">
            <Step n={1}>
              <CaseSelector value={caseNumber} onChange={setCaseNumber} />
            </Step>
            <Step n={2}>
              <ActionTabs value={kind} onChange={handleKind} />
            </Step>
            <Step n={3}>
              <TargetList
                groupKey={kind}
                targets={group.targets}
                value={targetId}
                onChange={setTargetId}
              />
            </Step>
          </div>

          {/* right: the result */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <h2 className="label-kicker mb-2">The clue</h2>
            {targetId != null ? (
              <ClueCard clueNumber={clueNumber} />
            ) : (
              <div
                className="rounded-lg p-6 text-sm"
                style={{
                  background: "var(--paper-2)",
                  border: "1px dashed var(--line)",
                  color: "var(--ink-muted)",
                }}
              >
                <p className="font-display text-lg italic" style={{ color: "var(--ink)" }}>
                  Awaiting your selection.
                </p>
                <p className="mt-1">
                  Case&nbsp;
                  <span style={{ color: "var(--amber)" }}>№ {caseNumber}</span> ·{" "}
                  {group.label}. Choose a target to reveal the clue.
                </p>
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <span
        aria-hidden="true"
        className="font-type mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs"
        style={{
          border: "1px solid var(--line)",
          color: "var(--ink-muted)",
        }}
      >
        {n}
      </span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
