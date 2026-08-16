# Arapal — Product Quality & Release Readiness Audit

**Date:** 2026-08-16
**System under test:** the running application at `http://localhost:5173` (Vite dev server, commit `7b0d917`)
**Method:** browser-first. Every finding below was produced by driving the running app — 26 routes × 4 viewports of instrumented capture, four scripted end-to-end journeys, and live DOM measurement — before any source was read. Source was consulted only afterwards, to explain causes.
**Explicitly excluded:** Figma was not opened. No prior redesign proposal was used as a standard. No application code was modified.
**Evidence pack:** `audit-evidence/` (22 screenshots, referenced by ID below).

---

## SECTION 1 — Executive judgement

### Overall release readiness: **31 / 100**

### Can we ship now? **NO.**

Not "no, after a bug-fix sprint". Arapal today is an **exceptionally well-crafted interactive prototype**, not a product. The screens are real, the flows are navigable end to end, and the visual work is genuinely good. But the four things that make software a product — that it keeps your work, that it acts on your input, that it tells you the truth, and that it works on your device — are absent or simulated.

### Top 5 reasons

1. **The core input is not wired.** The translation editor on the flagship Study screen is an uncontrolled `<textarea>` with no `value`, no `onChange` and no `ref` (`src/components/figma/CenterPanel.jsx:2362`). Nothing reads what the user types. Submitting an empty box produces a full graded result.
2. **The app fabricates evaluation.** Pass/fail is a hard-coded property per segment (`defaultOutcome: 'failed-first'`), and exam scoring is a character-count heuristic plus hard-coded question indices (`src/screens/ExamsScreen.jsx:1290`). Verified live: an empty translation returned *"Needs Revision"*, then *"Submitted — Grade 8.4 · Reviewed: 15 Mar 2026 · Model evaluation with a scholar-…"* (E18). Presenting a grade and a review date for work the user never wrote is the most serious issue in this audit.
3. **Work is silently destroyed at the seams.** Segmentation output is discarded on handoff — `onStartStudying` is literally `() => window.location.hash = 'study'` (`MakeSegmentationFlowScreen.jsx:5889`). Verified live: segmenting a source containing `AUDITMARKER…` and clicking "Start studying" lands on the stock demo project (E16 → E17). Separately, the exam attempt screen displays an **"AUTOSAVE — SAVED"** badge while persisting nothing; a page reload loses the entire attempt (E19).
4. **There is no responsive design.** At 390 × 844 the Study workspace renders the icon rail, the segment tree and a sliver of the support panel — the source text, the editor and Submit are **entirely off-screen** (E04, E09). Home renders its hero on top of its own cards (E05). At 1024 × 768 the Study header collapses into a three-way collision (E03).
5. **There is no product test coverage and no regression net.** `tests/ui-snapshots.spec.js` takes screenshots and asserts nothing. The 28 tests under `tests/audit/` test the audit tooling, not the app. Zero unit, integration or e2e coverage of any user journey. No visual-regression baseline. No `ErrorBoundary` anywhere in `src/`.

### Biggest strengths — real, and worth protecting

- **The V2 Project Research workspace is the best screen in the product** and, on evidence, the only fully honest one. Ledger + inspector + filters, English *and* Arabic search both filter correctly, a real no-results state, a real no-selection state, and "Open in study" navigates to the correct segment (verified: selected 1.3 → Study opened 1.3). (E10)
- **The exam → study remediation handoff is properly engineered.** `handleJumpToStudy` writes `{segmentId, examTitle, concept, reason}` to `sessionStorage`; Study reads it, jumps to that segment and renders a dismissible context banner. This is the one place the app treats cross-screen context as a first-class concern — and it is the pattern the rest of the app needs.
- **The segmentation wizard is a genuinely good piece of interaction design and it actually works.** Disabled-until-valid CTA, hidden-but-discoverable options, two staged transition screens with a "Skip" and an "Always skip" preference persisted to `localStorage`, a review step that reflects the user's real pasted text, and a success screen with two clear exits. Journey A completed end to end without intervention.
- **The visual craft is high.** Display-serif/sans pairing, restrained palette, confident hero composition, well-judged card and stat-tile work. Projects (E06), Exams (E07) and Research (E10) would survive a design review on composition alone.
- **V2's architectural spine is sound.** Route registry, per-screen layout contracts, a real token set (`src/v2/foundation/tokens/`), a competent hand-rolled query hook with cache/loading/error/refetch, and a five-lane static audit harness. Every V2 route fits 1440 × 900 exactly with no page scroll — that discipline is visible and deliberate.

### Biggest systemic risks

- **The product is two applications in one repository with no bridge.** Legacy (`#home #study #segmentation #exams #projects`) holds the behaviour; V2 (`#v2/*`) holds the foundations. Neither links to the other: `grep` for `v2/` across `src/screens/` and `src/components/` returns nothing. Every future change costs double, and every fix must be decided twice.
- **The design system exists but is not adopted where it matters.** 198 distinct hex colours in 978 occurrences across `.jsx`/`.js`; two parallel greyscales (Tailwind `slate` and `gray`) mixed in the same product; roughly 25 button class families with at least five independent primary-button implementations. The project's own static audit reports **859 findings** (418 colour, 308 typography, 82 spacing) — and it only scans the 88-file V2 scope, excluding the legacy screens that are the worst offenders.
- **Typography is unspecified in production.** `document.fonts` on the running app resolves to exactly one loaded family: **Playfair Display**. `Inter` and `Amiri` are declared throughout the CSS but never loaded — `src/styles/fonts.css` (which does import them) is not imported by anything, and Tailwind is referenced there but is not a dependency. All Latin body text and all Arabic text currently render in whatever the host OS happens to substitute.
- **All CSS lives in runtime-injected template literals.** 18 files carry `const …Styles = \`…\``; the Segmentation screen injects **101 KB of CSS into a `<style>` tag at mount**. The production build emits a 9 KB stylesheet and a **1.20 MB single JS chunk** (258 KB gzip) containing both applications and all six developer labs.
- **Developer scaffolding is on the product surface.** `DRAFT / FAIL / PASS` buttons in the Study header and in the keyboard tab order; `#V2/PROJECTRESEARCH`-style route strings in V2 headers; `v2/appLaunch` — the **default V2 route** — is a build-instruction page reading *"Approve the shared generic families on the review boards before rebuilding more product screens"* (E13); `v2/projectHome`, a route the V2 rail links to, is an empty placeholder captioned *"V2 SCAFFOLD"* (E14).

### Are the foundations good enough? Is this professional or haphazard?

**Both, in clearly separable layers — and that is the most useful thing this audit can tell you.**

