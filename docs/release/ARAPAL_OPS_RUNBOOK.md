# Arapal V1 — Operations Runbook

_How to build, verify, ship, configure, and recover the exact-candidate V2
surface. Last updated 2026-08-25 (IP-09)._

Arapal is a static, local-first browser app (Vite + React, hash routing, no
backend). "Deploying" means serving a folder of static files. There is no
server, database, or scheduled job to operate.

## 1. Build & run

```bash
npm install
npm run dev        # local dev server (Vite) — labs/QA surfaces are present here
npm run build      # production build → dist/ (dev/lab surfaces tree-shaken out)
npm run preview    # serve the built dist/ locally to smoke it
```

- Node: use the version in the toolchain the repo was built with (Node 24.x was
  used for this candidate). `npm run dev`/`build` need no environment variables.
- `PORT` is honoured by the dev server if set (used by the preview harness).

## 2. Pre-ship verification gates

Run these before shipping. All must be green on the production surface.

```bash
npm run build                                   # must succeed
npm run lint                                     # 0 errors
node --test tests/data/*.test.mjs tests/ai/*.test.mjs   # data + AI unit tests
npm run test:behaviour                           # Playwright behaviour suite (needs a dev server on :5173)
npm run qa                                       # deterministic visual floor — production surface must be 0
npm run vr                                        # visual regression vs the golden baseline
```

- **QA floor (`npm run qa`)** checks 14 routes × 5 viewports for overlap, type
  floor, drift, and clipping. The **production surface must report 0**; the
  legacy reference surface is out of scope and its count is expected to be
  non-zero until that surface is retired.
- **Behaviour + QA + VR** drive a real browser. In a sandboxed CI they may need
  the browser sandbox disabled (Chromium Mach-port failure); they expect a dev
  server already running on `:5173`.
- Do **not** edit source while the behaviour suite runs (HMR mid-run causes
  spurious fast failures); after editing source, fully reload the browser before
  re-verifying.

## 3. Deploy

The build output in `dist/` is a static site. Serve it from any static host or
CDN at the site root. Requirements:

- Serve `index.html` for the app entry. Routing is **hash-based** (`#v2/...`), so
  no server-side rewrite rules are required and deep links work without SPA
  fallback config.
- The bundle is self-contained (fonts and assets inlined/bundled; no runtime
  CDN). No environment variables, secrets, or API keys are injected at build or
  deploy time — the AI key is BYO and lives only in the user's browser (see the
  Security & Privacy Review).
- The production entry is the V2 app (`#` / unknown hashes → V2 Project Home).
  The internal Labs and Quality Dashboard are compiled out of `dist` (IP-08) and
  are not reachable in production.

## 4. AI provider configuration (BYO-key)

AI is off by default and honestly unavailable until a user supplies their own
provider key. There is **no in-product configuration UI yet** (see the Security &
Privacy Review, §3 gap 1). Until one ships, a key is set in the browser:

```js
// In the app's browser console, on the deployed origin:
localStorage.setItem('arapal.ai.config', JSON.stringify({
  provider: 'gemini',
  apiKey: '<the user\'s own key>',
  model: 'gemini-2.0-flash',
}))
// To disable AI again:
localStorage.removeItem('arapal.ai.config')
```

The key is the user's own and is stored only on their device. Never commit a key
or bake one into the build.

## 5. Recovery & rollback

- **Corrupt local state:** on load, state that fails validation (wrong shape or a
  future schema version) is copied to `arapal.v1.state.quarantine` and the app
  continues from empty rather than showing a blank crash (R-019). To recover, the
  quarantined value can be inspected/restored from browser storage. A top-level
  error boundary offers reload/reset if a render fails.
- **A user wants a clean slate:** clearing site data for the origin removes all
  Arapal storage (see the key inventory in the Security & Privacy Review).
- **Rollback a release:** because deploys are static files, roll back by
  re-publishing the previous `dist/`. No migrations run on deploy; client state is
  versioned and forward-incompatible state is quarantined, so an older build will
  not crash on a newer local state — it sets it aside.

## 6. Visual-regression baseline

The golden baseline lives in `tests/visual/__golden__/`. After an **intended** UI
change, review the diff, then update the baseline and re-verify:

```bash
npm run vr           # see what changed vs the current golden
npm run vr:accept    # accept the new render as the golden (only after reviewing)
npm run vr           # must now pass clean
```

Never accept a baseline to make an unexplained diff disappear; accept only
changes you intended.
