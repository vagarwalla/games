import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

/*
 * The hub. Until now `/` redirected straight to /orient-express, which was
 * fine while there was one game; with Rolled folded in there are two, so the
 * root has to actually choose. Each entry keeps its own palette inside its own
 * route — this page is in the Orient Express house style because that is what
 * :root carries.
 */
const GAMES = [
  {
    href: "/orient-express",
    name: "Orient Express",
    kicker: "Clue lookup",
    blurb:
      "Pick a case, an action and a target, and it pulls the clue number. For the 1980s Jumbo board game.",
    emoji: "🚂",
    ground: "var(--teal)",
  },
  {
    href: "/rolled",
    name: "Rolled",
    kicker: "Deal finder",
    blurb:
      "Build a stack of board games you want secondhand, then search eBay for Like New and Very Good listings, cheapest first.",
    emoji: "🎲",
    ground: "var(--orange)",
  },
];

export default function HubPage() {
  return (
    <div className="min-h-screen">
      <header className="safe-x mx-auto flex max-w-5xl items-center justify-between pt-6 pb-2">
        <p className="kicker">vaidehiagarwalla.com</p>
        <ThemeToggle />
      </header>

      <main className="safe-x mx-auto max-w-5xl pb-16">
        <h1
          className="pt-4 pb-2 text-5xl leading-none sm:text-6xl"
          style={{ fontFamily: "var(--font-display)", color: "var(--ink)" }}
        >
          Games
        </h1>
        <p
          className="max-w-prose pb-8 text-base"
          style={{ color: "var(--ink-soft)" }}
        >
          Two small things for board games — one that reads clues out of a 1980s
          detective game, one that hunts down secondhand copies.
        </p>

        <ul className="grid gap-5 sm:grid-cols-2">
          {GAMES.map((game) => (
            <li key={game.href}>
              <Link
                href={game.href}
                className="focusable press panel block h-full overflow-hidden p-0"
              >
                <div
                  className="label-bar flex items-center gap-2 px-4 py-2 text-sm"
                  style={{ background: game.ground, color: "var(--paper)" }}
                >
                  <span aria-hidden="true">{game.emoji}</span>
                  <span>{game.kicker}</span>
                </div>
                <div className="p-4">
                  <h2
                    className="pb-1 text-2xl leading-tight"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "var(--ink)",
                    }}
                  >
                    {game.name}
                  </h2>
                  <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
                    {game.blurb}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
