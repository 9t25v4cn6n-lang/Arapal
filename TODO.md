# Arapal — Current Stage and Next Milestones

## QA Pass 2 — public release visual QA (complete for desktop)

Brief: `ARAPAL_PUBLIC_RELEASE_VISUAL_QA_PASS_2_SCREENSHOTS/ARAPAL_PUBLIC_RELEASE_VISUAL_QA_PASS_2.md`
Ledger: `ARAPAL_QA_PASS_2_VERIFICATION_LEDGER.md`

41 of 42 findings PASS, 1 NOT REPRODUCED. Desktop production surface is at 0
violations across 1280/1366/1440/1920; behaviour suite 36 passed, 2 skipped.

Next milestones:

1. **390×844.** 16 production violations, down from 20. The frame is still
   unbuilt and it is now the largest single gap: Study's shell title and progress
   overlap, Research's desk clips, Source Intake clips, Projects escapes the
   viewport, Exams has slack beside clipped content.
2. **Finish the script-aware migration.** `getScriptAwareRole` and
   `containsArabic` exist and are applied to Project Home and the Study segment
   rail. Projects list, Research ledger titles and Exams still render
   user-authored content in fixed Latin roles.
3. **`AI SEGMENT TEXT` has no accessible name** despite visible text —
   `read_page` returns a bare button.
4. **Legacy routes.** 172 reference violations, unchanged and untouched by this
   pass; they are the behaviour-port backlog, not visual debt.

Executable gates added this pass, both of which found real defects the moment
they were written:

- `scripts/qa/lint-tokens.mjs` — undeclared numeric token keys resolve to
  `undefined` and the browser drops the whole declaration. Caught 43 sites.
- the same script's `textFaint`-on-text rule — the token's own docstring says
  decorative and icon-only. Caught 5 sites.

Both run in the per-edit QA hook and need no browser.

## 2026-08-18 · Public-release visual refinement pass — desktop

Ran against `ARAPAL_PUBLIC_RELEASE_VISUAL_REFINEMENT_PASS(1).md`. Stage 0
(foundations) first, then the eighteen findings, then an independent sweep.

**Standing evidence, all re-run after the last change.**

| Check | Result |
|---|---|
| `npm run qa` (4 desktop frames × 14 routes) | production surface **0** |
| `npm run qa` (390×844) | 21 on V2 production — see below |
| visual regression | 56/56, twice consecutively, goldens re-accepted |
| behaviour | 36 passed, 2 skipped (pre-existing `fixme`) |
| node data + store | 34 passed |
| `vite build` | clean |
| eslint | 16 errors, unchanged from the start of the pass |

**Known gap, carried forward: the 390px frame.** The mobile frame is declared in
the standard but the layouts behind it are not built (`DECISIONS.md`,
2026-08-16, sequences mobile last). This pass is desktop; it left 21 findings on
V2 production routes at 390×844, against roughly 13 before it. Two belong to the
new Exams route. The regression was largely the header start lane and the
Projects master floor, both of which were given mobile behaviour during the
pass; what remains is unbuilt mobile layout, not desktop debt. Do not read the
desktop zero as a mobile claim.

**Next milestone.** The 390px version, as the last V1 scope item.

---

## 2026-08-18 · RELEASE CANDIDATE — desktop production surface

Declared against `ARAPAL_RELEASE_CONVERGENCE_PLAN.md` §10. All eleven dimensions
are evidenced for the surface that section measures: its viewports are 1440×900,
1366×768, 1920×1080 and 1280×800, all desktop.

**Scope of the claim.** This is a release candidate for the DESKTOP production
surface. It is not all of V1. `DECISIONS.md` (2026-08-16) records that a 390px
mobile version is required for V1, sequenced last so it gates nothing earlier.
It is untouched, and no gate currently measures it — there is no 390px frame in
`scripts/qa/standard.mjs` or `tests/visual/states.mjs`. That is unfinished
implementation work, not real-world uncertainty, and it is named here rather
than folded into a pass.

**Standing evidence.** Verified in ONE clean run of all three Playwright suites
together (`tests/visual tests/behaviour tests/qa`, 118 passed / 2 skipped, exit
0), not three separate runs stitched together. The first declaration cited three
runs taken at different times, which is not the same claim — recorded here
because assembling evidence in one state is the whole point of the gate.

