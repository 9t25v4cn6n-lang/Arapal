# Arapal — Execution Plan

**Written 2026-08-16. This file is a cold start.** It assumes the reader has no memory of
the conversation that produced it. Read this, `DECISIONS.md`, then begin. Do not re-run the
audit — its conclusions are already recorded here and in `ARAPAL_PRODUCT_QUALITY_AUDIT.md`.

---

## 0 · Before anything (2 minutes)

```bash
npm run dev          # REQUIRED — the save-hook and commit gate silently skip without it
npm run qa -- --quick   # confirm the checker still runs and the number is ~672
```

- **`npm run qa` is the standard.** It runs automatically after every edit to `src/` via
  `.claude/settings.json`, and blocks commits via `.githooks/pre-commit`.
- It fails only on **new** violations, never on the accepted baseline
  (`artifacts/qa/baseline.json`). Existing debt will not block you.
- **Do not add visual rules to prompts or to `CLAUDE.md`.** The standard lives in
  `scripts/qa/standard.mjs`. If a defect is found by eye, add the rule there — that is the
  only way it becomes permanent.

## 1 · Where things stand

- Baseline **672** blocking violations across 12 routes × 4 frames (was 1,329).
- 10 screens archived to `archive/` on 2026-08-16. See `archive/README.md`.
- `public/screens.html` is a live contact sheet of the surviving screens.
- **V1 is a real product**, not a demo (`DECISIONS.md`, 2026-08-16). Data layer is in scope.
- **The V1 surface is the V2 route set.** Legacy is replaced, not maintained.
- Mobile (390px) is in scope but **last**.

### Two legacy screens are BLOCKED, not kept
They are agreed for archive but still hold behaviour V2 lacks. Do not delete them until
their behaviour is ported.

| Blocked | Holds |
|---|---|
| `src/screens/MakeSegmentationFlowScreen.jsx` | real sentence/paragraph splitting, granularity + style options, transition preferences |
| `src/components/figma/` (4 files) | discussion panel (docked/floating/modal), collapsed-rail hover flyouts, pass/fail support-card swap |

---

## 2 · Design source of truth

Figma file `VwzaUb5YtAonCnMVMRmvmd` — **AraPal Rebuild**. Revisions run
Reconstruction → Polished → R2 → **R3 (current)**.

### The ownership split — this is the operating rule

| Category | Owner | Examples |
|---|---|---|
| **Decisions** | **Figma R3** | type ramp, colour ramp, semantics, information architecture, composition, which states exist |
| **Derivations** | **Code + checker** | spacing, centring, container sizing, alignment, overflow, responsive behaviour |
| **Behaviour** | **The running app** | discuss panel, pass/fail, search, autosave, exam→study handoff |

**Never copy a number out of Figma. Copy the decision, derive the number.**
Copying `56px` for the nav rail would re-encode the exact bug that was just fixed — the rail
now derives its padding from `controlSizing.navRailControlPx`, so it cannot drift again.

### R3 frame inventory — no Figma round-trip needed to plan

Open with `get_screenshot` using `fileKey: VwzaUb5YtAonCnMVMRmvmd` and the node id.

**47 · R3 — Home & Projects**
| Node | Frame |
|---|---|
| `259:2533` | Home / 01 · Returning |
| `259:2559` | Home / 02 · Empty · No source |
| `259:2585` | Projects / 01 · Library |

**48 · R3 — Study** — *specifies everything the blocked legacy Study holds*
| Node | Frame |
|---|---|
| `259:7953` | 01 · Draft · V2 default |
| `259:8060` | 02 · Submitted · Pass · Live review flow |
| `259:8176` | 03 · Focus |
| `259:8283` | 04 · Repair · V2 |
| `259:8406` | 05 · Support collapsed |
| `259:8514` | 06 · Support floating |
| `259:8638` | 07 · Support fullscreen |
| `260:1364` | 08 · Draft · Support expanded |
| `260:1487` | 09 · Draft · Support hover preview |
| `269:1649` | 10 · Repair + Companion |
| `269:1985` | 11 · Pass + Companion |
| `270:10919` | 12 · Draft + Companion |
| `272:1661` | 13 · Global nav hover |