- The **visual and interaction design layer is professional**. It is coherent, deliberate and above the bar for a consumer product. It was not thrown together.
- The **V2 structural layer is professional**. Contracts, tokens, route registry, audit lanes, fixed-viewport discipline. Someone thought hard about how to build this properly.
- The **legacy implementation layer is haphazard and load-bearing**. A 5,947-line screen file, a 3,164-line primitives file, a 2,721-line panel, absolute positioning with hard-coded pixel offsets (`.fg-center__headerActions { position: absolute; left: 392px; width: 360px }` — the direct cause of the title collision in E02), 42 ESLint errors on a clean checkout, and no shared primitives. And this is the half that contains the working behaviour.
- The **data and state layer barely exists**. It is the layer a product needs most and the one that has received least.

The foundations are good enough to build on. The V2 spine is the right spine. What has not happened is the migration of behaviour onto it — and the behaviour that exists was never wired to real data.

---

## SECTION 2 — Quality scorecard

| # | Dimension | Score | Evidence |
|---|---|:---:|---|
| A | **Product completeness** | **2** / 5 | Journeys A and D complete navigationally; C completes genuinely. But the primary job (translate → be assessed) cannot be truthfully completed: editor unwired, grading scripted, segmentation output discarded. Research — the strongest screen — is not in any navigation. |
| B | **Task UX** | **3** / 5 | Strong: 3-step segmentation stepper, "One clear next step" framing, exam results panel with grouped misses and per-item "Jump to study". Weak: options hidden behind one unlabelled chevron; ~230 px of dead space between source and editor in Study (E02); no route back into an in-progress exam attempt; four different navigation systems. |
| C | **Visual quality** | **4** / 5 | Genuinely good composition, hierarchy and restraint (E06, E07, E10). Deductions: `.fg-center__status` overlaps the `h1` by 125 × 21 px (E02); the "Arapal" watermark sits over the Exams `h1` across 445 × 68 px (E07); Home card 3's title sits 7 px and its meta 14 px above its neighbours in an equal-height row. |
| D | **Design-system consistency** | **2** / 5 | Tokens exist and are imported by 24 files — all V2. 198 distinct hex values / 978 occurrences; two greyscales; ~25 button families; `CREATE EXAM` (uppercase) beside `Review results` (sentence case) in one card. Project's own audit: 859 findings. |
| E | **Layout robustness** | **1** / 5 | Mobile is non-functional (E04, E05, E09). 1024 collapses (E03). Source text hides 373 of 613 px behind a scroller with no affordance. Segmentation Review's toolbar covers 30 px of every right-column card (E11, measured). 24 ad-hoc breakpoints, no scale. |
| F | **Interaction & motion** | **3** / 5 | 146 `:hover` rules; considered transitions; skippable segmentation animation with a persisted preference; three independent collapse mechanisms in Study; dockable/floating Discuss panel. But 14 `:focus-visible`, 6 `:active`, and **1** `prefers-reduced-motion` rule in the entire codebase. |
| G | **Accessibility** | **1** / 5 | `#94a3b8` at 9.5 px = **2.6:1** on 13 of 19 routes. Legacy Home and Study have `main:0, nav:0, header:0` — no landmarks. Both core inputs (translation editor, source paste box) have no accessible name. "Collapse segments" is a **16 × 16 px** target. Home has four `h2` and no `h1`. "⌘ Enter to submit" is displayed but not implemented (verified live). |
| H | **Arabic / RTL quality** | **2** / 5 | Good: `dir="rtl" lang="ar"` on Arabic runs in Study and Research; Arabic search filters correctly. Bad: the **source intake textarea is `dir: ltr` in Inter with no `dir` attribute** — Arabic pastes in left-aligned (screenshot, live); Amiri is declared but never loaded; the sentence splitter `/[^.!?]+/` ignores `؟` and `،`; `projects-screen__sourceText` renders mixed Arabic/Latin in an unmarked LTR run; no RTL mode for the UI itself. |
| I | **Engineering quality** | **2** / 5 | Two parallel apps; 5,947-line file; all CSS in template literals; 42 ESLint errors (13 `no-unused-vars`, 8 `react-hooks/set-state-in-effect`, 5 `exhaustive-deps`); no `ErrorBoundary`; `src/styles/` and `src/index.css:root` are dead config. Offset by V2's contracts, registry, tokens and `useServerQuery`. |
| J | **Reliability** | **1** / 5 | Exam attempt shows "AUTOSAVE — SAVED" and loses everything on reload (verified live). Translation drafts never persisted. No error boundary. One `status === 'error'` branch in the entire app. |
| K | **Data / state integrity** | **1** / 5 | Draft written on segment 1.3 is still in the editor after switching to 1.4 — **in both legacy and V2** (verified live). Segmentation output discarded. Grades fabricated. A 3-question exam produced a results panel counting 3 misses + 1 worth-reviewing + 0 strong = 4 items (E20). Study segment 1.3 "Ghusl" displays Jumu'ah source text and Jumu'ah guidance. |
| L | **Performance** | **3** / 5 | Nothing measured as slow: DCL ≈ 98 ms on every screen, ≤ 771 DOM nodes. Risk is architectural: 1.20 MB single chunk with no code-splitting (both apps + six labs ship to every user); 101 KB of CSS injected at runtime on one screen; fonts `@import`ed from Google inside runtime `<style>` tags. |
| M | **Testing & observability** | **1** / 5 | No product tests of any kind. `ui-snapshots.spec.js` contains no assertion. No visual-regression baseline. No logging or error reporting. The five audit lanes are real infrastructure but are pointed at code doctrine, not behaviour. |
| N | **Production readiness** | **1** / 5 | Fails on integrity, reliability, responsive, accessibility and test coverage simultaneously. |

**Total: 27 / 70.** Weighted for release risk (integrity and reliability weigh heaviest): **31 / 100**.

---

## SECTION 3 — Critical journey matrix

