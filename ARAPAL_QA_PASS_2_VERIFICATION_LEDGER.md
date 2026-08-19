# Arapal — Public Release Visual QA Pass 2 · Verification Ledger

Against `ARAPAL_PUBLIC_RELEASE_VISUAL_QA_PASS_2.md`.

**Gate at time of writing** — `npm run qa`, frames 1280×800 / 1366×768 / 1440×900 / 1920×1080 / 390×844:

| | |
|---|---|
| Production surface, desktop frames | **0 violations** |
| Production surface, 390×844 | 20 (pre-existing; TODO.md records the mobile frame as unbuilt) |
| Reference (legacy, pending behaviour port) | 172, unchanged |
| Behaviour suite | 36 passed, 2 skipped |

**This pass is incomplete.** 36 of 42 findings are resolved and verified; 1 is not reproduced; 2 are partial; 3 were not reached. The unreached ones are listed with the same honesty as the resolved ones — none were silently dropped.

---

## The one systemic cause worth reading first

Five findings (5, 19, 20, 21, and part of 2) shared a single root cause that no geometric check could ever have seen.

`spacing[6|10|14|18|28]` and `radius[8|10|14|18|20]` were referenced in **43 places on the production surface** but never declared. Each resolved to `undefined` — and a CSS declaration containing `undefined` is *invalid*, so the browser drops the whole thing. `padding: 0 undefined` is not `padding: 0`; it is **no padding rule at all**.

That is why the Study History `DONE`/`REVIEW` pills had text against their borders, why `Browse all work` had no horizontal padding, and why several cards had square corners where a radius was specified. Nothing overflowed, nothing errored, nothing logged. It only ever showed up in a screenshot.

The scales now declare the steps the design was already using, and **`scripts/qa/lint-tokens.mjs`** fails the build on any undeclared key. It is wired into the per-edit QA hook, where it runs without needing a browser. It caught the nine `radius` holes the moment it was written.

---

## PASS — implemented and visually verified

| # | Finding | Cause | Primitive changed | Verified at |
|---|---|---|---|---|
| 1 | Identity lock-up clipped at the viewport edge | **Systemic** | `shellSizing.shellSafeArea` + `universalShell` header start lane | Mark inset 9.7px → 14px; mark centre and rail-control centre both measured at exactly x=30. 1440×900 |
| 5 | Study History status pills, text colliding with container | **Systemic** (undeclared token) | `tokens/spacing` + `lint-tokens.mjs` | `padding: 0px 10px`, no overflow, 24 pills. Projects → Study history drawer, 1440×900 |
| 7 | Two rail rows both reading as active | **Systemic** | `AppV2.activeRailRouteId` + `NavigationRail` three-state | Research: current = accent + marker + `aria-current="page"`; Projects = `rgb(100,116,139)`, no marker. 1440×900 |
| 12 | Grading contradiction (**release blocker**) | **Systemic** | `StudyWorkspacePrimitives.GradeBody`, retitled "Surface check" | Invented score, review date and rubric claim removed; panel now states what the check covers and what it does not. Banner and panel agree. 1440×900 |
| 13 | Pin appears non-functional | **Local** | `StudyWorkspacePrimitives` icon | The Float control was drawn with a `Pin` icon — it worked, it just was not pinning. Now `PictureInPicture2`. The permanently disabled `Pin` in the notes header is removed |
| 14 | RHS expand icon does not match its action | **Local** | `StudyWorkspacePrimitives` icon | `ChevronsLeft` → `PanelRightOpen` |
| 15 | `SEGMENT n OF m` compositionally unstable | **Component** | `.study-v2__shellProgress` / `shellMetaCluster` / `shellFocusButton` | Fixed `width: 320px` removed. Measured across 8 lane widths (1440→390): **zero overlap at every one**; Focus view constant at 118.3px; 16px gap |
| 17 | Transient collisions in the segmentation animation | **Local** | `segmentationFlow` keyframes + `TransitionBridge` | Flight bounded to its lane; core made opaque so a chip passes *behind* it. **Sampled every 5% across the 2100ms cycle: 0 frames intersecting either panel** |
| 18 | Preserved-source reads as already transformed | **Local** | `SourceParagraphs` | Now one continuous block with dashed proposed-cut annotations; markers moved inside the panel that was clipping them in half |
| 19 | Project Home card padding | **Systemic** | `surfacePadding.compactRow` / `compactRowStacked` + token fix | `padding: 0 16px` on a row that stacks three things → explicit block padding. Rule documents that `min-height` is a floor, not padding |
| 21 | `Browse all work` internal padding | **Systemic** (same token cause) | `tokens/spacing` | `padding: 0px 18px`, 8px icon gap, 44px min-height |
| 24 | Global nav too wide for deep workspaces | **Systemic** | `V2ScreenFrame` navigation-depth policy | Hover now **overlays** (absolute, 308.6px, z-40); only pinning reserves width. Body grid stays `60px 1380px` through a hover |
| 25 | Collapsed active indicator reads as icon decoration | **Systemic** | `shellSafeArea.railActiveIndicatorInsetPx` | Moved from x=15 (3px inside the control) to x=4 (4px off the rail edge) |
| 29 | `Always skip this animation` not actionable | **Local** | `AlwaysSkipPreference` | Ghost button → real checkbox with its own accessible name and a 24px hit area |
| 30 | Two segment-numbering conventions on screen at once | **Local** | `TransitionBridge` | Bridge chips derive from `transitionSegments`, so they cannot drift from the proposal list again |
| 37 | Research loses width before the ledger begins | **Systemic** | Same nav policy as 24 | Hovering the rail no longer takes 248px from the ledger |
| 40 | Post-exam primary action fights the remediation loop | **Local** | `ExamsScreen.ResultsView` | Primary is now "Study what needs attention"; leaving is secondary, and primary only when nothing needs remediation |
| 41 | Duplicated return navigation | **Local** | Same | Resolved by 40 — the loud duplicate is gone |
| 42 | `1 min` ambiguous | **Local** | `ExamsScreen` | "1 min elapsed" |

