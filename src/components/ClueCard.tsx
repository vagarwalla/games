import { clueByNumber } from "@/lib/clues";

export function ClueCard({ clueNumber }: { clueNumber: number | null }) {
  if (clueNumber == null) {
    return (
      <div
        className="animate-pop rounded-xl p-5 text-sm font-semibold"
        style={{
          background: "var(--surface)",
          border: "3px dashed var(--ink)",
          color: "var(--ink-soft)",
          borderRadius: "var(--radius)",
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
      className="animate-pop overflow-hidden"
      style={{
        background: "var(--blue)",
        border: "3px solid var(--ink)",
        borderRadius: "var(--radius)",
        boxShadow: "var(--shadow)",
      }}
    >
      {/* booklet "cover" header */}
      <div className="px-4 pt-3.5 pb-3" style={{ color: "#fffdf6" }}>
        <p
          className="font-display text-sm leading-none tracking-wide"
          style={{ textShadow: "2px 2px 0 var(--ink)" }}
        >
          ORIENT EXPRESS
        </p>
        <p className="font-label mt-1.5 text-[0.6rem] uppercase opacity-90">
          Clue Booklet
        </p>
      </div>

      {/* inner "page" */}
      <div
        className="m-2 mt-0 rounded-lg p-4"
        style={{
          background: "var(--surface)",
          border: "3px solid var(--ink)",
        }}
      >
        <div className="mb-2 flex items-center justify-between gap-3">
          <span
            className="font-display text-2xl leading-none"
            style={{ color: "var(--ink)" }}
          >
            № {clueNumber}
          </span>
          <span className="flex flex-wrap justify-end gap-1.5">
            {clue?.verified && <Tag color="var(--green)">✓ verified</Tag>}
            {clue?.uncertain && <Tag color="var(--orange)">⚠ check</Tag>}
            {clue?.missing && <Tag color="var(--coral)">pending</Tag>}
          </span>
        </div>

        {pending ? (
          <p className="text-sm font-medium italic" style={{ color: "var(--ink-soft)" }}>
            This clue has not been transcribed from the booklet yet.
          </p>
        ) : (
          <p className="text-[0.95rem] leading-relaxed" style={{ color: "var(--ink)" }}>
            {clue.text}
          </p>
        )}
      </div>
    </article>
  );
}

function Tag({
  children,
  color,
}: {
  children: React.ReactNode;
  color: string;
}) {
  return (
    <span
      className="font-label rounded-full px-2 py-0.5 text-[0.55rem] uppercase"
      style={{
        background: color,
        color: "#fffdf6",
        border: "2px solid var(--ink)",
      }}
    >
      {children}
    </span>
  );
}
