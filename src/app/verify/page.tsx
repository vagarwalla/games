import { Banner } from "@/components/Banner";
import { CLUES, TOTAL_CLUES } from "@/lib/clues";
import { ACTION_GROUPS, GRID } from "@/lib/grid";
import { CASE_COUNT } from "@/lib/types";

export const metadata = { title: "Ledger — Orient Express" };

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
    <div className="min-h-screen">
      <Banner active="verify" />

      <main className="mx-auto flex max-w-5xl flex-col gap-12 px-4 pb-20 pt-8">
        <section>
          <p className="label-kicker">Quality control</p>
          <h1
            className="mt-1 font-display text-3xl italic"
            style={{ color: "var(--ink)" }}
          >
            The Ledger
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--ink-muted)" }}>
            Transcription coverage, the full clue-numbers grid, and every booklet
            entry — for checking the data against the printed game.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-md p-3"
                style={{
                  background: "var(--paper-2)",
                  border: "1px solid var(--line)",
                }}
              >
                <div
                  className="font-display text-3xl leading-none"
                  style={{ color: "var(--amber)" }}
                >
                  {s.value}
                </div>
                <div className="label-kicker mt-1.5">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl italic" style={{ color: "var(--ink)" }}>
            Clue-numbers grid
          </h2>
          <p className="label-kicker mt-1">action × target × case</p>
          <div
            className="mt-4 overflow-x-auto rounded-md"
            style={{ border: "1px solid var(--line)" }}
          >
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr style={{ background: "var(--paper-sunk)" }}>
                  <th
                    className="label-kicker p-2 text-left"
                    style={{ borderBottom: "1px solid var(--line)" }}
                  >
                    Action / Target
                  </th>
                  {Array.from({ length: CASE_COUNT }, (_, i) => i + 1).map((c) => (
                    <th
                      key={c}
                      className="font-type p-2 text-center"
                      style={{ borderBottom: "1px solid var(--line)" }}
                    >
                      {c}
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
                        <td
                          className="p-2"
                          style={{ borderBottom: "1px solid var(--line-soft)" }}
                        >
                          <span
                            className="label-kicker mr-1"
                            style={{ fontSize: "0.58rem" }}
                          >
                            {g.label}
                          </span>
                          <span style={{ color: "var(--ink)" }}>{t.label}</span>
                        </td>
                        {(row?.numbers ?? Array(CASE_COUNT).fill(null)).map(
                          (n, i) => (
                            <td
                              key={i}
                              className="font-type p-2 text-center tabular-nums"
                              style={{
                                borderBottom: "1px solid var(--line-soft)",
                                color: n == null ? "var(--ink-muted)" : "var(--ink)",
                              }}
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
          <h2 className="font-display text-xl italic" style={{ color: "var(--ink)" }}>
            The booklet
          </h2>
          <p className="label-kicker mt-1">all {TOTAL_CLUES} clues</p>
          <ul className="mt-4 grid gap-1.5 sm:grid-cols-2">
            {CLUES.map((c) => {
              const pending = c.missing || !c.text;
              return (
                <li
                  key={c.n}
                  className="flex gap-2.5 rounded-md p-2.5 text-sm"
                  style={{
                    background: "var(--paper-2)",
                    border: "1px solid var(--line-soft)",
                  }}
                >
                  <span
                    className="font-type shrink-0 tabular-nums"
                    style={{ color: "var(--amber)", minWidth: "2.4rem" }}
                  >
                    №{c.n}
                  </span>
                  <span className="min-w-0 flex-1">
                    {c.verified && <Badge tone="teal">✓</Badge>}
                    {c.uncertain && <Badge tone="amber">⚠</Badge>}
                    {c.missing && <Badge tone="muted">pending</Badge>}
                    <span
                      style={{
                        color: pending ? "var(--ink-muted)" : "var(--ink)",
                        fontStyle: pending ? "italic" : "normal",
                      }}
                    >
                      {pending ? "Not transcribed yet." : c.text}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      </main>
    </div>
  );
}

function Badge({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "teal" | "amber" | "muted";
}) {
  const color =
    tone === "teal"
      ? "var(--teal)"
      : tone === "amber"
        ? "var(--amber)"
        : "var(--ink-muted)";
  return (
    <span
      className="font-type mr-1.5 text-[0.6rem] uppercase tracking-wider"
      style={{ color }}
    >
      {children}
    </span>
  );
}
