import { clueByNumber } from "@/lib/clues";

export function ClueCard({ clueNumber }: { clueNumber: number | null }) {
  if (clueNumber == null) {
    return (
      <div className="rounded-xl border border-black/15 p-4 text-sm opacity-70 dark:border-white/20">
        No clue mapped for this selection.
      </div>
    );
  }

  const clue = clueByNumber(clueNumber);

  return (
    <div className="rounded-xl border border-black/15 p-4 dark:border-white/20">
      <div className="mb-2 flex items-center gap-2 text-xs font-medium opacity-70">
        <span className="rounded-full bg-foreground px-2 py-0.5 text-background">
          Clue #{clueNumber}
        </span>
        {clue?.verified && <span>✓ verified</span>}
        {clue?.uncertain && <span>⚠ uncertain</span>}
        {clue?.missing && <span>… pending</span>}
      </div>
      {clue?.missing || !clue?.text ? (
        <p className="text-sm italic opacity-70">
          Clue text not transcribed yet.
        </p>
      ) : (
        <p className="text-sm leading-relaxed">{clue.text}</p>
      )}
    </div>
  );
}