| Journey | Completion | Friction | Reliability | Responsive | A11y | Key issues | Release status |
|---|---|---|---|---|---|---|---|
| **A — Home → intake → segmentation → review → publish → study** | Navigationally **complete**; functionally **broken at the last hop** | Low. Genuinely well-staged | **Fails** — output discarded | Fails < 1200 px | Paste box unnamed and LTR | Segmentation result never reaches Study (E16→E17). Arabic pastes left-aligned. Review's approve step is real and good | **BLOCKED (P0)** |
| **B — Study loop: draft → submit → result → next segment → return** | Completes | Medium. ~230 px dead band; source 39 % visible | **Partial** — submission state and current segment persist (`localStorage`); **draft text never does** | Fails at 390 (editor off-screen) and degrades at 1024 | Editor unnamed; ⌘Enter advertised, absent; debug buttons in tab order | Draft bleeds across segments. Result is scripted, not derived. Header collision (E02, E03) | **BLOCKED (P0)** |
| **C — Research → find → inspect → open in Study** | **Completes correctly** | Low | Good within session | Degrades at 1024 (E21), fails at 390 | Row buttons are real `<button>`s; search input unnamed | Only gap: Study shows no provenance that you arrived from Research. Screen is unreachable from any navigation | **CONDITIONAL PASS — protect this** |
| **D — Exams: library → builder → scope → attempt → results → remediation** | Completes | Low. Best-in-app results panel (E20) | **Fails** — false "SAVED" badge; attempt lost on reload; no resume path from the library | Fails at 390 (E22); page scrolls to 1092 px at 1440 | Uppercase/sentence-case button mix; sticky header covers the results `h1` | Score is a length heuristic. Item counts inconsistent. **Remediation → Study context handoff is correct and should be preserved** | **BLOCKED (P1)** |

---

## SECTION 4 — What to protect (KEEP)

Future design or AI work must not casually replace these. They are the parts that already work.

| # | Keep | Why | Where |
|---|---|---|---|
| K1 | **Project Research workspace — whole screen** | Only screen where search, filtering, selection, empty states and cross-screen navigation are all genuinely implemented. Its ledger/inspector split is the right model for the product | `src/v2/screens/ProjectResearch/` |
| K2 | **Exam → Study context handoff** | The correct pattern for every cross-screen transition in the app. Structured payload, target segment, dismissible provenance banner | `ExamsScreen.jsx:1529`, `FigmaScreen.jsx:205,405` |
| K3 | **Segmentation wizard staging** | Disabled-until-valid CTA, options popover, two transition screens, skip + persisted "always skip", review-then-approve. The interaction design is finished work | `MakeSegmentationFlowScreen.jsx` |
| K4 | **Exam attempt and results screens** | Question rail, progress/elapsed/scope panel, misses grouped by concept *or* segment with per-item "Jump to study". Strong information design | `ExamsScreen.jsx`, E19/E20 |
| K5 | **V2 route registry + layout contracts + shell** | The right architecture. Every V2 route fits 1440×900 with no page scroll — that discipline is the reason V2 has none of legacy's overflow defects | `src/v2/app/routeRegistry.ts`, `src/v2/foundation/layout/` |
| K6 | **The token set** | `colors / typography / spacing / radius / elevation / motion / controlSizing`. Complete and well-factored. The problem is adoption, not design | `src/v2/foundation/tokens/` |
| K7 | **`useServerQuery`** | Cache, loading/error/success, refetch, optimistic update. Correct seed for a real data layer | `src/v2/screens/Projects/useServerQuery.js` |
| K8 | **The visual language** | Playfair display + sans body, restrained blue accent, card and stat-tile system, hero composition. Do not restyle this; fix its *implementation* | Across all screens |
| K9 | **Study's three independent collapse mechanisms** | Nav rail, segment tree and support rail collapse independently, with hover-preview flyouts from the collapsed support rail. Sophisticated and appropriate for a dense workspace | `FigmaScreen.jsx`, `RightPanel.jsx` |
| K10 | **The audit-lane harness** | Five lanes, fixtures, 28 tests. Real regression infrastructure — it just needs to be pointed at behaviour as well as doctrine | `src/v2/audit/`, `tests/audit/` |

---

## SECTION 5 — Systemic root causes

Seven root causes account for the large majority of everything found. Fix these and most of Section 6 resolves as a side effect.

### S1 · There is no data layer, and no entity flows between screens — **P0**

**Root cause.** Every screen owns a module-level hard-coded constant (`segmentNodes` in both `FigmaScreen.jsx:60` and `StudyWorkspaceScreen.jsx:23`; `projectResearchData.js`; `studyDashboardData.js`; the exam list). There is no project, source, segment or attempt entity. Navigation is `window.location.hash = '…'` with no payload — 8 call sites.

**Affected components.** All 5 legacy screens, all 8 V2 product screens.
**Affected screens.** Every one.
**User impact.** Work is destroyed at every screen boundary. The user segments a text and studies a different text. Nothing they produce is retrievable.
**Engineering impact.** Nothing above the component can be tested. Every screen re-solves state independently.
**Correct fix location.** A single project/segment store plus a typed navigation function that carries context — generalising the pattern that **already exists and works** in `handleJumpToStudy` (K2).
**Priority: P0.**

### S2 · Core inputs are not wired to state — **P0**

**Root cause.** `CenterPanel.jsx:2362` renders `<textarea className="fg-center__textarea" placeholder="…" />` with no `value`, `onChange` or `ref`. V2's `StudyWorkspacePrimitives.jsx:2323` is better (`useState('')`) but the draft is local to the editor component and not keyed by segment, so it survives segment changes.

**Affected components.** `CenterPanel`, `StudyWorkspacePrimitives`, `EditorSurface`.
**Affected screens.** Study (legacy), Study Workspace (V2).
**User impact.** Verified live: text typed for segment 1.3 is still present after switching to 1.4 — **in both apps**. Nothing is ever saved. Submit ignores the field entirely.
**Correct fix location.** Lift draft state to the segment record; key by `segmentId`; persist with the existing `STORAGE_KEY` payload, which already round-trips correctly for submission state.
**Priority: P0.**

### S3 · The app fabricates evaluation it did not perform — **P0**

**Root cause.** Two hard-coded scripts. Study: `handleSubmit` reads `currentSegment.defaultOutcome` and attempt count only (`FigmaScreen.jsx:313`). Exams: `outcome` is `'miss'` if the answer is under 40 characters, `'review'` under 85, plus unconditional `index === 2 || index === 5 → miss` (`ExamsScreen.jsx:1290`).

**Affected screens.** Study, Study Workspace, Exams.
**User impact.** Verified live (E18): an empty translation returned "Needs Revision", then "Submitted", with **"Grade 8.4 · Reviewed: 15 Mar 2026 · Model evaluation with a scholar-…"**. Segment 1.4 passes an empty submission on the first attempt. A user cannot distinguish real feedback from theatre.
**Engineering impact.** The feedback UI — grade cards, strengths, "why it failed", "best in class" reference translation — is fully built against a data shape no evaluator produces.
**Correct fix location.** One evaluation boundary (`evaluateTranslation(source, draft) → result`) behind a real service. **Until it exists, every fabricated artefact must be visibly labelled as sample data.** This is a truthfulness requirement, not a feature request.
**Priority: P0.**

### S4 · There is no responsive layout architecture — **P1**