**49 · R3 — Segmentation** — *specifies everything the blocked legacy Segmentation holds*
| Node | Frame |
|---|---|
| `259:10050` | 01 · Paste |
| `259:10191` | 02 · Options open |
| `270:376` | 02Q · Options · Quick publish |
| `259:10258` | 03 · Processing |
| `270:11237` | 03Q · Processing · Quick publish |
| `322:423` | 03B · Segmenting transition |
| `259:10467` | 03M · Manual setup |
| `259:10098` | 04 · Review · V2 editor |
| `259:10306` | 05 · Review · Active edit |
| `259:10399` | 06 · Publish success |

**50 · R3 — Research**
| Node | Frame |
|---|---|
| `259:10997` | 01 · Browse — **NOT preferred, see below** |
| `259:10898` | 02 · Segment selected |

**51 · R3 — Exams**
| Node | Frame |
|---|---|
| `259:11541` | 01 · Assessment studio |
| `259:11600` | 02 · Builder · Prefix |
| `265:10524` | 02B · Builder · Tracker range |
| `259:11708` | 03 · Attempt · Focused canvas |
| `259:11853` | 04 · Results · By concept |
| `270:10578` | 04B · Results · By segment |

**39 · R2 — Foundation** — shell primitives
| Node | Frame |
|---|---|
| `214:380` | Nav Rail · `215:379` Nav Rail Expanded |
| `214:486` | Header Bar · `214:507` Body Backdrop · `214:513` Panel |

### Known exception — preference is per-frame, not per-page
**Use `243:284` (R2 Research / 01 · Browse), not the R3 browse frame.**
R2 hides the inspector in browse and gives the ledger the full 1092px, which removes the
heading truncation the audit measured. R3's browse keeps the ledger at ~672px and leaves the
right third empty. R3 wins everywhere else in Research.

### What R3 closes that measurement could not
- **`Home / 02 · Empty · No source`** — a real first-run empty state. The audit listed this as
  MISSING (M5) across four screens and untestable, because there is no way to create a second
  project. R3 answers it.
- **`Home / 01 · Returning`** leads with one specific resume action rather than four equal cards.
- **`Exams / 04 · Results`** carries a "Repair the … answer → Open in Study" callout, which is
  the one cross-screen handoff the legacy app already implements correctly.

---

## 3 · Build order

Ordered by dependency. Each item is independently verifiable by `npm run qa`.

### A · Shell foundation — do first, it propagates to every screen
Source: R2 Foundation frames. Touches `src/v2/foundation/layout/universalShell.ts` and the
rail/header/panel primitives.
- Reconcile nav rail, header bar, body backdrop and panel against R3's usage.
- **Derive every dimension.** The rail padding pattern is already correct — follow it.
- Exit: `npm run qa` shows no new violations and `container-undersized` has fallen.

### B · The Home vertical — the recommended single objective for a focused session
This is one journey through every layer, which is the thing that stops the project stalling
at "screens that look finished but hold nothing".

1. Project entity + store. One place that owns projects, sources, segments, drafts.
2. `v2/projectHome` built from `259:2533` and `259:2559` — **including the empty state**.
   It is currently an empty scaffold and the one rail destination with nothing behind it.
3. `v2/projects` reconciled against `259:2585`.
4. Persist. Close the tab, reopen, the state is still there.
5. Re-add `projectHome` to the rail in `routeRegistry.ts` (removed 2026-08-16 when archived).

Exit: create a project, leave, return, it is still there. That single test is the point.

### C · Research browse — small, high value
Adopt `243:284` (R2 browse): hide the inspector, give the ledger full width. Removes the
measured heading truncation. Research is already the strongest screen; this finishes it.

### D · Exams on V2
Build from `259:11541` / `11600` / `11708` / `11853`. Port the working
`handleJumpToStudy` sessionStorage handoff from `src/screens/ExamsScreen.jsx:1529` — it is
correct, do not reinvent it. Then archive legacy Exams and restore the rail entry.

### E · Study on V2 — the largest piece, needs its own session
Port from `src/components/figma/` against the 13 R3 frames. Only after this can
`src/components/figma/` be archived.

### F · Segmentation logic extraction
Lift the splitter and options model out of `MakeSegmentationFlowScreen.jsx` into a module,
wire `segmentationPasteNext` to it, then archive the legacy screen.

