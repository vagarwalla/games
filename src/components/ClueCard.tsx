import { clueByNumber } from "@/lib/clues";
import type { ActionKind, Clue } from "@/lib/types";

export function ClueCard({
  clueNumber,
  kind,
}: {
  clueNumber: number | null;
  kind: ActionKind;
  /** Still accepted by callers; the document letterhead supplies its own title. */
  actionLabel?: string;
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
    <DossierCard
      kind={kind}
      clueNumber={clueNumber}
      clue={clue}
      pending={pending}
    />
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
        <Stamp glyph="T" bg="var(--blue)" />
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

/* ---- dossier (suspect / crew / search) ------------------------------ */

type DossierKind = Exclude<ActionKind, "telegram">;

/** Per-action document dressing: each clue arrives as a different in-universe paper. */
const DOSSIER: Record<
  DossierKind,
  {
    title: string;
    subtitle: string;
    glyph: string;
    accent: string;
    /** 3 fixed metadata fields; the serial is appended as a 4th-style "No." */
    meta: [string, string][];
    /** how the clue text reads */
    body: "statement" | "log" | "tag";
    /** sign-off line under the clue */
    sign: string;
  }
> = {
  "question-suspect": {
    title: "Witness Statement",
    subtitle: "Taken under caution · Pullman car",
    glyph: "?",
    accent: "var(--coral)",
    meta: [
      ["Oath", "Sworn"],
      ["Car", "9"],
    ],
    body: "statement",
    sign: "So deposed",
  },
  "question-crew": {
    title: "Service Log",
    subtitle: "Cie. Intl. des Wagons-Lits",
    glyph: "§",
    accent: "var(--purple)",
    meta: [
      ["Watch", "Night"],
      ["Coach", "Bar"],
    ],
    body: "log",
    sign: "Entered in the log",
  },
  "search-area": {
    title: "Evidence Tag",
    subtitle: "Compagnie inventory office",
    glyph: "✦",
    accent: "var(--green)",
    meta: [
      ["Zone", "Cabine"],
      ["Shelf", "B"],
    ],
    body: "tag",
    sign: "Logged in evidence",
  },
};

function DossierCard({
  kind,
  clueNumber,
  clue,
  pending,
}: {
  kind: DossierKind;
  clueNumber: number;
  clue: Clue | undefined;
  pending: boolean;
}) {
  const t = DOSSIER[kind];
  const serial = String(clueNumber).padStart(3, "0");

  return (
    <article
      key={clueNumber}
      className="animate-pop overflow-hidden"
      style={{
        background: "var(--surface)",
        border: "3px solid var(--ink)",
        borderRadius: "var(--radius)",
        boxShadow: "var(--shadow)",
      }}
    >
      {/* coloured kicker band so each document is recognisable at a glance */}
      <div
        style={{ height: 7, background: t.accent, borderBottom: "3px solid var(--ink)" }}
        aria-hidden="true"
      />

      {/* printed letterhead */}
      <div className="flex items-center gap-2.5 px-3 pt-3 pb-2">
        <Stamp glyph={t.glyph} bg={t.accent} />
        <span className="min-w-0 flex-1 leading-tight">
          <span className="font-label block text-xs uppercase sm:text-sm">
            {t.title}
          </span>
          <span
            className="font-label block text-[0.5rem] uppercase tracking-wide sm:text-[0.55rem]"
            style={{ color: "var(--ink-soft)" }}
          >
            {t.subtitle}
          </span>
        </span>
        <span
          className="font-display grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm"
          style={{ background: t.accent, color: "var(--paper)", border: "2px solid var(--ink)" }}
        >
          {clueNumber}
        </span>
      </div>

      {/* metadata strip */}
      <div
        className="font-label grid grid-cols-3 border-y-[3px] text-[0.5rem] uppercase sm:text-[0.55rem]"
        style={{ borderColor: "var(--ink)", color: "var(--ink-soft)" }}
      >
        <Meta label={t.meta[0][0]} value={t.meta[0][1]} />
        <Meta label={t.meta[1][0]} value={t.meta[1][1]} border />
        <Meta label="No." value={serial} border />
      </div>

      {/* the document body */}
      <div className="px-4 pt-4 pb-4">
        {pending ? (
          <p
            className="text-sm font-semibold italic"
            style={{ color: "var(--ink-soft)" }}
          >
            Not yet transcribed from the booklet.
          </p>
        ) : (
          <DossierBody body={t.body} text={clue!.text} accent={t.accent} />
        )}

        {!pending && (
          <p
            className="font-label mt-3 text-[0.55rem] uppercase tracking-wide"
            style={{ color: t.accent }}
          >
            — {t.sign}
          </p>
        )}

        <StatusTags clue={clue} />
      </div>
    </article>
  );
}

/** Renders the clue text in the voice of each document type. */
function DossierBody({
  body,
  text,
  accent,
}: {
  body: "statement" | "log" | "tag";
  text: string;
  accent: string;
}) {
  if (body === "statement") {
    return (
      <p
        className="font-body text-[0.98rem] italic leading-relaxed"
        style={{ color: "var(--ink)" }}
      >
        <span className="font-display not-italic" style={{ color: accent }}>
          “
        </span>
        {text}
        <span className="font-display not-italic" style={{ color: accent }}>
          ”
        </span>
      </p>
    );
  }
  if (body === "log") {
    return (
      <p
        className="font-mono text-[0.9rem] leading-relaxed"
        style={{ color: "var(--ink)" }}
      >
        <span className="opacity-50">21h40 — </span>
        {text}
      </p>
    );
  }
  // tag
  return (
    <p
      className="font-mono text-[0.92rem] font-medium uppercase leading-relaxed tracking-wide"
      style={{ color: "var(--ink)" }}
    >
      {text}
    </p>
  );
}

/* a gold glyph stamped on a coloured square — the wax-seal of each document */
function Stamp({ glyph = "T", bg = "var(--blue)" }: { glyph?: string; bg?: string }) {
  return (
    <span
      aria-hidden="true"
      className="font-display grid h-9 w-9 shrink-0 place-items-center text-lg leading-none"
      style={{
        background: bg,
        color: "var(--yellow)",
        border: "2.5px solid var(--ink)",
        borderRadius: "4px",
        textShadow: "1px 1px 0 var(--ink)",
      }}
    >
      {glyph}
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