**Root cause.** Fixed multi-column shells with pixel widths chosen by viewport *density buckets* rather than a layout system (`FigmaScreen.jsx:241` — `compact / standard / wide`, each returning three hard-coded pixel widths). 24 distinct `@media` breakpoints across the codebase (1500, 1480, 1380, 1280, 1180, 1100, 980, 900, 640…), no scale, essentially nothing below 640.

**Affected screens.** All.
**User impact.** At 390 px the Study centre column — source, editor, Submit — is entirely off-screen (E04, E09); Home renders its hero on top of its cards (E05). At 1024 px the Study header produces a three-element collision (E03).
**Correct fix location.** One breakpoint scale + a shared workspace layout primitive that can reflow columns into a stacked/tabbed arrangement. V2's `createScreenLayoutContract` is the right place.
**Priority: P1** (P0 if mobile is in scope for launch — **this needs a product decision**).

### S5 · Absolute positioning and fixed pixel offsets are used to solve flex-layout problems — **P1**

**Root cause.** `.fg-center__headerActions { position: absolute; left: 392px; width: 360px }`. Taken out of flow, it cannot participate in the parent's `justify-content: space-between`, so the `h1` has nothing to shrink against.

**Blast radius — measured, same defect class, four screens.**
- Study header: `.fg-center__status` (708–844) overlaps `h1` (312–833) by 125 × 21 px at 1440; at 1024 the pill wraps and `DRAFT/FAIL/PASS` and the "Copy" button join the pile-up (E02, E03).
- Segmentation Review: the segment toolbar occupies x 1340–1380 while segment cards run to x 1371 — **30 px of every right-column card's Arabic text and its status badge are covered** (E11, measured live).
- V2 Projects: `study-dashboard__historyHeader` sits at x 1449–1887 — 447 px past a 1440 px viewport.
- Legacy Study centre column: `bottom: 919` in a 900 px viewport.

**Correct fix location.** Delete the absolute positioning; make the header a real flex row with `min-width: 0` on the title lane and a reserved actions lane. Give the Segmentation Review toolbar its own grid column.
**Priority: P1.**

### S6 · No shared control primitives — the design system is bypassed — **P1**

**Root cause.** No `Button`, `Card`, `Chip`, `Panel` or `Field` component exists. Each screen defines its own classes inside a CSS template literal. ~25 button class families; at least five independent primary buttons (`make-seg__primaryButton` ×31, `exams-screen__primaryButton` ×17, `v2-seg-paste__primaryButton` ×15, `fg-center__primaryButton` ×9, `projects-screen__button` ×7).

**Blast radius.** 198 distinct hex colours in 978 occurrences; two greyscales in the same product (`#64748b` ×53 alongside `#6b7280` ×16; `#0f172a` ×60 alongside `#111827` ×14). Casing drift on one card: `OPEN EXAM` next to `Review results` next to `New`. Interaction-state drift: 146 `:hover` rules but only 14 `:focus-visible` and 6 `:active`. The project's own static lane reports **859 findings** over the V2 scope alone.

**Correct fix location.** Build the primitives against the existing tokens; migrate screen by screen. Do **not** restyle — the visual language is good; only its implementation is duplicated.
**Priority: P1.**

### S7 · Accessibility was never in the build loop — **P1**

**Root cause.** No semantic baseline. Legacy Home and Study report `main: 0, nav: 0, header: 0, list: 0`. The colour ramp bottoms out at `#94a3b8`, which is 2.6:1 on white and is used at 9.5 px on 13 of 19 routes. Icon controls were sized visually: 16 × 16 ("Collapse segments"), 28 × 28 (Bold, Italic, Align, Pin, Expand rail).

**Affected screens.** All; legacy worst.
**User impact.** The product's smallest text is also its palest. Both core inputs are unlabelled. Keyboard users reach `DRAFT / FAIL / PASS` debug buttons before the primary action. "⌘ Enter to submit" is displayed but does nothing (verified live). One `prefers-reduced-motion` rule guards an app full of motion.
**Correct fix location.** Retune the ramp at token level; set a minimum type size; enforce a 44 px hit area on the shared icon-button primitive from S6; add landmarks and labels per screen; add a lint/CI gate.
**Priority: P1.**

---

## SECTION 6 — Master findings

Priorities: **P0** core workflow broken or integrity issue · **P1** release-quality · **P2** meaningful · **P3** polish.