### G · Mobile (390px), last
`DECISIONS.md` records this as in scope but lowest priority. The four-pane Study workspace is
the hard case and needs design, not breakpoints.

---

## 4 · Standing rules

1. **Say what to build. Nothing else.** Do not enumerate padding, fonts, symmetry, spacing —
   the checker holds all of it. That enumeration was the drain this setup exists to remove.
2. **"Done" means the checker passed.** No table, not done.
3. **A defect found by eye is a bug in `scripts/qa/standard.mjs`**, not in the screen. Add the
   rule; it never comes back.
4. **Fix at the shared cause.** No local patch where a primitive is at fault.
5. **Do not rebuild from scratch.** Rebuilding without the checker running has been attempted
   three times at three scales and reproduced the same output each time.
6. **Do not write more governance prose.** This file and `DECISIONS.md` are the limit.

---

# 5 · Maximum-throughput run — parallel work packages

For a short, high-intelligence window. Packages are defined by **disjoint file ownership** so
they can run as concurrent subagents without corrupting each other. Never run two packages
that claim the same file.

**Wave 1 must complete before Wave 2 starts.** Everything in Wave 2 consumes Wave 1's output;
building screens first means building them twice.

## Wave 0 — mechanisation (codemods, ~20 min, runs before everything)

The bulk cleanup is **not hand work**. It is transformation, and the checker makes it safe:
a codemod touching 978 values across 18 files is verifiable in one 3-minute run. Write the
codemod, run it, run `npm run qa`, read the delta. Do not hand-edit these.

### M1 · Literal → token codemod
`src/**` — 978 hardcoded hex occurrences, 198 distinct values, spanning two greyscales
(`#64748b` x53 alongside `#6b7280` x16; `#0f172a` x60 alongside `#111827` x14).
- Build the mapping from `src/v2/foundation/tokens/colors.ts`, nearest-match with a
  distance ceiling; anything outside the ceiling is reported, not guessed.
- Emit a report of unmapped values — those are real decisions for a human.
- Verify: `contrast` count falls, nothing else rises.

### M2 · Type-size snapping codemod
86 distinct rendered font sizes against a 15-step ramp (`TYPE_RAMP` in `scripts/qa/standard.mjs`).
- Snap each literal to its nearest ramp step; refuse to snap anything more than 1.5px away
  and report it instead.
- Verify: `type-floor` and `type-drift` fall.

### M3 · Lint + dead config
- `npx eslint . --fix` clears most of the 42 errors mechanically; the 8
  `react-hooks/set-state-in-effect` need judgement — leave them for P9.
- Delete `src/styles/` (unimported; references Tailwind, which is not a dependency) and the
  boilerplate `:root` in `src/index.css` (`--accent: #aa3bff`, a template leftover).

### M4 · CSS extraction scaffold
18 files carry `const …Styles = \`…\`` template literals; Segmentation injects 101KB at mount
and the production stylesheet is only 9KB, so none of it is cacheable.
- Mechanically extract each block to a co-located `.css` file and import it. This does not
  restructure anything — it makes the CSS greppable, analysable and cacheable, which is what
  makes every later cleanup cheap.
- Verify: no visual delta. Any delta is a bug in the extraction, not a design change.

**Wave 0 exit:** baseline has fallen substantially and no new violations exist. If a codemod
cannot be made safe, report it and move on — do not hand-edit as a fallback.

## Wave 1 — foundations (2 packages, parallel)

### P1 · Design system + shell
**Owns:** `src/v2/foundation/**` *except* `primitives/StudyWorkspacePrimitives.jsx` and
`primitives/SegmentationFlowPrimitives.jsx` (claimed by P7 and P6), `src/index.css`
- Build the missing primitives: `Button`, `Card`, `Chip`, `Panel`, `Field`, `IconButton`.
  There are ~25 button class families and 5 primary-button implementations today; this
  collapses them. Full state set — hover, focus-visible, active, disabled.
- Enforce a 44px hit area in `IconButton` (68 `hit-target` violations trace here).
- Reconcile shell against R2 Foundation (`214:380`, `214:486`, `214:507`, `214:513`).
- **Derive every dimension.** Follow the nav-rail pattern already in `universalShell.ts`.
- Exit: `npm run qa` shows no new violations; `container-undersized` and `hit-target` fall.

