import { clueByNumber } from "@/lib/clues";
import type { ActionKind, Clue } from "@/lib/types";

export function ClueCard({
  clueNumber,
  kind,
}: {
  clueNumber: number | null;
  kind: ActionKind;
  /** Still accepted by callers; each document supplies its own letterhead title. */
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

/**
 * Per-action document dressing. Each non-telegram clue arrives as a different
 * in-universe paper: the suspect's spoken statement, the crew's confided
 * account, or the detective's own field note from searching the scene.
 */
const DOSSIER: Record<
  DossierKind,
  {
    title: string;
    subtitle: string;
    glyph: string;
    accent: string;
    /** in-universe setup line shown above the clue */
    lead: string;
    /** "quote" = spoken testimony in marks; "note" = observed prose */
    body: "quote" | "note";
  }
> = {
  "question-suspect": {
    title: "Witness Statement",
    subtitle: "Taken under caution · Pullman car",
    glyph: "?",
    accent: "var(--coral)",
    lead: "Pressed for answers, the suspect says",
    body: "quote",
  },
  "question-crew": {
    title: "Crew's Account",
    subtitle: "Cie. Intl. des Wagons-Lits",
    glyph: "✦",
    accent: "var(--purple)",
    meta: [
      ["Post", "Steward"],
      ["Coach", "Dining"],
    ],
    lead: "A member of the crew confides",
    body: "quote",
  },
  "search-area": {
    title: "Field Note",
    subtitle: "From the detective's notebook",
    glyph: "⌕",
    accent: "var(--green)",
    meta: [
      ["Where", "Cabine"],
      ["Hour", "Dusk"],
    ],
    lead: "Searching the area, you find",
    body: "note",
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
          <>
            <p
              className="font-label mb-2 text-[0.55rem] uppercase tracking-wide"
              style={{ color: t.accent }}
            >
              {t.lead}
            </p>
            <DossierBody body={t.body} text={clue!.text} accent={t.accent} />
          </>
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
  body: "quote" | "note";
  text: string;
  accent: string;
}) {
  if (body === "quote") {
    return (
      <blockquote
        className="relative pl-7 text-[1.02rem] italic leading-relaxed"
        style={{ color: "var(--ink)" }}
      >
        <span
          aria-hidden="true"
          className="font-display absolute left-0 top-0 not-italic leading-none"
          style={{ color: accent, fontSize: "2.4rem", lineHeight: 0.8 }}
        >
          “
        </span>
        {text}
      </blockquote>
    );
  }
  // note: the detective's observation, set like a ruled notebook line
  return (
    <p
      className="border-l-[3px] pl-3 text-[0.98rem] font-medium leading-relaxed"
      style={{ color: "var(--ink)", borderColor: accent }}
    >
      {text}
    </p>
  );
}

/* a gold glyph stamped on a coloured square — the seal of each document */
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