| ID | Area | State | Finding | Evidence | Type | Class | Pri | Root cause | Blast radius | Recommended action |
|---|---|---|---|---|---|---|:--:|---|---|---|
| F01 | Study | Draft | Translation `<textarea>` has no `value`/`onChange`/`ref`; nothing reads user input | `CenterPanel.jsx:2362`; live: submit with empty box succeeds | DEFECT | SYSTEM FIX | P0 | S2 | Study + V2 Study | Wire to segment-keyed draft state |
| F02 | Study | Segment switch | Draft written on 1.3 remains in the editor on 1.4 — work attributed to wrong segment | Live, both apps | DEFECT / STATE | SYSTEM FIX | P0 | S2 | Study + V2 Study | Key draft by `segmentId`; clear/restore on change |
| F03 | Study | Submitted | Outcome is `defaultOutcome` + attempt count; content never read | `FigmaScreen.jsx:313`; E18 | DEFECT / INTEGRITY | SYSTEM FIX | P0 | S3 | Study + V2 Study | Real evaluation boundary; label sample data until then |
| F04 | Study | Pass | Grade "8.4", review date and reference translation shown for an empty submission | E18 (live) | DEFECT / INTEGRITY | SYSTEM FIX | P0 | S3 | Study + V2 Study | Suppress or visibly mark fabricated feedback |
| F05 | Segmentation → Study | Success | Approved segmentation output is discarded; Study opens the stock demo project | `MakeSegmentationFlowScreen.jsx:5889`; E16 → E17 | DEFECT / STATE | SYSTEM FIX | P0 | S1 | Journey A | Carry project/segment context, as `handleJumpToStudy` already does |
| F06 | Exams | Attempt | "AUTOSAVE — SAVED" badge displayed; attempt state is React-only and lost on reload | E19; live reload → library, answers gone | DEFECT / RELIABILITY | LOCAL FIX | P0 | — | Exams | Persist attempts, or remove the false badge immediately |
| F07 | Exams | Library | No route back into an in-progress attempt from the library | Journey D9 (live) | DEFECT | LOCAL FIX | P1 | — | Exams | Add "Resume attempt" |
| F08 | Exams | Results | Score is a character-count heuristic plus hard-coded miss indices | `ExamsScreen.jsx:1290` | DEFECT / INTEGRITY | SYSTEM FIX | P0 | S3 | Exams | Real scoring, or label as sample |
| F09 | Exams | Results | 3-question exam reports 3 misses + 1 worth-reviewing + 0 strong = 4 items | E20 | DEFECT | LOCAL FIX | P1 | S3 | Exams | Reconcile counts to question set |
| F10 | Study | All | `.fg-center__status` overlaps `h1` by 125 × 21 px at 1440; worse at 1024 | E02, E03; measured | DEFECT | SYSTEM FIX | P1 | S5 | 4 screens | Remove `position:absolute; left:392px`; real flex header |
| F11 | Segmentation Review | Review | Segment toolbar covers 30 px of every right-column card's Arabic text and badge | E11; toolbar 1340–1380 vs cards →1371 | DEFECT | LOCAL FIX | P1 | S5 | Seg Review | Give the toolbar its own grid column |
| F12 | Study | All | Source text: 373 of 613 px hidden in a scroller with no scrollbar, fade or affordance; text cut mid-glyph | E02; measured | USABILITY | LOCAL FIX | P1 | — | Study, V2 Study | Size to content or add a visible scroll affordance |
| F13 | All | 390 px | Study centre column (source, editor, Submit) entirely off-screen; Home hero overlays its own cards | E04, E05, E09, E22 | DEFECT | REDESIGN | P1 | S4 | All screens | See Section 7 |
| F14 | All | 1024 px | Header collisions and control pile-ups | E03, E21 | DEFECT | SYSTEM FIX | P1 | S4, S5 | All screens | Breakpoint scale + flex headers |
| F15 | Intake | Paste | Source textarea is `dir:ltr`, Inter, no `dir` attribute — Arabic pastes left-aligned in a Latin font | Live screenshot; computed style | DEFECT / RTL | LOCAL FIX | P1 | — | Intake (product entry point) | `dir="auto"`, Arabic face, RTL alignment |
| F16 | Global | All | `Inter` and `Amiri` declared throughout but never loaded — only Playfair Display loads | `document.fonts` → `["Playfair Display"]`; `src/styles/fonts.css` unimported | DEFECT | SYSTEM FIX | P1 | S6 | Every screen | Self-host and load the real faces; delete dead `src/styles/` |
| F17 | Global | All | `#94a3b8` at 9.5 px = **2.6:1**, on 13 of 19 routes | Probe, 1440 | ACCESSIBILITY | SYSTEM FIX | P1 | S7 | Every screen | Retune ramp; raise minimum type size |
| F18 | Global | All | Text at 9.5 px (19 routes) and 10 px (13 routes) | Probe | ACCESSIBILITY | SYSTEM FIX | P1 | S7 | Every screen | Floor at 12 px |
| F19 | Study, Intake | All | Translation editor and source paste box have no accessible name | Probe | ACCESSIBILITY | LOCAL FIX | P1 | S7 | 2 screens | Add labels |
| F20 | Study | All | "Collapse segments" is 16 × 16 px; 6 further controls at 28 × 28 | Probe | ACCESSIBILITY | SYSTEM FIX | P1 | S7 | Study, Discuss panel | 44 px hit area on shared icon-button |
| F21 | Legacy | All | Home and Study report `main:0, nav:0, header:0, list:0` | Probe | ACCESSIBILITY | SYSTEM FIX | P1 | S7 | Legacy screens | Add landmarks; segment tree and lists as `ul`/`li` |
| F22 | Home | All | Four `h2`, no `h1`; Projects places `h2` before `h1` | Probe | ACCESSIBILITY | LOCAL FIX | P2 | S7 | 2 screens | Fix heading order |
| F23 | Study | All | "⌘ Enter to submit" displayed; no handler exists | Live keydown test | DEFECT | LOCAL FIX | P2 | — | Study, V2 Study | Implement or remove |
| F24 | Study | All | `DRAFT / FAIL / PASS` debug buttons ship in the header and the tab order | E02; focus trail | ENG RISK | LOCAL FIX | P1 | — | Study | Gate behind a dev flag |
| F25 | Legacy | Default URL | Dev screen-switcher pill covers the app's own header buttons (Replay intro / Projects → / Segmentation →) at the default URL | Measured: pill 937–1580 over buttons 1032–1416 | DEFECT | LOCAL FIX | P1 | — | Home | Gate behind a dev flag |
| F26 | V2 | Default route | `v2/appLaunch` — the default V2 route — is a build-instruction page | E13 | PRODUCT GAP | LOCAL FIX | P1 | — | V2 entry | Repoint default; move to a lab route |
| F27 | V2 | projectHome | A rail destination is an empty "V2 SCAFFOLD" placeholder | E14 | MISSING | MISSING | P1 | — | V2 rail | Build or remove from the rail |
| F28 | V2 | All | Route string (`#V2/PROJECTRESEARCH`) rendered in the product header | E10, E12 | CONSISTENCY | LOCAL FIX | P2 | — | All V2 routes | Gate behind a dev flag |
| F29 | Research | All | Best screen in the product is in no navigation; reachable only by typing the hash | `routeRegistry.ts` — `projectResearch` has `rail.visible: false` | PRODUCT GAP | LOCAL FIX | P1 | — | V2 rail | Add to the rail |
| F30 | Research → Study | Handoff | Study shows no provenance that the user arrived from Research | Journey C9 | USABILITY | LOCAL FIX | P2 | S1 | 2 screens | Reuse the exam-context banner |
| F31 | Global | All | Legacy and V2 never link to each other | `grep 'v2/' src/screens src/components` → 0 | ENG RISK | REDESIGN | P1 | — | Whole product | See Section 7 |
| F32 | Global | Error | No `ErrorBoundary`; one `status === 'error'` branch in the app | grep | RELIABILITY | SYSTEM FIX | P1 | — | Whole app | Add boundaries + a recoverable error surface |
| F33 | Global | Routing | Unknown `#v2/*` silently renders appLaunch; unknown legacy hash silently renders Study | Journey I3, I4 | MISSING | MISSING | P2 | — | Routing | Add a not-found state |
| F34 | Exams | Results | Sticky header covers the results `h1` at scroll 0 | E20 | DEFECT | LOCAL FIX | P2 | S5 | Exams | Add scroll padding |
| F35 | Home | Resting | Card 3's title 7 px and meta 14 px above its neighbours in an equal-height row | Measured live | DEFECT | SYSTEM FIX | P2 | S6 | Card family | Pin title and meta rails |
| F36 | Study | All | ~230 px of empty space between Quick Lexicography and the Translation card | E02 | USABILITY | LOCAL FIX | P2 | — | Study | Rebalance; give the space to source |
| F37 | Exams, Projects | All | `CREATE EXAM` / `OPEN EXAM` uppercase beside `Review results` / `New` sentence case | E07 | CONSISTENCY | SYSTEM FIX | P2 | S6 | Every screen | One casing rule in the Button primitive |
| F38 | Global | All | "Arapal" watermark overlays live text — 445 × 68 px over the Exams `h1`, 279 × 56 px over the V2 Projects `h1` | E07, E12; measured | CONSISTENCY | SYSTEM FIX | P2 | S6 | Every screen | Reduce opacity or move out of text bands |
| F39 | Global | All | 146 `:hover` rules vs 14 `:focus-visible` and 6 `:active` | grep | CONSISTENCY / A11Y | SYSTEM FIX | P2 | S6, S7 | Every screen | Full state set on shared primitives |
| F40 | Global | Motion | One `prefers-reduced-motion` rule in the whole codebase | grep | ACCESSIBILITY | SYSTEM FIX | P2 | S7 | Every animated surface | Honour the preference in the motion tokens |
| F41 | Global | Build | 1.20 MB single JS chunk (258 KB gzip) — both apps plus six dev labs | `npm run build` | PERFORMANCE | SYSTEM FIX | P2 | — | Initial load | Route-level code-splitting; exclude labs from production |
| F42 | Segmentation | Mount | 101 KB of CSS injected into a runtime `<style>` tag | Measured | ENG RISK | SYSTEM FIX | P2 | S6 | All 18 style-literal files | Move to real stylesheets as primitives land |
| F43 | Global | Fonts | Fonts `@import`ed from `fonts.googleapis.com` inside runtime `<style>` tags, per screen, with differing subsets | `SegmentsScreen.jsx:18` and 2 others | ENG RISK | SYSTEM FIX | P2 | S6 | Every screen | Self-host; load once |
| F44 | Segmentation | Split | Sentence splitter `/[^.!?]+/` ignores Arabic `؟` and `،` | `MakeSegmentationFlowScreen.jsx:4265` | DEFECT / RTL | LOCAL FIX | P2 | — | Segmentation | Use Arabic-aware boundaries |
| F45 | Projects | Card | Arabic + Latin in one unmarked LTR run | Probe: `dir:ltr, dirAttr:null, mixed:true` | DEFECT / RTL | LOCAL FIX | P2 | — | Projects | `dir="auto"` / `<bdi>` |
| F46 | Study | 1.3 | Segment "1.3 Ghusl" displays Jumu'ah source text and Jumu'ah guidance | E02 | DEFECT / DATA | LOCAL FIX | P2 | S1 | Study fixtures | Correct the fixture |
| F47 | Global | Lint | 42 ESLint errors on a clean checkout — 8 are `react-hooks/set-state-in-effect` | `npm run lint` | ENG RISK | SYSTEM FIX | P2 | — | 20 files | Fix; gate CI |
| F48 | V2 | Quality Dashboard | React duplicate-key errors from `ProjectResearch` and `Projects` | Console, 1440 | ENG RISK | LOCAL FIX | P2 | — | 2 components | Unique keys |
| F49 | Global | Config | `src/styles/` (Tailwind + fonts) unimported; Tailwind not a dependency; `src/index.css:root` is unrelated boilerplate (`--accent: #aa3bff`) | grep | ENG RISK | LOCAL FIX | P3 | — | Config | Delete |
| F50 | Legacy | `#legacy-segments` | A 3,226-line orphaned screen route, unreachable from any navigation, with the highest collision count in the app (27 at 1440, 40 at 390) | Probe | ENG RISK | LOCAL FIX | P3 | — | Dead code | Delete or archive |
| F51 | Legacy | `?preview=1` | `ViewportPreview` calls `useRef`, which `App.jsx` does not import | `App.jsx:3` vs `:141` | DEFECT | LOCAL FIX | P3 | — | Dev-only mode | Fix import or delete |
| F52 | Global | Tests | `ui-snapshots.spec.js` asserts nothing; no product tests exist | Read | TESTING | MISSING | P1 | — | Whole product | Section 11, phase 1 |