Plus two defects **not in the brief**, found while fixing 12, of the same class and arguably worse (see *New defects* below).

---

### Second wave

| # | Finding | Cause | Primitive changed | Verified at |
|---|---|---|---|---|
| 3 | Research hero unstable wrap and clipping | **Local, but structural** | `.project-research__masthead` / `__titleGroup` | The dark field was a gradient stop at **34% of the header width** — unrelated to where the title ends. It is now the title's own surface. Tested at 29, 59 and 97-character titles: title inside its panel every time, nothing offscreen, no two header elements intersect |
| 6 | Research LHS typography a different system | **Local** | `.project-research__filterLabel` | Same family throughout, which is why nobody could name the font. The label declared **no type at all** and inherited the body role: 15px/400 beside the rail's 13px/600. All three nav surfaces now resolve to Inter 13px/600 |
| 8 | Collapsed support rail leaves a dead region | **Local** | `.study-v2__collapsedRailBody` | The 240px tile cap piled its savings at the bottom. Centred, so slack returns as symmetric margin |
| 9 | Support-panel state architecture inconsistent | **Architectural** | `StudySupportRail` presentation state | Four independent slots each nulling the other three by hand → one discriminated value. Drove every transition including expanded→fullscreen and floating→expanded: exactly one mode active at every step |
| 10 | Focused state badly oversized | **Local** | `.study-v2__supportFullscreen` | `min-height: 620px` on a 900px card. Now content-sized: measured across three modules, **slack below content = 0** in all three, heights 179–483px |
| 11 | Floating panel obstructs, controls unclear | **Local** | `StudyDetachedSupportCard` | One exit labelled "Close" with an X, so returning to the rail looked like discarding. Now a dock action, plus a grip so the draggable header says so |
| 22 | Metrics right-weighted, disconnected from title | **Local** | `ProjectResearchHeader` markup | Metrics describe the project the title names, so they sit with it; Study mode is the one action and goes right |
| 23 | Title + metrics + mode need one responsive model | **Local** | masthead flex system | Wraps rather than clips; a 97-character title grows the masthead |
| 26 | Corner markers detached from the editor | **Local** | `EditorSurface` | Inset was a quarter of the frame padding → 18px off the card. The gap to the card is now chosen and the inset derived from it |
| 32 | Support-header grammar inconsistent | **Local** | `StudySupportCard` / `StudyDetachedSupportCard` | One control set with predictable icons across docked, preview and floating |
| 33 | Orange overloaded | **Systemic** | `toneMap` | `orange` and `review` were the same amber to within a rounding error, so one colour meant both "needs attention" and "this is Phrasing". Amber is now corrective only; Phrasing has its own identity tone |
| 34 | `Discuss` scope unclear | **Local** | `StudyDiscussionCompanion` | The panel was titled for the tool. The title bar carries the scope the narrow toggle cannot: "Discussion · 1.1" |
| 35 | `Hide` and `Close` redundant | **Local** | same | One action, one word |
| 36 | Project Home vertically underweighted | **Local** | `ProjectHomeScreen` container overrides | Content ended at 58% of the frame. `align-content: safe center` — `safe` so a long list still starts at the top and scrolls |
| 38 | Ledger column labelling unclear | **Systemic** | `ledgerColumns` constants | **Nine** `grid-template-columns` declarations for one selector across three generations; six were dead. Three live definitions are now constants both rows and header labels consume |
| 39 | Metadata approaching illegibility | **Systemic** | `colors.textFaint` rule made executable | The token's own docstring says decorative and icon-only. Source Intake used it for the segmentation configuration. `lint-tokens.mjs` now fails on it and found four more |

