import { clueByNumber } from "@/lib/clues";

export function ClueCard({ clueNumber }: { clueNumber: number | null }) {
  if (clueNumber == null) {
    return (
      <div
        className="animate-card rounded-lg p-5 text-sm"
        style={{
          background: "var(--paper-2)",
          border: "1px dashed var(--line)",
          color: "var(--ink-muted)",
        }}
      >
        No clue is recorded for this combination.
      </div>
    );
  }

  const clue = clueByNumber(clueNumber);
  const pending = !clue || clue.missing || !clue.text;

  return (
    <article
      key={clueNumber}
      className="animate-card relative overflow-hidden rounded-lg p-5"
      style={{
        background: "var(--paper-2)",
        border: "1px solid var(--line)",
        boxShadow: "0 8px 24px var(--shadow)",
      }}
    >
      {/* perforated telegram edge */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1.5"
        style={{
          background:
            "repeating-linear-gradient(90deg, var(--amber) 0 8px, transparent 8px 16px)",
          opacity: 0.45,
        }}
      />

      <div className="mb-3 flex items-start justify-between gap-4">
        <div>
          <p className="label-kicker">Telegram · clue</p>
          <p
            className="font-display text-2xl italic leading-none"
            style={{ color: "var(--ink)" }}
          >
            Clue №&thinsp;{clueNumber}
          </p>
        </div>

        {/* wax-ish stamp */}
        <span
          aria-hidden="true"
          className="animate-stamp font-type grid h-14 w-14 shrink-0 place-items-center rounded-full text-center text-[0.6rem] leading-tight"
          style={{
            color: "var(--stamp-ink)",
            border: "2px solid var(--stamp-ink)",
            opacity: 0.85,
          }}
        >
          O.E.
          <br />№{clueNumber}
        </span>
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        {clue?.verified && <Tag tone="teal">✓ verified</Tag>}
        {clue?.uncertain && <Tag tone="amber">⚠ uncertain</Tag>}
        {clue?.missing && <Tag tone="muted">… pending</Tag>}
      </div>

      {pending ? (
        <p className="text-sm italic" style={{ color: "var(--ink-muted)" }}>
          This clue has not been transcribed from the booklet yet.
        </p>
      ) : (
        <p
          className="text-[0.95rem] leading-relaxed"
          style={{ color: "var(--ink)" }}
        >
          {clue.text}
        </p>
      )}
    </article>
  );
}

function Tag({
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
      className="font-type rounded-full px-2 py-0.5 text-[0.62rem] uppercase tracking-wider"
      style={{ color, border: `1px solid ${color}` }}
    >
      {children}
    </span>
  );
}