---

## SECTION 7 — Screens / workflows requiring redesign

Only two. Everywhere else, incremental fixes are the right instrument.

### R1 · Responsive strategy for the Study workspace — **REDESIGN**

**Why incremental fixes cannot work.** Study is a four-region simultaneous-visibility workspace: nav rail, segment tree, reading + editing column, support panel. Its premise is that source, translation and support are visible *at once*. At 390 px that premise cannot hold — there is no combination of breakpoints that fits four regions into 390 px. Verified: the centre column is not squeezed at 390 px, it is entirely absent (E04, E09).

**What needs designing, not fixing.** Which region owns the phone screen; how the other three are reached; where the segment tree goes; whether Study is a phone surface at all. `TODO.md` already flags this as unresolved: *"The four-pane Study workspace is the hard case… The 51 px rail cannot survive as-is."* That judgement is correct.

**Decision required from the product owner:** is mobile in scope for the first release? If no, this drops to P2 and the desktop fixes in S4/S5 are sufficient. If yes, this is a design workstream, not a bug list.

### R2 · Collapse legacy and V2 into one application — **REDESIGN**

**Why incremental fixes cannot work.** Two Study screens, two Exams screens, two Projects screens, two Segmentation flows, two segment data constants, two navigation systems — with no link between them. Every finding in this audit that appears in both halves (F01/F02 draft wiring, F03 grading, S6 primitives, S7 accessibility) must currently be fixed twice, in code that has diverged. Patching either half in isolation increases the divergence.

**The direction is already clear and does not need re-litigating.** V2 has the correct spine — route registry, layout contracts, tokens, fixed-viewport discipline, no overflow defects. Legacy has the behaviour. The work is **migrating behaviour onto the V2 spine**, screen by screen, retiring each legacy route as its V2 counterpart reaches parity. Research (K1) proves this can produce a better result than the legacy original.

**Sequencing note.** Do S1 and S2 (the data layer and input wiring) *on the V2 spine only*. Building them twice would be the single most wasteful thing this project could do next.

---

## SECTION 8 — Missing capabilities and states

