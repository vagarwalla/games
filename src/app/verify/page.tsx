import { Banner } from "@/components/Banner";
import { CLUES, TOTAL_CLUES } from "@/lib/clues";
import { ACTION_GROUPS, GRID } from "@/lib/grid";
import { CASE_COUNT } from "@/lib/types";

export const metadata = { title: "Verify — Orient Express" };

export default function VerifyPage() {
  const verified = CLUES.filter((c) => c.verified).length;
  const uncertain = CLUES.filter((c) => c.uncertain).length;
  const missing = CLUES.filter((c) => c.missing).length;
  const transcribed = CLUES.filter((c) => !c.missing && c.text).length;

  const stats = [
    { label: "Total clues", value: TOTAL_CLUES },
    { label: "Transcribed", value: transcribed },
    { label: "Verified", value: verified },
    { label: "Uncertain", value: uncertain },
    { label: "Missing", value: missing },
    { label: "Grid rows", value: GRID.length },
  ];

  return (
    <main>
      <Banner active="verify" />
      <div className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-6">
        <section>
          <h1 className="mb-3 text-lg font-semibold">Coverage</h1>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-black/15 p-3 dark:border-white/20"
              >
                <div className="text-2xl font-semibold">{s.value}</div>
                <div className="text-xs opacity-70">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">
            Clue-numbers grid (action × target × case)
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr>
                  <th className="border-b border-black/15 p-1.5 text-left dark:border-white/20">
                    Action / Target
                  </th>
                  {Array.from({ length: CASE_COUNT }, (_, i) => i + 1).map((c) => (
                    <th
                      key={c}
                      className="border-b border-black/15 p-1.5 dark:border-white/20"
                    >
                      C{c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ACTION_GROUPS.flatMap((g) =>
                  g.targets.map((t) => {
                    const row = GRID.find(
                      (r) => r.kind === g.kind && r.targetId === t.id
                    );
                    return (
                      <tr key={`${g.kind}-${t.id}`}>
                        <td className="border-b border-black/5 p-1.5 dark:border-white/10">
                          <span className="opacity-60">{g.label}:</span> {t.label}
                        </td>
                        {(row?.numbers ?? Array(CASE_COUNT).fill(null)).map(
                          (n, i) => (
                            <td
                              key={i}
                              className="border-b border-black/5 p-1.5 text-center dark:border-white/10"
                            >
                              {n ?? "—"}
                            </td>
                          )
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">
            All clues ({TOTAL_CLUES})
          </h2>
          <ul className="flex flex-col gap-1.5">
            {CLUES.map((c) => (
              <li
                key={c.n}
                className="rounded-lg border border-black/10 p-2 text-sm dark:border-white/15"
              >
                <span className="mr-2 font-semibold">#{c.n}</span>
                {c.verified && <span className="mr-1">✓</span>}
                {c.uncertain && <span className="mr-1">⚠</span>}
                {c.missing && <span className="mr-1 opacity-60">… pending</span>}
                <span className={c.missing || !c.text ? "italic opacity-60" : ""}>
                  {c.missing || !c.text ? "Not transcribed yet." : c.text}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
