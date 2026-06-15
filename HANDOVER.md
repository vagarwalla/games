# Handover — Orient Express app

_Last updated: 2026-06-15. Written from a Claude Code **cloud** session to be picked up on your **local** device._

## TL;DR

- The **flip-card feature is already merged to `main`** (squash `d22a51d`) but **is not on prod yet**.
- Prod is the **Fly.io** app `games-vaidehiagarwalla` (region `sjc`, domain `games.vaidehiagarwalla.com`).
- An **auto-deploy GitHub Actions workflow** was added (`.github/workflows/deploy.yml`, merged in `b56de97`). It is correct and fully verified **except** it needs one secret: `FLY_API_TOKEN`.
- The cloud session **could not finish the deploy itself** — that sandbox blocks egress to Fly, can't set GitHub secrets, and can't trigger workflows. None of that applies on your local machine.

Work the tasks below **top-down**.

---

## Task 1 — Get the flip card live (DO FIRST)

You have two ways. **Option A is fastest and also fixes Task 2 for free.**

### Option A — set the secret, let CI deploy (recommended)
```bash
# 1. Make a deploy-scoped Fly token (rotate the one pasted in chat earlier!)
fly tokens create deploy -a games-vaidehiagarwalla

# 2. Add it as a GitHub Actions secret named FLY_API_TOKEN
#    Web/phone: repo → Settings → Secrets and variables → Actions → New repository secret
#    Or from local CLI if you have gh:
gh secret set FLY_API_TOKEN --repo vagarwalla/orient-express-app   # paste token when prompted

# 3. Kick the deploy (no new commit needed)
gh workflow run "Deploy to Fly.io" --ref main --repo vagarwalla/orient-express-app
# ...or in the UI: Actions → Deploy to Fly.io → Run workflow → main
```
Watch it: `gh run watch --repo vagarwalla/orient-express-app` (or the Actions tab). It should go green; then hard-refresh `https://games.vaidehiagarwalla.com/orient-express`.

### Option B — deploy straight from local right now
```bash
git checkout main && git pull
fly deploy --remote-only        # uses fly.toml (app games-vaidehiagarwalla)
```
Use this only if you want it live before touching CI. **You still want Task 2 done** so future merges deploy on their own.

### Verifying the change is live
On the clue screen, pick any action + target. The clue now shows as a **sealed cover** that **flips on tap** to reveal the document, and **flips back on a second tap**. Reduced-motion users get an instant swap.

---

## Task 2 — Make automated deploy smooth (local + cloud)

**Why this matters:** the deploy trigger runs on **GitHub's runners**, not on your laptop or the cloud sandbox. So once it's wired, **every merge to `main` deploys — no matter where the change was authored** (local editor or a Claude cloud session). That's the whole point: the cloud sandbox can't reach Fly, but it doesn't need to — it just pushes/merges, and GitHub does the deploy.

### What's already in place
`.github/workflows/deploy.yml` (on `main`):
```yaml
name: Deploy to Fly.io
on:
  push:
    branches: [main]
  workflow_dispatch:
concurrency:
  group: deploy-fly
  cancel-in-progress: true
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: superfly/flyctl-actions/setup-flyctl@master
      - run: flyctl deploy --remote-only
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

### The one required step
Set the `FLY_API_TOKEN` secret (Task 1, Option A, step 2). After that, automation is "done."

### Optional hardening (nice-to-haves, do when you have a minute)
- **Pin the flyctl action** for reproducible builds: replace `@master` with a pinned ref/SHA.
- **Add a PR check** so `main` never goes red. Create `.github/workflows/ci.yml`:
  ```yaml
  name: CI
  on:
    pull_request:
  jobs:
    build:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - uses: actions/setup-node@v4
          with: { node-version: 22, cache: npm }
        - run: npm ci
        - run: npm run lint
        - run: npm run build
  ```
- **If you ever want the *cloud* session to deploy directly** (not just via CI): add `fly.io` and `api.fly.io` to the cloud environment's **egress allowlist** (network settings — see https://code.claude.com/docs/en/claude-code-on-the-web). Not required if you're happy with the CI path, which already covers cloud edits.

---

## Task 3 — Record the preference globally + in scaffolding

You want this to be the default for **every** project, in both local and cloud editing modes.

### 3a. Add to your global `~/.claude/CLAUDE.md`
Paste this block (this file is on your local device; the cloud session can't edit it):
```markdown
## Deployment (strong preference — apply to every project)
- Every project MUST auto-deploy when a branch is merged to the default branch
  (`main`), and it MUST work whether the change was authored in a **local**
  editor or a **Claude Code cloud** session.
- Use **GitHub Actions** (or the platform's git-triggered deploy) as the trigger,
  because it runs on the provider's runners — independent of where the code was
  written. Cloud sandboxes often can't reach the deploy target directly; never
  let that be the bottleneck. The CI path is the source of truth.
- When scaffolding or onboarding a project, treat deploy automation as a
  first-class setup step, not an afterthought:
  1. Add a deploy workflow on `push: [main]` + `workflow_dispatch`.
  2. List required secrets in the README and confirm they're set.
  3. Add a PR build/lint check so `main` stays green.
- Fly.io specifics: `flyctl deploy --remote-only` with a `FLY_API_TOKEN`
  repo secret; commit a `fly.toml`.
- At the end of any task that changes app behavior, state plainly whether the
  change is actually on prod, and if not, what the single remaining step is.
```

### 3b. Reusable scaffold
Keep a copy of `.github/workflows/deploy.yml` (and the `ci.yml` above) in your project template / dotfiles so new repos start with deploy-on-merge already wired. Consider a tiny checklist in each new repo's README:
- [ ] Deploy workflow present
- [ ] Required secrets set (`FLY_API_TOKEN`, …)
- [ ] PR CI check present
- [ ] Verified a merge actually reaches prod

---

## Reference

| Thing | Value |
|---|---|
| Prod host | Fly.io app `games-vaidehiagarwalla`, region `sjc` |
| Prod URL | https://games.vaidehiagarwalla.com/orient-express |
| Flip-card change | PR #11, squash `d22a51d` (on `main`) |
| Deploy workflow | PR #12, squash `b56de97` (on `main`) |
| Failed CI run (pre-secret) | run #1 — failed only at `flyctl deploy`: _"no access token available"_ (empty `FLY_API_TOKEN`). Everything else passed. |

**Security note:** a Fly token was pasted into the Claude chat earlier. Rotate/revoke it:
```bash
fly tokens list
fly tokens revoke <id>
```
Then issue a fresh one for the GitHub secret.