| ID | Missing | Where it should exist | Impact | Pri |
|---|---|---|---|:--:|
| M1 | **A project entity** — nothing identifies which project a user is in | Everywhere | Root of S1. Every handoff loses context | P0 |
| M2 | **Draft persistence for translations** | Study, V2 Study | Users lose written work on reload | P0 |
| M3 | **Exam attempt persistence** | Exams | Attempt lost on reload while the UI claims "SAVED" | P0 |
| M4 | **Real evaluation of any kind** | Study, Exams | The product's central promise is simulated | P0 |
| M5 | **A true empty state** — no project, no source, no segments | Home, Projects, Research, Exams | A first-run user cannot be represented; every screen assumes seeded data | P1 |
| M6 | **Any error or failure state** — network, save, load, evaluation | Everywhere | One `status === 'error'` branch exists in the whole app; no boundary | P1 |
| M7 | **A not-found state** | Routing | Unknown routes silently render an unrelated screen | P2 |
| M8 | **Research in the navigation** | V2 rail | The best screen is undiscoverable | P1 |
| M9 | **Provenance banner for Research → Study** | Study | Pattern exists for exams (K2); not reused | P2 |
| M10 | **Manual segmentation** | Segmentation | Options offer "Manual start"; no manual path was reachable in testing | P2 |
| M11 | **Reduced-motion support** | Motion tokens | One rule guards an app full of animation | P2 |
| M12 | **A skip link and a keyboard model for the four-region workspace** | Study | Keyboard users traverse the whole rail before reaching content, and reach debug buttons before Submit | P1 |
| M13 | **Loading and empty states at scale** — many projects, many segments, long names | Home, Projects, Research | Untestable today: no way to create a second project | P2 |
| M14 | **Visual-regression baseline** | CI | No ability to detect visual regressions | P1 |

---

## SECTION 9 — Engineering assessment

**Architecture.** Two applications, one repo, switched by `RootApp.jsx` on a hash prefix. V2's half is well-conceived: a route registry with per-route shell configuration, executable layout contracts per screen, a factored token set, and a five-lane static audit harness. Legacy's half has no shared layer at all — five screens and four panels, each self-contained, each carrying its own CSS.

**Maintainability.** The top five files are 5,947 / 3,226 / 3,164 / 2,721 / 2,313 lines. All CSS lives in template literals across 18 files (one screen injects 101 KB at mount). 198 distinct hex colours in 978 occurrences, spanning two greyscales. Roughly 25 button class families. This is the dominant cost driver: a change to the primary button today means editing at least five implementations across two applications.

**State management.** `useState` per screen, module-level constants for data, `window.location.hash` for navigation with no payload. `localStorage` holds Study's submission state and the segmentation preferences — both round-trip correctly. `sessionStorage` holds the exam→study context — correctly. Nothing holds a project, a draft, or an attempt.

**Persistence and autosave.** Two things persist correctly (Study submission state, segmentation preferences). The two things a user would most expect to persist — their translation and their exam answers — do not. One of them displays a badge saying it does.

**Async and error handling.** `useServerQuery` is a competent mini-React-Query with cache, status, refetch and optimistic update — used in exactly one place. Elsewhere: `setTimeout` for simulated latency, and no failure path. No `ErrorBoundary` in `src/`; a render error blanks the app.

**Component boundaries.** V2 separates screen / primitives / contract cleanly. Legacy's `CenterPanel` (2,721 lines) owns the reading view, the editor, the discussion panel, the floating window, the results view and their styles. `react-refresh/only-export-components` fires 11 times, indicating mixed exports across module boundaries.

**Fragile effects.** `react-hooks/set-state-in-effect` fires 8 times and `exhaustive-deps` 5 times — cascading-render and stale-closure risk in screens that are already the largest.

**Accessibility implementation.** Not present as a practice. No landmarks on the legacy screens, unlabelled core inputs, a colour ramp whose palest value is used at its smallest size, hit targets down to 16 px, and one reduced-motion rule.

**Test architecture.** `tests/audit/*` — 28 tests, real fixtures, testing the audit tooling. `tests/ui-snapshots.spec.js` — a screenshot dumper with no assertion. **Zero tests of product behaviour.** The segmentation splitter, the exam scorer, the persistence round-trip and the routing table are all pure, deterministic and trivially unit-testable, and none is tested.

**Observability.** No logging, no error reporting, no analytics. The audit lanes are the only signal, and they measure code doctrine rather than behaviour. Note also that `artifacts/qa/static-doctrine-audit.json` records absolute paths under `/Users/arshadbabar/code/design-sandbox/` — a prior repo location — so the checked-in audit artefacts are stale.

**Performance.** Nothing measured as slow: DCL ≈ 98 ms on every screen, DOM ≤ 771 nodes, build in 1.42 s. The risks are structural: a 1.20 MB single chunk that ships both applications and six developer labs to every user; runtime CSS injection; and per-screen Google Fonts `@import`s. **No performance work is warranted before the structural work — measure again after code-splitting.**

**What should *not* be rewritten.** The V2 route/contract/token architecture, `useServerQuery`, the audit harness, and the visual language. All are sound. The work is adoption and migration, not replacement.

---

## SECTION 10 — Release gates

| # | Gate | Result | Evidence |
|---|---|:--:|---|
| 1 | No P0 defects | **FAIL** | Eight P0s: F01–F06, F08, plus M1–M4 |
| 2 | Core journeys complete successfully | **PARTIAL** | A and D complete navigationally but lose the user's work; B is unwired; **C passes** |
| 3 | No P1 state-loss or data-integrity issues | **FAIL** | Segmentation output discarded; drafts never saved and bleed across segments; exam attempts lost on reload |
| 4 | No systematic text collisions or clipping at supported desktop widths | **FAIL** | Title/status collision at 1440 and 1024; toolbar occlusion in Seg Review; 373 px of source text hidden |
| 5 | Primary workflows function at supported responsive widths | **FAIL** | Non-functional at 390; collisions at 1024 |
| 6 | Keyboard and focus behaviour works for primary actions | **FAIL** | Editor unlabelled; debug buttons precede Submit in tab order; only 14 `:focus-visible` rules |
| 7 | No inaccessible critical controls | **FAIL** | 16 × 16 and 28 × 28 targets; unnamed core inputs |
| 8 | Loading and error states do not trap the user | **PARTIAL** | Loading states are well handled; **error states essentially do not exist** |
| 9 | Autosave / persistence works where required | **FAIL** | Two of four required cases fail; one displays a false success badge |
| 10 | Shared controls standardised enough to avoid cross-screen inconsistency | **FAIL** | ~25 button families; 198 hex values; 859 findings in the project's own audit |
| 11 | Critical journeys have automated e2e coverage | **FAIL** | None |
| 12 | Visual-regression baseline exists or is a stated requirement | **FAIL** | `ui-snapshots.spec.js` captures but asserts nothing |
| 13 | No major unexplained console/runtime errors | **PARTIAL** | Clean on product routes; React duplicate-key errors on Quality Dashboard |
| 14 | Production failure and recovery behaviour is adequate | **FAIL** | No `ErrorBoundary`; no retry; no recovery surface |
| — | Real evaluation of user work exists, or fabricated output is labelled | **FAIL** | Neither |

**0 PASS · 3 PARTIAL · 12 FAIL.**

---

## SECTION 11 — Prioritised implementation plan

Ordered by dependency, not by screen. Each phase makes the next one cheaper.

