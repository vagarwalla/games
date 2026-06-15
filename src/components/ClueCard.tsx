import { clueByNumber } from "@/lib/clues";
import type { ActionKind, Clue } from "@/lib/types";

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

  if (isTelegram) {
    return (
      <TelegramCard clueNumber={clueNumber} clue={clue} pending={pending} />
    );
  }

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
      {/* cream label bar: title + circle number (no telegram stamp here) */}
      <div className="label-bar flex items-center gap-2.5 px-3 py-2">
        <span className="flex-1 text-xs leading-none sm:text-sm">
          {actionLabel}
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

      <div className="px-4 py-4">
        {pending ? (
          <p
            className="text-sm font-semibold italic"
            style={{ color: "var(--ink-soft)" }}
          >
            This clue has not been transcribed from the booklet yet.
          </p>
        ) : (
          <p
            className="text-[0.98rem] font-medium leading-relaxed"
            style={{ color: "var(--ink)" }}
          >
            {clue.text}
          </p>
        )}

        <StatusTags clue={clue} />
      </div>
    </article>
  );
}

/* ---- telegram ------------------------------------------------------- */

/**
 * A clue delivered as a wired telegram: printed office letterhead, a metadata
 * strip, and the message set in monospace ALL-CAPS with a STOP terminator —
 * the way a 1930s Wagons-Lits cable would actually have been pasted up.
 */
function TelegramCard({
  clueNumber,
  clue,
  pending,
}: {
  clueNumber: number;
  clue: Clue | undefined;
  pending: boolean;
}) {
  return (
    <article
      key={clueNumber}
      className="animate-pop overflow-hidden"
      style={{
        background: "#fbf4df" /* telegram form: a paler, yellowed paper */,
        border: "3px solid var(--ink)",
        borderRadius: "var(--radius)",
        boxShadow: "var(--shadow)",
      }}
    >
      {/* perforated tear strip across the very top */}
      <div className="perf" aria-hidden="true" />

      {/* printed letterhead */}
      <div className="flex items-center gap-2.5 px-3 pt-3 pb-2">
        <Stamp />
        <span className="min-w-0 flex-1 leading-tight">
          <span className="font-label block text-xs uppercase sm:text-sm">
            Telegram
          </span>
          <span
            className="font-label block text-[0.5rem] uppercase tracking-wide sm:text-[0.55rem]"
            style={{ color: "var(--ink-soft)" }}
          >
            Via Orient Express · Cie. Intl. des Wagons-Lits
          </span>
        </span>
        <span
          className="font-display grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm"
          style={{
            background: "var(--blue)",
            color: "var(--paper)",
            border: "2px solid var(--ink)",
          }}
        >
          {clueNumber}
        </span>
      </div>

      {/* metadata strip: office / words / serial */}
      <div
        className="font-label grid grid-cols-3 border-y-[3px] text-[0.5rem] uppercase sm:text-[0.55rem]"
        style={{ borderColor: "var(--ink)", color: "var(--ink-soft)" }}
      >
        <Meta label="Office" value="Calais" />
        <Meta label="Words" value={pending ? "—" : wordCount(clue?.text)} border />
        <Meta label="No." value={String(clueNumber).padStart(3, "0")} border />
      </div>

      {/* the pasted-up message */}
      <div className="px-4 pt-4 pb-4">
        <div className="morse mb-3" aria-hidden="true" />

        {pending ? (
          <p
            className="font-mono text-sm font-medium uppercase tracking-wide"
            style={{ color: "var(--ink-soft)" }}
          >
            Message not yet received from booklet office{" "}
            <span className="font-display">STOP</span>
          </p>
        ) : (
          <p
            className="font-mono text-[0.95rem] font-medium uppercase leading-relaxed tracking-wide"
            style={{ color: "var(--ink)" }}
          >
            {clue!.text}{" "}
            <span className="font-display tracking-normal">STOP</span>
          </p>
        )}

        <div className="morse mt-3" aria-hidden="true" />

        <StatusTags clue={clue} />
      </div>
    </article>
  );
}

function Meta({
  label,
  value,
  border,
}: {
  label: string;
  value: string;
  border?: boolean;
}) {
  return (
    <span
      className="px-3 py-1.5 leading-tight"
      style={border ? { borderLeft: "3px solid var(--ink)" } : undefined}
    >
      <span className="block opacity-70">{label}</span>
      <span className="block" style={{ color: "var(--ink)" }}>
        {value}
      </span>
    </span>
  );
}

function wordCount(text?: string) {
  if (!text) return "—";
  return String(text.trim().split(/\s+/).filter(Boolean).length);
}

function StatusTags({ clue }: { clue: Clue | undefined }) {
  if (!clue?.verified && !clue?.uncertain && !clue?.missing) return null;
  return (
    <div className="mt-3 flex flex-wrap gap-1.5">
      {clue?.verified && <Tag color="var(--green)">✓ verified</Tag>}
      {clue?.uncertain && <Tag color="var(--orange)">⚠ check</Tag>}
      {clue?.missing && <Tag color="var(--coral)">pending</Tag>}
    </div>
  );
}

/* the gold "T" telegram stamp on a blue square */
function Stamp() {
  return (
    <span
      aria-hidden="true"
      className="font-display grid h-9 w-9 shrink-0 place-items-center text-lg leading-none"
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