| Check | Result |
|---|---|
| `npm run qa` | production surface **0**, reference 126, zero blank/drifted routes, zero page errors |
| visual regression | 56 states, 0 unreachable |
| behaviour | 36 passing, 2 skipped |
| probe acuity | 26, every rule proved on a synthetic defect |
| node (data + qa) | 56 |
| eslint | 18 errors, each justified in commit `99edb9b` |

**Known limits, recorded not hidden.**
- Pixel diffing has a contrast-and-size floor: an 18px icon swap moves ~150px
  against a 1,037px gate. Identity questions belong in assertions, not
  screenshots — which is why the rail-icon rule is a node test.
- Above ~1460px the review palette sits further into the margin than the
  content. Verified as no overlap; a cosmetic detachment at one frame.
- `study-discussion` has no pixel golden. Driven states are reachability-only
  because they used to flap; that reason may no longer hold now motion is frozen
  and the driver is fixed. Worth revisiting deliberately.
- 126 reference findings on `legacy-home`, `legacy-study`, `legacy-segmentation`.
  Discharged by porting their behaviour and deleting them, not by styling them.
- Chromium cannot launch inside the command sandbox, so the pre-commit gate fails
  safe and is advisory here. `npm run qa` was run manually before every commit.

**Next phase: mobile 390px.** In progress — production surface at 390x844 is
**16**, down from 41 when the frame was declared. Desktop unaffected throughout
(0 at 1440x900 and 1280x800).

Fixed so far, all at shared causes: the flow header's brand label (10
truncations across the segmentation screens), the Study rails (zero-width *and*
`display: none`, because a 0px grid track still lays its children out), the
Study inset (a 20% padding took 132px of a 330px body — a percentage cannot be
capped into behaving, so it uses the breakpoint), Projects' history tab, and the
Research metric strip.

### Known blocker: Research at mobile needs a contract-level signal

`v2-projectResearch` still renders its lens rail and search panel side by side
at 390px, both cut. The ledger/inspector split now stacks, but the panels above
it sit in **contract-rendered regions whose `gridTemplateColumns` is written
inline** by `ScreenContractRenderer` — no stylesheet can reach them, exactly as
no media query could reach the Study columns.

Study solved this by taking width as an input to the function that already
computes its columns from state. Research cannot: its columns come from the
static contract object, which has no access to runtime state. The fix is to
thread a mobile signal through the contract layer — either the renderer
selecting a `mobile` variant of each region's style, or contracts becoming
functions of viewport. That is an architectural change and is deliberately not
started at the end of a long session.

### Note on reading the mobile count

Two "improvements" this phase scored **better while being worse**, because
collapsed and clipped elements stop being measurable. A single-column Study read
22 while the lexicography row overlapped the editor by 80px; widening the work
column moved the total 28 -> 29. A count from a broken layout is not comparable
to a count from a working one — check the render, not just the number.

---

## 2026-08-17 · Gate status detail

Measured against `ARAPAL_RELEASE_CONVERGENCE_PLAN.md` §10. Status is
**NOT RELEASE READY** — 4 of 11 dimensions evidenced.