### Phase 0 — Stop asserting things that are not true *(days — do this before anything else)*
0.1 Remove the "AUTOSAVE — SAVED" badge, or make it true (F06).
0.2 Label every fabricated grade, review date, reference translation and exam score as sample data (F03, F04, F08).
0.3 Gate `DRAFT/FAIL/PASS`, the dev nav pill and the `#V2/…` route strings behind a dev flag (F24, F25, F28).
0.4 Repoint the default V2 route away from `appLaunch` (F26).
*Cheap, and it removes the risk of anyone — including a future AI session — mistaking the prototype for a working product.*

### Phase 1 — Safety and reliability blockers
1.1 Add `ErrorBoundary` + a recoverable error surface (F32, M6).
1.2 Introduce the project/segment/attempt model and a context-carrying navigation function, generalising `handleJumpToStudy` — **on the V2 spine only** (S1, M1).
1.3 Wire the translation editor: segment-keyed, persisted (S2, F01, F02, M2).
1.4 Persist exam attempts (F06, M3).
1.5 Connect segmentation output to Study (F05).
1.6 Define the evaluation boundary — one interface, one real implementation or one clearly-labelled stub (S3, M4).
1.7 **First product tests:** unit tests for the splitter, scorer and persistence round-trip; Playwright e2e for journeys A–D (F52, gates 11–12).

### Phase 2 — Shared and system fixes
2.1 Build `Button`, `Card`, `Chip`, `Panel`, `Field`, `IconButton` against the existing tokens; migrate screen by screen (S6, F37, F39).
2.2 Retune the colour ramp and set a minimum type size at token level (F17, F18).
2.3 Enforce a 44 px hit area in the shared icon-button (F20).
2.4 Replace the absolute-positioned headers with real flex layouts (S5, F10, F11, F34).
2.5 One breakpoint scale; delete the 24 ad-hoc media queries (S4, F14).
2.6 Self-host fonts; load once; delete `src/styles/` and the boilerplate `:root` (F16, F43, F49).

### Phase 3 — High-value local fixes
3.1 Source-text sizing and scroll affordance in Study (F12).
3.2 RTL for the source intake box (F15) and Arabic-aware sentence splitting (F44).
3.3 Research into the V2 rail (F29); provenance banner on arrival (F30).
3.4 "Resume attempt" in the exam library (F07); reconcile result counts (F09).
3.5 Not-found states (F33); correct the 1.3 Ghusl fixture (F46).
3.6 Home card alignment (F35); Study dead space (F36); watermark opacity (F38).

### Phase 4 — Genuine redesigns
4.1 Responsive strategy for the Study workspace (R1) — **needs a product decision on mobile scope first**.
4.2 Continue the legacy → V2 migration, retiring legacy routes as parity is reached (R2, F31).

### Phase 5 — Accessibility and performance hardening
5.1 Landmarks, list semantics, labels, heading order, skip link (F19, F21, F22, M12).
5.2 Keyboard model for the four-region workspace; implement or remove ⌘Enter (F23).
5.3 Reduced-motion support in the motion tokens (F40, M11).
5.4 Route-level code-splitting; exclude labs from the production bundle; then re-measure (F41, F42).

### Phase 6 — Polish
6.1 Casing, spacing and rhythm sweep once the primitives are in place.
6.2 Fix the 42 lint errors; gate CI (F47, F48).
6.3 Delete `#legacy-segments` and other dead code (F50, F51).

### Phase 7 — Deferred opportunities
Manual segmentation (M10); scale states for many projects and segments (M13); analytics and error reporting.

---

## SECTION 12 — Deferred / deliberately ignore

Things a thorough audit surfaces that are **not worth acting on now**. Leave them alone.

| Item | Why leave it |
|---|---|
| **The visual language** | It is good. Restyling it would burn the project's strongest asset. Fix the implementation (Phase 2), not the design. |
| **The six developer labs** | Legitimate internal surfaces. Exclude from the production bundle; do not polish or delete. |
| **The audit-lane harness** | Real infrastructure. It reports doctrine findings that Phase 2 will resolve as a by-product. Do not chase its 859 findings item by item. |
| **`useServerQuery` vs. a real query library** | Adequate and correct. Revisit only if the data layer grows past a handful of endpoints. |
| **CSS-in-template-literals as a pattern** | Real debt, but it dissolves as the primitives land. A dedicated migration ahead of Phase 2 would be wasted work. |
| **The "Arapal" watermark concept** | The overlap is worth fixing (F38); the device itself is part of the visual identity. Keep it. |
| **The Quality Dashboard screen** | Internal. Fix its two console errors; do not design it. |
| **Perceived performance** | Nothing is slow. Do not optimise before code-splitting changes the picture. |
| **1366 × 768 and 1920 × 1080** | Both behaved acceptably. Not a priority alongside 1024 and 390. |
| **The exact segmentation chunking heuristic** | Deterministic and defensible; "2 segments from 3 sentences" is correct at Balanced granularity. Only the Arabic punctuation gap (F44) needs fixing. |
| **Copy and voice** *(e.g. "Deploy a pristine environment. Import initial parameters upon readiness.")* | Off-register for an Arabic-study product, but it is a content pass, not a quality defect. Batch it with Phase 6. |

---

## Appendix — Method and confidence

**Verified** (directly observed in the running application, with measurement or reproduction): every finding in Section 6 except where noted below. Layout geometry was read from `getBoundingClientRect` and computed styles on the live page, not inferred from source. Journeys were driven end to end in Playwright and independently spot-checked in an interactive browser.

**Reasoned inference:** the blast-radius counts in S6 (hex-value and button-family counts are exact `grep` results; the claim that they represent five *distinct* primary-button implementations is inferred from class prefixes and separate style blocks).

**Not tested — stated limitations:**
- Real assistive technology (screen readers). Findings under G are structural — landmarks, names, contrast, target size — all measured, none screen-reader-verified.
- Browsers other than Chromium.
- Scale behaviour (many projects, many segments). **Not testable today**: there is no way to create a second project, which is itself finding M13.
- Browser zoom and OS text scaling.
- Any backend, network or offline behaviour. None exists.

**Two probe results were investigated and discarded as false positives**, and are not reported as findings: (1) primary buttons showing `scrollHeight > clientHeight` — traced to a decorative pseudo-element, not text clipping; (2) collisions reported inside `overflow: auto` scroll containers — an artefact of measuring a scrolled child's full rect.

**Repository state:** no application source was modified. `npm run audit:static` and `npm run build` were executed; the four `artifacts/` and `public/v2-audit/` files they rewrote were reverted with `git checkout`. `dist/` is git-ignored. The only additions are this document and `audit-evidence/`.
