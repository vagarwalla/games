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
    { label: "Total", value: TOTAL_CLUES, color: "var(--blue)" },
    { label: "Transcribed", value: transcribed, color: "var(--teal)" },
    { label: "Verified", value: verified, color: "var(--green)" },
    { label: "Uncertain", value: uncertain, color: "var(--orange)" },
    { label: "Missing", value: missing, color: "var(--coral)" },
    { label: "Grid rows", value: GRID.length, color: "var(--purple)" },
  ];

  return (
    <div className="min-h-screen">
      <Banner active="verify" />

      <main className="safe-x mx-auto flex max-w-5xl flex-col gap-10 pb-16 pt-5">
        <section>
          <h1
            className="font-display text-3xl"
            style={{ color: "var(--ink)" }}
          >
            The Ledger
          </h1>
          <p
            className="mt-1.5 text-sm font-medium"
            style={{ color: "var(--ink-soft)" }}
          >
            Transcription coverage, the full clue-numbers grid, and every booklet
            entry — for checking the data against the printed game.
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-6">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-lg p-3"
                style={{
                  background: "var(--surface)",
                  border: "3px solid var(--ink)",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <div
                  className="font-display text-3xl leading-none"
                  style={{ color: s.color }}
                >
                  {s.value}
                </div>
                <div className="kicker mt-1.5">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl" style={{ color: "var(--ink)" }}>
            Clue-numbers grid
          </h2>
          <p className="kicker mt-1">action × target × case</p>
          <div
            className="mt-3 overflow-x-auto rounded-lg"
            style={{ border: "3px solid var(--ink)" }}
          >
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr style={{ background: "var(--teal)", color: "#fffdf6" }}>
                  <th className="font-label p-2 text-left text-[0.6rem] uppercase">
                    Target
                  </th>
                  {Array.from({ length: CASE_COUNT }, (_, i) => i + 1).map((c) => (
                    <th
                      key={c}
                      className="font-display p-2 text-center"
                      style={{ minWidth: "2.2rem" }}
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
                          className="whitespace-nowrap p-2 font-semibold"
                          style={{
                            borderTop: "2px solid var(--ink)",
                            color: "var(--ink)",
                          }}
                        >
                          <span className="kicker mr-1.5">{g.label}</span>
                          {t.label}
                        </td>
                        {(row?.numbers ?? Array(CASE_COUNT).fill(null)).map(
                          (n, i) => (
                            <td
                              key={i}
                              className="p-2 text-center font-semibold tabular-nums"
                              style={{
                                borderTop: "2px solid var(--ink)",
                                borderLeft: "1px solid var(--ink)",
                                color:
                                  n == null ? "var(--ink-soft)" : "var(--ink)",
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
          <h2 className="font-display text-xl" style={{ color: "var(--ink)" }}>
            The booklet
          </h2>
          <p className="kicker mt-1">all {TOTAL_CLUES} clues</p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {CLUES.map((c) => {
              const pending = c.missing || !c.text;
              return (
                <li
                  key={c.n}
                  className="flex gap-2.5 rounded-lg p-2.5 text-sm"
                  style={{
                    background: "var(--surface)",
                    border: "2.5px solid var(--ink)",
                  }}
                >
                  <span
                    className="font-display shrink-0 tabular-nums"
                    style={{ color: "var(--blue)", minWidth: "2.6rem" }}
                  >
                    №{c.n}
                  </span>
                  <span className="min-w-0 flex-1">
                    {c.verified && <Badge color="var(--green)">✓</Badge>}
                    {c.uncertain && <Badge color="var(--orange)">⚠</Badge>}
                    {c.missing && <Badge color="var(--coral)">pending</Badge>}
                    <span
                      style={{
                        color: pending ? "var(--ink-soft)" : "var(--ink)",
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
  color,
}: {
  children: React.ReactNode;
  color: string;
}) {
  return (
    <span
      className="font-label mr-1.5 rounded px-1.5 py-0.5 text-[0.5rem] uppercase"
      style={{ background: color, color: "#fffdf6", border: "1.5px solid var(--ink)" }}
    >
      {children}
    </span>
  );
}
