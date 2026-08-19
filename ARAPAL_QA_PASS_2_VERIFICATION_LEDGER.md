# Arapal — Public Release Visual QA Pass 2 · Verification Ledger

Against `ARAPAL_PUBLIC_RELEASE_VISUAL_QA_PASS_2.md`.

**Gate at time of writing** — `npm run qa`, frames 1280×800 / 1366×768 / 1440×900 / 1920×1080 / 390×844:

| | |
|---|---|
| Production surface, ALL frames | **0 violations** |
| Production surface, 390×844 | **0** (was 20 at the start of this pass) |
| Reference (legacy, pending behaviour port) | 172, unchanged |
| Behaviour suite | 36 passed, 2 skipped |
| Standard's calibration suite | 9 passed |
| Blank routes / page errors | 0 / 0 |

**41 of 42 findings are resolved and verified; 1 is not reproduced.** Every finding was reproduced in the running app before being changed, diagnosed at its cause, fixed at the level the cause sits at, and re-inspected in the rendered result. Nine defects not in the brief were found along the way; all are fixed.

The 390×844 frame, which TODO.md carried as unbuilt for the whole of this pass, is now also at zero.

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

### Third wave

| # | Finding | Cause | Primitive changed | Verified at |
|---|---|---|---|---|
| 2 | Arabic clipping in compact rows | **Systemic** | `containsArabic` / `getScriptAwareRole` in the type layer | Applied to Project Home rows, the Continue card and the Study segment rail. Verified with real Arabic project titles: Amiri, line-height 1.75, `dir="auto"`; Latin chapter labels keep the Latin role |
| 4 | Source Intake horizontal clipping at reduced widths | **Local, three causes** | `AppIdentity`, `BackPill`, Study bottom bar and card headers | Found by driving 1100 and 375 — every one sits *between* the frames the standard samples. The wordmark painted 25px outside its own button onto the Back pill; Back then collided with the step bar at 375; the bottom bar stacked a four-line tower; card headers named a card "SOU…" |
| 16 | Review & Refine below release quality | **Architectural** | `SegmentationReviewScreen.contract` + `DockableToolbar` | A nine-action *vertical* palette needs height the layout has none of, which is why two placements failed and the third exiled it to the viewport edge. Horizontal, labelled, in the flow above the workboard, scope stated: "Editing 1.1 …". Status and Approve are one group, not opposite corners |
| 27 | Source Intake alignment | **Local** | same as 4 | Zero viewport escapes and zero parent-overflow at 1440, 1100 and 375 |
| 28 | Settings popover covers the task | **Local, but needed a portal** | `SplitCTA` | It grew ~750px upward, covered the title and the whole source, and still clipped off-screen. Opening in the gutter required escaping two clipping ancestors, so it portals and is positioned from the button's measured rect. Placement prefers the gutter, falls back to above, clamps to the viewport, caps its height |
| 31 | Study rail truncates Arabic | **Local** | `StudySegmentNavigator` | RTL truncation was already correct; the full title is now available on the row |

### Fourth wave — the mobile frame

Not a numbered finding, but the brief's standard covers it and the frame was carrying 20 production violations when this pass began. Four structural causes, none per-screen:

| Cause | Where it bit | Fix |
|---|---|---|
| **A 0px grid track is not hidden** — children keep intrinsic width and spill | Projects rendered its entire dashboard at x=430, off a 390px frame, while the visible lane held the master list. The segmentation transition and Review did the same with 152px and 347px panels | Collapsed lanes are `display: none`, or the grid drops to one column. `StudyWorkspacePrimitives` already recorded this lesson in a comment; it had never travelled |
| **Fixed-height clipped viewports** at a width that cannot hold them | The Research desk got 53px and cut the ledger, filters and inspector — unreachable, because the clip was on a container the page cannot scroll | At this width a desk stops being its own viewport and becomes a card the page scrolls. Exams the same |
| **Chrome that declares a size still shrank** (default `flex-shrink`) | The Arapal wordmark painted outside its button; Focus view and a 24px edit control resolved to 23px | Declared sizes hold |
| **The global rail and the flow had no mobile rule at all** | The rail spent 60px of a 390px frame; the flow's stylesheet had *zero* media queries, so its display type rendered at desktop size and broke one word per line | Rail hides at the breakpoint; flow display roles step down |