### P2 · Data layer
**Owns:** `src/v2/data/**` (new), `src/v2/screens/Projects/useServerQuery.js`
- Entities: project, source, segment, draft, attempt. One store that owns them.
- Persistence with a real round-trip. Extend the working `design-sandbox.segment-state.v1`
  pattern rather than inventing a new one.
- A typed navigation function that carries context between screens — generalise
  `handleJumpToStudy` (`src/screens/ExamsScreen.jsx:1529`), which is the one correct
  cross-screen handoff in the codebase.
- Define the evaluation boundary — one interface, stubbed, **and the stub is visibly labelled**.
- Exit: create a project, reload, it is still there.

## Wave 2 — screens (5 packages, parallel)

| Package | Owns | Source frames |
|---|---|---|
| **P3 · Home + Projects** | `src/v2/screens/ProjectHome/**` (new), `src/v2/screens/Projects/**` | `259:2533`, `259:2559`, `259:2585` |
| **P4 · Research** | `src/v2/screens/ProjectResearch/**` | `259:10898` + **`243:284` for browse** (R2, not R3) |
| **P5 · Exams** | `src/v2/screens/Exams/**` (new) | `259:11541`, `259:11600`, `265:10524`, `259:11708`, `259:11853`, `270:10578` |
| **P6 · Segmentation** | `src/v2/screens/Segmentation*/**`, `src/v2/lib/segmentation.js` (new), `foundation/primitives/SegmentationFlowPrimitives.jsx` | `259:10050`, `259:10191`, `270:376`, `259:10258`, `270:11237`, `322:423`, `259:10467`, `259:10098`, `259:10306`, `259:10399` |
| **P7 · Study** | `src/v2/screens/StudyWorkspace/**`, `foundation/primitives/StudyWorkspacePrimitives.jsx` | all 13 frames on page `48 · R3 — Study` |

P6 must **extract the splitter and options model** out of `MakeSegmentationFlowScreen.jsx`
into `src/v2/lib/segmentation.js` before that screen can be archived.
P7 must **port the discussion panel, hover flyouts and pass/fail swap** out of
`src/components/figma/` before it can be archived.

Each package also updates `src/v2/app/routeRegistry.ts` — **that file is shared, so route
changes are collected and applied by the coordinator, not by the packages.**

## Wave 3 — sequential, single agent

### P8 · Mobile (390px) — scaffold mechanically, design only the hard case
No mobile design exists in Figma — R3 is 1440×900 throughout. Do not hand-design 12 screens.

1. **Mechanical first.** The V2 screens are driven by layout contracts. Add a `narrow` variant
   to the contract schema and generate a stacked single-column layout for every screen from
   the existing declarations. That produces a working 390px pass for the whole surface without
   designing anything.
2. **Then design only where stacking genuinely fails.** On evidence that is the Study
   workspace — four panes with a simultaneous-visibility premise that 390px cannot hold.
   Produce **2–3 options** for it. Everything else is likely fine stacked.

This inverts the cost: the scaffold covers the surface, judgement is spent on the one screen
that needs it.

### P9 · Cleanup
- 42 ESLint errors (13 `no-unused-vars`, 8 `react-hooks/set-state-in-effect`, 5 `exhaustive-deps`).
- Delete dead config: `src/styles/` (unimported, references Tailwind which is not a dependency),
  the boilerplate `:root` in `src/index.css` (`--accent: #aa3bff`).
- Route-level code-splitting; exclude the six dev labs from the production bundle.
- Repoint `v2/qualityDashboard` at `artifacts/qa/visual-standard.json` — it still reports
  `productQuality: 74.6 / auditTrust: 98` from April.
- Archive `MakeSegmentationFlowScreen.jsx` and `src/components/figma/` **only if** P6 and P7
  ported their behaviour. Re-add `projectHome` and `exams` to the rail.
- `npm run qa:accept` to reseed the baseline at the end.

## Generate options, do not seek approval mid-run
Where a decision is genuinely open, produce 2–3 variants and record them. Do not stop and ask.
Feedback is cheaper after the window than during it.

## If time runs short, cut in this order
P8 → P9 → P5 → P7. Never cut P1 or P2; they are what stop the rest being built twice.
