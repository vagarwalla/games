# games

Two small board-game tools in one Next.js app, deployed to Fly as
`games-vaidehiagarwalla` and served at games.vaidehiagarwalla.com.

| Route | What it is |
|---|---|
| `/` | The hub — picks between the two. |
| `/orient-express` | Clue lookup for the 1980s Jumbo *Murder on the Orient Express*. Pick a case, an action and a target; it returns the clue number. No backend. |
| `/rolled` | Board-game deal finder. Build a stack of games you want secondhand, then search eBay for Like New / Very Good listings, cheapest first. Needs Supabase and eBay. |

Rolled moved here from its own repo in September 2026; `vagarwalla/rolled` is
archived. Its routes live under `/rolled` and `/api/rolled/*`, its components
under `src/components/rolled/`, and its palette is scoped to a `.rolled` class
in `globals.css` so the two games can share `:root` without fighting over
`--background` and `--radius`. Both follow one theme — the `.dark` class that
next-themes puts on `<html>`.

## Running it

    npm install
    npm run dev

`/` and `/orient-express` work with no configuration. `/rolled` needs three
values; without them its API routes return 500 and say which one is missing:

| Variable | For |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | the stacks database |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | same |
| `EBAY_APP_ID` | the eBay Finding API |

In production these are Fly secrets:

    fly secrets set NEXT_PUBLIC_SUPABASE_URL=... NEXT_PUBLIC_SUPABASE_ANON_KEY=... EBAY_APP_ID=... -a games-vaidehiagarwalla

## Checks

    npx tsc --noEmit
    npm test
    npm run lint
    npm run build

`src/components/ClueCard.tsx` reports one long-standing
`react-hooks/set-state-in-effect` error. It predates the Rolled merge.
