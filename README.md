# games

Clue lookup for the 1980s Jumbo board game *Murder on the Orient Express*.
Pick a case, an action and a target; it returns the clue number. No backend,
no configuration.

Deployed to Fly as `games-vaidehiagarwalla`, served at
games.vaidehiagarwalla.com. `/` redirects to `/orient-express` — the repo is
named for the hub it could become, but there is one game in it.

## Running it

    npm install
    npm run dev

## Checks

    npx tsc --noEmit
    npx eslint .
    npm run build

`src/components/ClueCard.tsx` reports one long-standing
`react-hooks/set-state-in-effect` error.

## Rolled

A second app, Rolled, was merged in here on 2026-09-08 and taken back out the
same day — it needed a Supabase database and an eBay key to do anything, and
was not worth the setup. The code is in this repo's history, and in
`vagarwalla/rolled`, which is archived.