| Dimension | State | Evidence |
|---|---|---|
| Floor | **pass** | Checker production surface 0 blocking violations, 13 routes × 4 frames, from a run with zero blank routes, zero drifted routes, zero page errors. Reference debt 126, tracked separately and discharged by porting, not styling. |
| Regression | **pass** | 56 golden states green. Every re-baseline this cycle inspected before acceptance. Two mislabelled goldens found and fixed: `seg-processing` held a picture of the Success screen, and `v2-home-returning` had never been on Project Home. Every state now asserts it is still on the screen it names. |
| Engineering | **pass, with 18 justified** | 42 lint errors → 18, each remaining one recorded in the commit. Two real defects fixed (Exams attempt clock, hash mutation). `no-unused-vars` blindfold replaced with real JSX detection, which exposed 7 dead imports it had been hiding. |
| Design uplift | **pass, with two product questions raised** | All R3 areas compared against the running screens: Home, Projects, Study, Research, Exams, Segmentation. Imported where the better decision was clear — Review's docked commit bar, Exams' next-assessment lead, Study's header count, Project Home's project rows. Recorded as *reviewed, nothing to import* where live was ahead (Research). Two findings are product decisions rather than design imports and are written up in `DECISIONS.md` 2026-08-17: Home and Projects both lead with "resume"; and "Manual start" routes to an AI proposal. |
| Function | **pass** | Whole journey driven by hand at 1440×900 on 2026-08-17, not inferred from unit-scoped tests: pasted a real Arabic source → splitter derived 3 segments → project created titled from the source with `isSample: false` → Study opened on that source ("SEGMENT 1 OF 3") → wrote a translation → submitted → result recorded. Reported counts match stored counts at every step. Plus 31 behaviour tests. The pass found a real defect (see below). |
| Persistence | **pass** | Verified across a full reload in the same run: the submission survived, the rail marker read `is-active is-submitted` and the footer `STUDIED 1 / 3`. Covered by test for the leak clause too — a draft does not leak to the next segment, and a completed attempt does not resurrect. |
| Behaviour parity | **pass** | Re-characterised by driving the running screens: V2 Study has 39 controls to legacy's 23 and is a superset; every characterised legacy capability is present in V2 or belongs to Exams (retained production). One real gap found and fixed (style/granularity were not persisted). The three rail destinations V2 appeared to lack — Review Queue, Completed, Profile — are dead controls in legacy: clicking each changes neither hash nor content. No parity debt remains. See `DECISIONS.md` 2026-08-17. |
| Fit | **pass, with one recorded non-import** | Critique pass over all ten production routes. Fixed: Project Home stated its invitation twice; the segmentation flow had no step it could finish on (Success sat on Review's index); Projects and Project Research shared one rail icon. Reviewed and deliberately NOT changed: R3's Study header order (nav left / identity centre / count right). Ours is nav-fixed already — Previous/Next hold at y=66 under scroll, verified — so the difference is information order, not behaviour, and §2.2 asks for demonstrably superior decisions rather than resemblance. The genuinely superior part of that header, dropping the dash row that restated the segment count, was imported earlier in 81d9c07. |
| Visual quality | **pass, with limits recorded** | Rendered review at 1440×900 across every production route, plus 1280×800 where a defect was suspected. Found and fixed this cycle: the Study composer's manufactured voids, a source card holding 111px spare while clipping its own passage, a translation box hiding the user's typed text, discussion mode rebuilding the layout, the review palette running 148px past the fold with unpressable controls. Two limits are recorded rather than tuned away: pixel diffing has a contrast-and-size floor (an 18px icon swap moves ~150px against a 1,037px gate), and above ~1460px the review palette sits further into the margin than the content — verified as no overlap. |
| Integration | **pass** | Every V2 route renders the identical six-item rail in the same order. Exams was a one-way door — reachable from V2 but exiting to legacy `#home`/`#study`, screens the standard classifies as reference, with no rail and no route back. Its exits now target the V2 production surface, and `readContext` reads the legacy key as well as its own so the Exam→Study handoff (§2.3 protected) arrives with provenance intact. Verified live and covered by a new test. |
| Unknowns | listed, plus one new | See "Toolbar reachability" below. |

---

## 2026-08-16 · Release convergence — earlier phases, **NOT RELEASE READY**

Branch `v1-foundation`, executed against `ARAPAL_RELEASE_CONVERGENCE_PLAN.md`.
Stopped by a genuine external blocker: the account session limit was reached
(the parallel Phase 2A agent terminated with "You've hit your session limit").

### Done, with evidence

| Phase | State | Evidence |
|---|---|---|
| 1 · Regression safety | complete | 52 golden snapshots (26 states x 2 widths); detection proven by flipping a token and seeing a real diff; 12 legacy characterisation tests; 3 known gaps pinned as `test.fixme` |
| 2B · Data/state/persistence | complete | `src/v2/data/*`, 34 unit invariants |
| 3B · Segmentation logic extraction | complete | `src/v2/lib/segmentation.js`, 17 parity tests, ARABIC FIX, one latent defect pinned |
| 3B · Segmentation -> Study handoff | complete | 5 journey tests; the pasted source reaches Study and survives reload |
| 3C · Study wired to the data layer | complete | 9 core-loop journey tests |

**The mission's success measure is now true.** A user writes a translation,
closes the tab, returns, and the work is where they left it — keyed per
(project, segment), so it no longer leaks between segments. Cmd+Enter submits,
empty submissions are refused rather than graded, and stub evaluation output is
labelled wherever it appears.

Totals: 34 data + 17 parity + 26 behaviour/journey + 13 QA calibration, green.
Checker: 668 accepted, no unexplained regressions.

### Later in the same session

- **Phase 2A salvage.** Took only the additive colour tokens (`textMuted`,
  `borderSoft`, `borderStrong`) from the abandoned package. Deliberately left
  the typography snapping (12.5->12, 22->22.5), verified as the cause of +14
  Study regressions. Purely additive: no rendered change.
- **Exam autosave made honest.** The badge was a setTimeout flipping a label and
  writing nothing. Now persists and restores. Fixing it exposed a second defect:
  exam ids were `Math.random()` per load, so a persisted attempt pointed at an
  exam that no longer existed. Ids are now stable. Two pinned gap tests now
  assert the fixed behaviour.

### Second stretch — gates closed

- **Engineering hardening.** Fixed a real crash (`src/App.jsx` used `useRef`
  without importing it, so `?preview=1` threw). Lint scoped so its output is
  readable, 57 -> 48 problems, remainder genuine. Bundle 1,094 -> 912 KB by
  lazy-loading the six dev labs and the dashboard. `npm run qa` now publishes a
  dated feed the quality dashboard reads, so a stale number cannot pass as truth.
- **Integration.** Measured casing, radii and typefaces across every route.
  Found text rendering in system-ui and Arial on live screens; two systemic
  causes — `src/index.css` pointed the document defaults at system-ui, and form
  controls do not inherit `font-family`. Off-family text 17 -> 0. Gated the
  DRAFT/FAIL/PASS controls and the route hash behind `?studyDebug=1`.
  Deliberately did **not** flatten button casing: uppercase is the primary-CTA
  language, applied consistently.
- **Fit.** Reviewing my own Project Home found the widest bug of the session:
  **73 spacing/radius declarations were invalid and doing nothing**, because the
  tokens already carry their unit and were interpolated as `${spacing[24]}px`.
  Fixed by codemod across 15 files.
- **Visual regression is deterministic again** for static routes. Driven states
  assert reachability only — see the note in the spec for why, and what a real
  fix would need.

Checker: 672 -> 445. Behaviour: 31 tests. Data: 34. Acuity: 12. Visual: 54.

### Concrete remaining blockers

0. **Design uplift (Phase 5) not done.** R3 was mined for Home only; Study,
   Segmentation, Research and Exams have not been compared state by state.
1. **Phase 2A · shared primitives — not delivered.** The rail, tokens and
   typography were fixed at their causes, but `Button`/`Card`/`Chip`/`Panel`/
   `Field` were never built, so ~25 button class families remain. The agent hit the
   session limit mid-package. Its work is preserved on the git stash entry
   *phase2a-incomplete-codemods*. **Do not apply as-is:** it traded -85
   violations globally for **+14 new regressions on Study**, verified by
   stashing the concurrent work and re-running. Salvage the token naming
   (`textMuted`, `borderSoft`, `borderStrong`) and the dead `src/styles/`
   deletion; the typography snapping (12.5->12, 22->22.5) caused the overlaps.
2. **Home vertical** — `v2/projectHome` still does not exist. R3 `259:2533`
   and `259:2559` are the source.
3. **Exams on V2** — no V2 route. Legacy Exams remains the only working flow,
   and its attempt state is still lost on reload while the UI shows "AUTOSAVE".
4. **Study behaviour port** — discussion modes, support flyouts and pass/fail
   presentation still live only in `src/components/figma/`, so that directory
   cannot be archived yet.
5. **Segmentation review/success** do not yet read the published segments;
   only paste -> store -> Study is wired.
6. **Phases 5-8** (R3 uplift, Fit pass, visual QA, integration) not started.
7. **The visual-regression suite is not yet reliable enough to be a release
   gate.** Two real causes were found and fixed — storage bleeding between
   states, and capture racing the webfont load — but 3-4 of 52 states still
   flap between runs, and not the same ones each time. The residue is
   concentrated in *driven* states whose layout settles asynchronously
   (`study-draft-typed`, `seg-review-active-edit`): the translation editor
   resizes itself from scrollHeight in an effect, so its height depends on
   when the screenshot fires. Next action: make that editor's height
   deterministic (fixed rows, or resize on a layout effect) rather than
   widening the pixel tolerance — a suite that is trusted while flapping is the
   `auditTrust: 98` failure mode wearing new clothes.

   The **behaviour** suite is stable and is what currently carries the evidence:
   28 journey/characterisation tests plus 34 data invariants, green on repeat.

### Recorded, not acted on

- `tests/audit/dead-code-lane.test.mjs` has 2 failures caused simply by adding
  files to the repo. Root cause: `runDeadCodeLane.ts:160` calls
  `fs.access(process.cwd() + path)`, so a fixture-driven unit test depends on
  the real working tree. Pre-existing tooling fragility, not a product
  regression — it passes at `7b0d917` and fails once new files exist.
- The segmentation paste screen ships with ~168 characters of sample source
  prefilled, so a real user's first action is deleting it. A Fit-pass decision.

---

## 2026-08-16 · Product quality & release readiness audit — complete

`ARAPAL_PRODUCT_QUALITY_AUDIT.md` (evidence in `audit-evidence/`). Audited the running application only; Figma explicitly excluded. No application source modified.

**Verdict: 31/100, do not ship.** 0 of 15 release gates pass. The visual and V2 structural layers are professional and worth protecting; the data/state layer barely exists. Eight P0s, all from three root causes: no data layer or entity flow between screens (S1), core inputs not wired to state (S2), and fabricated evaluation presented as real (S3).

**This supersedes the assumption that the next milestone is Figma Phase C.** Phase C below remains accurate as a record of the Figma work, but the running application — not the design file — is now the critical path. Reconstructing a product in Figma that discards the user's work in the application is not the highest-value next action.

**Next action:** Phase 0 of the audit's plan (stop asserting things that are not true — the false "AUTOSAVE — SAVED" badge, unlabelled fabricated grades, shipped dev scaffolding). Then Phase 1 blockers, built on the V2 spine only.

**Open decision required from the product owner:** is mobile (390 px) in scope for the first release? This determines whether R1 (Study responsive redesign) is P1 or P2.

---

## Current stage

**Figma rebuild, Phase C — Polished version. Desktop complete; mobile and prototype outstanding.**

Figma file: `VwzaUb5YtAonCnMVMRmvmd` — <https://www.figma.com/design/VwzaUb5YtAonCnMVMRmvmd>

Scope reference: `FIGMA-REBUILD-WORKORDER.md`. Defect log: `FIGMA-QA-LOG.md`. Written spec: `FIGMA-SPEC.md`.

---

## Phase A — Restore parity · complete with one exception

All items verified by live screenshot diff except:

- **A4 Project Research was recorded complete but is not.** The Reconstruction frame `37:2` contains only its dark header block; the filter rail, ledger and inspector are absent. The frame is now frozen in that state. There is therefore **no parity baseline for Research** — the polished screen was built from the live capture and `projectResearchData.js` instead. Logged as QA-log `R-01`.

## Phase B — QA sweep · complete, out of order

`FIGMA-QA-LOG.md` did not exist at the start of the 2026-08-07 session. The sweep was performed at the head of Phase C rather than as a separate gated stage, so findings and fixes were produced in the same session. 39 findings: 8 blockers, 22 major, 9 minor. All blockers and majors resolved or consciously accepted with rationale.

## Phase C — Polished version · desktop complete

### C1 · Page structure — done
Pages renamed and ordered `00 · Cover` → `34 · Polished — Exams`. The five Reconstruction pages are frozen: **every top-level frame is locked**.

### C3 · Component library — done
`02 · Components`: 18 variant sets (~180 variants) plus 41 real Lucide icon components. Every fill, stroke, radius and gap bound to a variable. Inventory in `FIGMA-SPEC.md` §3.

### C4 · Screen polish — desktop done

| Screen | Frames built |
|---|---|
| Home | `01 · Resting` |
| Study | `01 · Draft`, `02 · Submitted · Pass` |
| Segmentation | `01 · Paste`, `02 · Review` |
| Research | `01 · Segment selected` |
| Exams | `01 · Library` |

### C5 · Motion — specified, not playable
Tokens documented and sequences described in `FIGMA-SPEC.md` §2.6. No prototype connections set. Figma cannot bind prototype easing/duration to variables, so connections must be matched by eye.

### C6 · Specification — done
`FIGMA-SPEC.md`.

---

## Next milestone

**Complete Phase C.** In priority order:

1. **Mobile counterparts (C2b)** — 390 × 844 for every polished screen. The four-pane Study workspace is the hard case; decide and document how segments, source, editor and support coexist on a phone. The 51 px rail cannot survive as-is.
2. **Prototype wiring (C2c)** — Home → Study → Segmentation → Success → Study, plus Research and Exams entry points, desktop and mobile. Smart Animate where elements persist. Durations set by eye to the motion tokens.
3. **Remaining states** — listed per screen in `FIGMA-SPEC.md` §4. Highest value first: Study `Submitted · Fail` and `Discuss floating`; Research `No selection` and `No results`; Segmentation `Loading` / `Transition` / `Success`; Home and Exams empty states.

## Reference artifacts

- **`screenshot-reference/`** (2026-08-14) — a 30-shot, representative-depth screenshot set of the **legacy** app (`#home #study #segmentation #exams #projects`), built for handing to another AI as a functionality reference. Captured via `scripts/capture-reference.mjs` (Playwright) at the canonical 1440×900 viewport with dev chrome hidden (`?chrome=0`). Indexed in `screenshot-reference/manifest.md`. Not a Figma parity source — it postdates the 2026-08-06 captures used for Phase A/C and reflects current `src/screens/` behaviour more faithfully than `artifacts/ui-snapshots`.

## Known gaps carried forward

- **No live re-capture since 2026-08-06.** The Phase C sweep used the existing `artifacts/` captures. If the app has moved, findings drawn from them may be stale — re-capture before the next parity claim.
- **Reconstruction Research is frozen incomplete** (see Phase A above).
- **Contrast ratios are computed, not measured.** No automated audit has been run against the built frames.
- **Sub-44 px icon buttons are retained** for desktop density. Build must give Md (36) and Sm (28) a 44 px hit area — a build requirement, recorded in `FIGMA-SPEC.md` §5, not enforced by the visual box.
- **Segmentation motion keyframes were not re-derived** from `src/v2/foundation/tokens/segmentationFlow.ts`. Do this when wiring the prototype.

## Plugin API traps found in this build

Recorded in `FIGMA-SPEC.md` §3.2. The two that cost the most time:

- `resize()` after setting `layoutSizing* = 'FILL'` silently reverts the node to FIXED.
- `setBoundVariableForPaint()` returns a paint whose literal colour is black with the alias attached; component nodes resolve it, **instance children render black.** Seed the paint with the variable's resolved RGB.

## 2026-08-17 · RESOLVED: review toolbar reachability on short frames

Fixed, not accepted. The 5 `control-unreachable` findings are ratcheted to 0 and
the production surface is 0 **with vertical reachability enforced**.

The palette is now `position: fixed` in the reserved gutter, bounded by
`reviewToolbarViewportReserve`. Sticky could not work: it lives in the document
flow, so at rest its band began after the intro and source tray — about 314px on
a 768-tall frame for 570px of tools — and no height cap fixes a bad starting
point. Fixed makes the band the viewport, identical scrolled or not.

One recorded compromise: `right` uses the page's own inline inset rather than
re-deriving the content box. Re-deriving would mean restating the shell's rail
width and centring cap in a second place, and duplicated shell arithmetic is what
put this toolbar on the content originally. Below ~1460px this lands exactly
where the in-flow version did; above it the toolbar sits further into the margin
than the content. Verified as no overlap at 1920×1080, so it is a cosmetic
detachment at one validation frame, not a collision.

### Superseded diagnosis (kept for the reasoning)

**Tracked debt, not hidden:** 5 `control-unreachable` findings on
`v2-segmentationReview` at 1366×768 and 1280×800, recorded in
`artifacts/qa/baseline.json`. They are pre-existing defects newly made visible
by a new rule, not regressions.

**What is wrong.** The docked tool palette holds 11 controls in one vertical
stack. Its region sits third in the stage stack, so at rest it begins ~378px
down; on a 768/800-tall frame the lower controls (`Advanced edit`, `Remove`,
`Float toolbar`) fall past the fold. Because the region is `position: sticky`
it travels with the viewport, so scrolling never brings them back.

**Already fixed in this pass.** The region was `height: 0`, so the toolbar
overflowed downward from wherever the anchor landed and sat 84px on top of the
Approve bar. It now has a real band bounded by
`reviewToolbarViewportReserve`, which removed all the overlap findings
(production surface 18 → 5).

**What remains is a composition decision, not another CSS pass.** At its
resting offset a short frame can show about seven controls. Options, in the
order I would consider them:

1. Move the toolbar region to the top of the stage stack so it gets the whole
   band at rest, rather than starting below the intro and source tray.
2. Group the tools so only the primary set is always visible, with the rest
   behind a disclosure — the palette currently shows every tool unconditionally.
3. Let it wrap to two columns on short frames.

Option 1 is the smallest change and probably correct; it needs a rendered
review at all four frames because it alters document order.

**Why the standard missed this until now.** `viewport-escape` is titled
"Element sits outside the frame" and only ever measured the horizontal axis —
`Math.max(r.right - innerWidth, -r.left)`, with nothing looking at the bottom
edge. A control could sit entirely below the fold and the checker reported the
surface clean. That is now `control-unreachable`, which asks the reachability
question rather than the geometry one: a control outside the frame whose
ancestor is sticky or fixed cannot be scrolled to.
