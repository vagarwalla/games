import { clueByNumber } from "@/lib/clues";
import type { ActionKind } from "@/lib/types";

export function ClueCard({
  clueNumber,
  kind,
  actionLabel,
}: {
  clueNumber: number | null;
  kind: ActionKind;
  actionLabel: string;
}) {
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
  const isTelegram = kind === "telegram";

  return (
    <article
      key={clueNumber}
      className="animate-pop overflow-hidden"
      style={{
        background: "var(--paper)",
        border: "3px solid var(--ink)",
        borderRadius: "var(--radius)",
        boxShadow: "var(--shadow)",
      }}
    >
      {/* cream label bar with the "T" stamp + title + circle number */}
      <div className="label-bar flex items-center gap-2.5 px-3 py-2">
        <Stamp />
        <span className="flex-1 text-xs leading-none sm:text-sm">
          {isTelegram ? "Telegram" : actionLabel}
        </span>
        <span
          className="font-display grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm"
          style={{
            background: "var(--ink)",
            color: "var(--paper)",
          }}
        >
          {clueNumber}
        </span>
      </div>

      {/* telegram body: morse rules top & bottom */}
      <div className="px-4 py-4">
        <div className="morse mb-3" aria-hidden="true" />

        {pending ? (
          <p
            className="text-sm font-semibold italic"
            style={{ color: "var(--ink-soft)" }}
          >
            This clue has not been transcribed from the booklet yet.{" "}
            <span className="font-display not-italic">STOP</span>
          </p>
        ) : (
          <p
            className="text-[0.98rem] font-medium leading-relaxed"
            style={{ color: "var(--ink)" }}
          >
            {clue.text}
          </p>
        )}

        <div className="morse mt-3" aria-hidden="true" />

        {(clue?.verified || clue?.uncertain || clue?.missing) && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {clue?.verified && <Tag color="var(--green)">✓ verified</Tag>}
            {clue?.uncertain && <Tag color="var(--orange)">⚠ check</Tag>}
            {clue?.missing && <Tag color="var(--coral)">pending</Tag>}
          </div>
        )}
      </div>
    </article>
  );
}

/* the gold "T" telegram stamp on a blue square */
function Stamp() {
  return (
    <span
      aria-hidden="true"
      className="font-display grid h-8 w-8 shrink-0 place-items-center text-lg leading-none"
      style={{
        background: "var(--blue)",
        color: "var(--yellow)",
        border: "2.5px solid var(--ink)",
        borderRadius: "4px",
        textShadow: "1px 1px 0 var(--ink)",
      }}
    >
      T
    </span>
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
      style={{ background: color, color: "#fffdf6", border: "2px solid var(--ink)" }}
    >
      {children}
    </span>
  );
}