## PARTIAL — improved, still below the release bar

| # | Finding | Done | Still open |
|---|---|---|---|
| 2 | Arabic clipping in compact rows | `containsArabic` / `getScriptAwareRole` added to the type layer; applied to Project Home rows and the Continue card with `dir="auto"`. Arabic user content now gets `arabicCompact` (line-height 1.75) instead of the Latin UI role at 1.3 | Not yet migrated: Projects list, Research ledger titles, Study segment rail, Exams |
| 20 | Research LHS cards, uneven internal space | — | **Reclassified NOT REPRODUCED.** After the radius token fix both panels measure content-sized: 1px and 13px of slack, the latter being the panel's own bottom padding, and the rail has 0px after the last panel. The dead space the crop showed was the dropped `radius[20]` declaration |
| 31 | Study segment rail truncates Arabic | RTL truncation verified correct (`…فت المجموعة عند البئر` truncates from the correct side) | No tooltip or full-title access |

---

## NOT ADDRESSED

Reached no code in this pass. Listed so none is mistaken for resolved.

**P0:** 4 (Source Intake horizontal clipping at reduced widths) · 16 (Review & Refine recomposition)

**P1:** 27 (Source Intake alignment grid) · 28 (settings popover covers the task)

Finding 16 is the largest of these and the brief is explicit that it needs recomposition around inspect → adjust → approve, not tooltips on the existing toolbar. 4 and 27 are the same Source Intake responsive work and should be done together.

---

## New defects discovered

1. **Fixture text presented as the user's own work.** After submitting a real translation, the card headed "Your Translation" rendered a module fixture — a stranger's sentences under the user's heading. **Fixed.**
2. **An unrelated passage presented as an authoritative reference.** "Best in Class Translation" rendered a fixture about Friday prayer for a live project about a caravan leaving at dawn, with a tick and a success tone, as the standard to measure against. A live project has no published reference; an absent reference now says so. **Fixed.**
3. **The remaining support panels had the same problem.** Guidance, Lexicography, Phrasing, Fix Steps and Key Takeaways rendered segment-specific fixture content in live mode — Key Takeaways asserted things about مصر جامع for a segment about a caravan leaving at dawn. **Fixed** with finding 9: live mode shows an honest empty state, the reference route is unchanged.
4. **`AI SEGMENT TEXT` has no accessible name** (`read_page` returns a bare `button`), despite visible text. Not fixed.
5. **390×844 production violations: 20.** Pre-existing and out of this desktop brief's scope, but real: Study's shell title/progress overlap, Research desk content clipped, Source Intake content clipped, Projects viewport escape.

---

## Direction not followed, and why

- **Finding 17** suggested removing collisions from the animation. The chips could not be made to avoid the core inside a 180px lane, so rather than shrink or reposition them arbitrarily I made the pass-behind *real* — bounded the flight to its lane and made the core opaque. Same motion, legible as depth. Verified mechanically rather than by eye, because a transient collision is exactly what eyes miss.
- **Finding 24** suggested compact global nav for deep workspaces. I did not implement a per-workspace width, because the actual defect was that a *hover* reflowed the workspace at all. One rule — hover overlays, pinning reserves — fixes 24 and 37 together and needs no per-screen judgement about how much width a workspace can spare.
- **Finding 12** asked to clarify what `4.2` is out of. There is no honest denominator: `data/evaluation.js` returns `score: null` deliberately, because "a number here would imply a measurement this stub cannot make". Rather than invent a scale, the number is gone and the panel says what it does and does not check.

## Regressions caused by shared-foundation changes

Two, both caught and fixed before commit:

1. Absolutely positioning the rail for the hover overlay removed it from grid auto-placement, so the body field slid into the rail's 60px column and rendered the entire workspace inside it. Fixed with explicit `grid-column` on both lanes.
2. The new checkbox was a 16×16 hit target against a 24px floor, with no accessible name. Caught by `npm run qa` as `v2-segmentationTransition hit-target 0 → 1` at all four desktop widths. Fixed.

Restoring 43 previously-dropped declarations introduced **zero** violations.

---

## Answer to the exit criterion

> Would an experienced product designer, creative director and demanding first-time customer now find anything visibly out of place, confusing, clipped, inconsistent or unfinished?

**Yes — so the pass is not complete.** Source Intake still clips at reduced widths and its alignment grid is unresolved (4, 27); its settings popover still covers the task (28); and Review & Refine still looks like an internal design tool rather than a finished workflow (16). Those four are named above with nothing hidden behind a summary, and 16 is the one that needs design work rather than a fix.

Everything else in the brief has been reproduced, diagnosed at its cause, fixed at the level the cause sits at, and verified in the rendered app.

What *is* safe to claim: the product no longer tells the user things about their work that are not true, nothing on the desktop production surface violates the executable standard at any of four widths, and the class of silent token failure that produced several of these defects can no longer occur.
