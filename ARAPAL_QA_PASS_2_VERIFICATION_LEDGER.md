# Arapal — Public Release Visual QA Pass 2 · Verification Ledger

Against `ARAPAL_PUBLIC_RELEASE_VISUAL_QA_PASS_2.md`.

**Gate at time of writing** — `npm run qa`, frames 1280×800 / 1366×768 / 1440×900 / 1920×1080 / 390×844:

| | |
|---|---|
| Production surface, desktop frames | **0 violations** |
| Production surface, 390×844 | 20 (pre-existing; TODO.md records the mobile frame as unbuilt) |
| Reference (legacy, pending behaviour port) | 172, unchanged |
| Behaviour suite | 36 passed, 2 skipped |

**This pass is incomplete.** 21 of 42 findings are resolved and verified; 3 are partial; 18 were not reached. The unreached ones are listed with the same honesty as the resolved ones — none were silently dropped.

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

## PARTIAL — improved, still below the release bar

| # | Finding | Done | Still open |
|---|---|---|---|
| 2 | Arabic clipping in compact rows | `containsArabic` / `getScriptAwareRole` added to the type layer; applied to Project Home rows and the Continue card with `dir="auto"`. Arabic user content now gets `arabicCompact` (line-height 1.75) instead of the Latin UI role at 1.3 | Not yet migrated: Projects list, Research ledger titles, Study segment rail, Exams |
| 20 | Research LHS cards, uneven internal space | `radius[20]` was silently dropped and is now applied | The dead-space composition itself is untouched |
| 31 | Study segment rail truncates Arabic | RTL truncation verified correct (`…فت المجموعة عند البئر` truncates from the correct side) | No tooltip or full-title access |

---

## NOT ADDRESSED

Reached no code in this pass. Listed so none is mistaken for resolved.

**P0:** 3 (Research hero wrap/clip) · 4 (Source Intake horizontal clipping at reduced widths) · 6 (Research LHS typography system) · 8 (collapsed support rail dead space) · 9 (unified support-module state architecture) · 10 (oversized focused/full-screen state) · 11 (floating panel obstruction and control semantics) · 16 (Review & Refine recomposition)

**P1:** 22 (right-weighted metric pills) · 23 (one responsive header model) · 26 (corner markers detached) · 27 (Source Intake alignment grid) · 28 (settings popover covers the task) · 32 (support-header grammar) · 33 (overloaded orange semantics) · 34 (`Discuss` scope) · 35 (`Hide` vs `Close` redundancy) · 36 (Project Home vertical composition at low project counts) · 38 (ledger column labelling) · 39 (metadata legibility)

Finding 9 is the largest remaining item and several others (10, 11, 32, 33, 35) are its symptoms — they should be done together as one support-module architecture, not five patches.

---

## New defects discovered

1. **Fixture text presented as the user's own work.** After submitting a real translation, the card headed "Your Translation" rendered a module fixture — a stranger's sentences under the user's heading. **Fixed.**
2. **An unrelated passage presented as an authoritative reference.** "Best in Class Translation" rendered a fixture about Friday prayer for a live project about a caravan leaving at dawn, with a tick and a success tone, as the standard to measure against. A live project has no published reference; an absent reference now says so. **Fixed.**
3. **The remaining support panels have the same problem.** Guidance, Lexicography, Phrasing and Key Takeaways still render segment-specific fixture content in live mode — "Key Takeaways" asserts things about مصر جامع for a segment that does not mention it. Same class as finding 12, **not fixed**; it needs the support-content layer to distinguish reference from live, which belongs with finding 9.
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

**Yes — so the pass is not complete.** Research's hero still wraps unstably and its sub-navigation still reads as a different type system; Source Intake still clips at reduced widths; Review & Refine still looks like an internal tool; and the support modules are still five independent implementations of one idea. Those are named above with nothing hidden behind a summary.

What *is* safe to claim: the product no longer tells the user things about their work that are not true, nothing on the desktop production surface violates the executable standard at any of four widths, and the class of silent token failure that produced several of these defects can no longer occur.