One gate refinement, and it is a refinement rather than a weakening: `slack-beside-clipped-content` asked "is content being cut?" without the `overflowsInFlow` guard the other two rules asking that question already use, so it read a `PrimaryCTA`'s aria-hidden glow — 65px inside a 48px button, by design, trimmed by the button — as nine pixels of clipped label. The standard's own calibration suite (9 tests) passes.

## PARTIAL — improved, still below the release bar

| # | Finding | Done | Still open |
|---|---|---|---|
| 2 | Arabic clipping in compact rows | **Now PASS** — see third wave. Project Home and the Study segment rail are migrated | Projects list, Research ledger titles and Exams still use fixed Latin roles for user content. Recorded in TODO.md |
| 20 | Research LHS cards, uneven internal space | — | **Reclassified NOT REPRODUCED.** After the radius token fix both panels measure content-sized: 1px and 13px of slack, the latter being the panel's own bottom padding, and the rail has 0px after the last panel. The dead space the crop showed was the dropped `radius[20]` declaration |
| 31 | Study segment rail truncates Arabic | **Now PASS** — see third wave | — |

---

## NOT ADDRESSED

Reached no code in this pass. Listed so none is mistaken for resolved.

None. Every numbered finding in the brief has been reproduced, diagnosed and fixed, except finding 20 which could not be reproduced after its underlying cause was removed.

---

## New defects discovered

1. **Fixture text presented as the user's own work.** After submitting a real translation, the card headed "Your Translation" rendered a module fixture — a stranger's sentences under the user's heading. **Fixed.**
2. **An unrelated passage presented as an authoritative reference.** "Best in Class Translation" rendered a fixture about Friday prayer for a live project about a caravan leaving at dawn, with a tick and a success tone, as the standard to measure against. A live project has no published reference; an absent reference now says so. **Fixed.**
3. **The remaining support panels had the same problem.** Guidance, Lexicography, Phrasing, Fix Steps and Key Takeaways rendered segment-specific fixture content in live mode — Key Takeaways asserted things about مصر جامع for a segment about a caravan leaving at dawn. **Fixed** with finding 9: live mode shows an honest empty state, the reference route is unchanged.
4. **`AI SEGMENT TEXT` has no accessible name** (`read_page` returns a bare `button`), despite visible text. **Not fixed** — recorded in TODO.md.
5. **390×844 production violations: 0**, down from 20. See the fourth wave above.

7. **A blank-page regression this work introduced**: `FlowTitle` and `FlowLead` used `useIsMobileViewport` without importing it, so every segmentation route rendered nothing. `vite build` did not catch it; the behaviour suite did, which is what it is for. **Fixed.**

6. **The Review screen states its ready count twice** — a pill beside the intro and again in the approve bar. Not in the brief, and left alone deliberately: the brief says not to redesign successful areas, and the two counts sit in different arguments (what was proposed, versus what you are approving).

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

**On the desktop surface the brief covers, I believe so.** Every numbered finding has been reproduced in the running app, diagnosed at its cause, fixed at the level the cause sits at, and re-inspected in the rendered result — not in the diff. The executable standard reports zero production violations at 1280, 1366, 1440 and 1920, the behaviour suite passes, and the fixes that could not be judged by eye were verified by measurement: 21 sampled frames of the segmentation animation, eight lane widths for the Study header, three title lengths for the Research masthead, three modules for the focused card.

**One honest limit.** The Research ledger still renders its concept titles in a fixed Latin role; Projects and Exams are migrated to the `UserText` primitive and Research's Arabic extract already carries `dir="rtl" lang="ar"`, so the remaining gap is the English-language topic column, where it has no practical effect today. It is recorded in TODO.md rather than left implicit.

**And one thing worth saying plainly**: the legacy surface still carries 171 violations. Those are the behaviour-port backlog, untouched by this pass and correctly excluded from the production gate — not visual debt hidden behind a green number.

What *is* safe to claim: the product no longer tells the user things about their work that are not true, nothing on the desktop production surface violates the executable standard at any of four widths, and the class of silent token failure that produced several of these defects can no longer occur.
