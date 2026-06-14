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
    <main>
      <Banner active="home" />
      <div className="mx-auto flex max-w-xl flex-col gap-6 px-4 py-6">
        <CaseSelector value={caseNumber} onChange={setCaseNumber} />
        <ActionTabs value={kind} onChange={handleKind} />
        <TargetList
          targets={group.targets}
          value={targetId}
          onChange={setTargetId}
        />
        {targetId != null && <ClueCard clueNumber={clueNumber} />}
      </div>
    </main>
  );
}
